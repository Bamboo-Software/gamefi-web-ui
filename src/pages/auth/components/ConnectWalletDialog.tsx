import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

  interface IConnectWalletDialogProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
  }
const ConnectWalletDialog = ({ trigger, children}: IConnectWalletDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect to wallets</DialogTitle>
          <DialogDescription>
          Choose a wallet provider to connect with your account and access blockchain features.
          </DialogDescription>
        </DialogHeader>
            {children}
      </DialogContent>
    </Dialog>
  )
}

export default ConnectWalletDialog