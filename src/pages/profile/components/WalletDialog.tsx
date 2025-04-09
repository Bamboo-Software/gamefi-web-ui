// src/pages/profile/components/WalletDialog.tsx
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SocialTypeEnum } from '@/enums/user';
import { IUserSocial } from '@/interfaces/IUser';
import { shortenAddress } from '@/utils/wallet';
import { Tooltip } from "radix-ui";
import { useAddWalletMutation } from '@/services/wallet/index';
import { handleError } from '@/utils/apiError';
import { PaymentProviderEnum } from '@/constants/wallet';

interface WalletFormProps {
  title: string;
  icon: React.ReactNode;
}

const formSchema = z.object({
  walletAddress: z.string()
    .min(1, 'Wallet address is required')
    .refine((val) => {
      const isEvm = /^0x[a-fA-F0-9]{40}$/.test(val);
      const isSol = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(val);
      return isEvm || isSol;
    }, 'Invalid wallet address format'),
});
  
  type FormValues = z.infer<typeof formSchema>;
  
  interface WalletFormProps {
    title: string;
    icon: React.ReactNode;
    onSubmit: (data: FormValues) => Promise<void>;
    isSubmitting?: boolean;
  }
  
  const WalletForm: React.FC<WalletFormProps> = ({ onSubmit, isSubmitting: externalSubmitting }) => {
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting }
    } = useForm<FormValues>({
      resolver: zodResolver(formSchema)
    });

    const onFormSubmit = async (data: FormValues) => {
      try {
        await onSubmit(data);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mx-3">
        <div className="flex items-center justify-center">
          {/* Icon space */}
        </div>
        <div className="flex flex-col justify-between w-full items-center space-y-2">
          <Input 
            {...register('walletAddress')}
            type="text" 
            placeholder="Wallet Address" 
            className="w-full rounded-full text-center bg-[#071240B2]"
            aria-invalid={errors.walletAddress ? "true" : "false"}
          />
          {errors.walletAddress && (
            <span className="text-red-500 text-sm">
              {errors.walletAddress.message}
            </span>
          )}
          <Button 
            className='w-full rounded-full bg-[#B7F8FF]' 
            type="submit"
            disabled={isSubmitting || externalSubmitting}
          >
            {isSubmitting ? 'Connecting...' : 'Connect'}
          </Button>
        </div>
      </form>
    );
  };

interface Wallet {
  type: SocialTypeEnum;
  imgContent: string;
  title: string;
  isConnected: boolean;
  walletAddress?: string;
}

interface WalletButtonsProps {
  wallets: {
    metamask: Wallet;
    phantom: Wallet;
  };
  socials?: IUserSocial[];
  refetch: () => void;
  setSelectedProvider: (provider: SocialTypeEnum | null) => void;
  setIsConfirmDialogOpen: (open: boolean) => void;
}

const WalletButtons: React.FC<WalletButtonsProps> = ({ 
  wallets: initialWallets,
  socials,
  refetch,
  setSelectedProvider,
  setIsConfirmDialogOpen,
 }) => {
  const [openDialog, setOpenDialog] = useState<number | null>(null);
  const [wallets, setWallets] = useState(initialWallets);
  const walletsArray = [wallets.metamask, wallets.phantom];
  const [addWallet,{ isLoading: isAddWalletLoading }] = useAddWalletMutation();

  const isSocialConnected = (socialType: SocialTypeEnum): boolean => {
    return !!socials?.some((s: IUserSocial) => s.socialType === socialType);
  };

  useEffect(() => {
    setWallets((prev) => ({
      metamask: {
        ...prev.metamask,
        isConnected: isSocialConnected(SocialTypeEnum.Metamask),
        walletAddress: socials?.find((s) => s.socialType === SocialTypeEnum.Metamask)?.socialId,
      },
      phantom: {
        ...prev.phantom,
        isConnected: isSocialConnected(SocialTypeEnum.Phantom),
        walletAddress: socials?.find((s) => s.socialType === SocialTypeEnum.Phantom)?.socialId,
      },
    }));
  }, [socials]);

  const handleConnectWallet = (index: number) => async (data: { walletAddress: string }) => {
    const wallet = walletsArray[index];

    try {
      const response = await addWallet({
        walletAddress: data.walletAddress,
        provider: wallet.type as unknown as PaymentProviderEnum,
      }).unwrap();
      if (response.success) {
        setWallets((prev) => {
          const updatedWallets = { ...prev };
          const walletKey = index === 0 ? 'metamask' : 'phantom';
          updatedWallets[walletKey] = {
            ...updatedWallets[walletKey],
            isConnected: true,
            walletAddress: data.walletAddress,
          };
          return updatedWallets;
        });
        setOpenDialog(null);
        toast.success('Wallet connected successfully');
        refetch();
      }
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const ConnectedButton = ({ wallet }: { wallet: Wallet }) => (
    <div className="flex items-center gap-2">
      <img 
        src={wallet.imgContent} 
        alt={wallet.title} 
        className="size-8"
      />
      <span>{wallet.isConnected ? 'Connected' : 'Connect'}</span>
    </div>
  );

  return (
    <>
      <div className="w-full flex flex-col space-y-4">
        <Tooltip.Provider>
          {walletsArray.map((wallet, index) => (
          <Tooltip.Root key={index}>
            <Tooltip.Trigger asChild>
              <Button
                onClick={() => {
                  if (wallet.isConnected) {
                    setSelectedProvider(wallet.type);
                    setIsConfirmDialogOpen(true);
                  } else {
                    setOpenDialog(index);
                  }
                }}
                className={`text-gray-50 h-12 text-sm font-semibold flex flex-row justify-center border-2 items-center w-full gap-2 shadow-2xl rounded-md cursor-pointer
                  ${index === 0 ? 'border-[#dbb692] bg-[#FFA24B]' : 'border-[#9c93eb] bg-[#877BEA]'}`}
              >
                <img 
                  className="size-8" 
                  src={wallet.imgContent}
                  alt={wallet.title} 
                />
                <span>
                  {wallet.isConnected && wallet.walletAddress
                    ? shortenAddress(wallet.walletAddress)
                    : `Use ${wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1)} address`}
                </span>
              </Button>
            </Tooltip.Trigger>
            {wallet.isConnected && wallet.walletAddress && (
              <Tooltip.Portal>
                <Tooltip.Content side="top" align="center" className="bg-gray-800 text-white px-2 py-1 rounded-md text-sm">
                  <p>{wallet.walletAddress}</p>
                  <Tooltip.Arrow className="fill-gray-800" />
                </Tooltip.Content>
              </Tooltip.Portal>
            )}
          </Tooltip.Root>
        ))}
      </Tooltip.Provider>
      </div>

      <Dialog 
        open={openDialog !== null}
        onOpenChange={() => setOpenDialog(null)}
      >
        {openDialog !== null && (
          <DialogContent className=" w-5/6 rounded-xl border-[#24E6F3] bg-gradient-to-t from-[#24E6F3] via-[#05A2C6CC] to-[#54a2c9] bg-white/50">
            <DialogHeader>
              <DialogTitle>{walletsArray[openDialog].title}</DialogTitle>
            </DialogHeader>
            <WalletForm
              title={walletsArray[openDialog].title}
              icon={<ConnectedButton wallet={walletsArray[openDialog]} />}
              onSubmit={handleConnectWallet(openDialog)}
              isSubmitting={isAddWalletLoading}
            />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default WalletButtons;