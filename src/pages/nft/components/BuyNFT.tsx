/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { blockChainConfig } from '@/constants/blockchain';
import { ChainId, CryptoCurrencyEnum } from '@/enums/blockchain';
import { NFT } from '@/interfaces/nfts';
import { nftApi } from '@/services/nfts';
import {
  getBlockchainConfigByChainId,
  getTokenAddressByChainIdAndTokenName,
  isEvmChain,
  isSolanaChain,
  isTokenNativeOnChain,
  mapChainIdToBlockchainName,
  SUPPORTED_TOKENS_BY_CHAIN,
} from '@/utils/blockchain';
import {
  useAppKitNetwork,
  useAppKitProvider,
  useAppKitAccount,
} from '@reown/appkit/react';
import { ethers } from 'ethers-ts';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  AvalancheBlockchainConfig,
  EthereumBlockchainConfig,
} from '@/interfaces/blockchain';

// Thêm biểu tượng cho các loại tiền điện tử
const getCryptoIcon = (token: CryptoCurrencyEnum) => {
  switch (token) {
    case CryptoCurrencyEnum.ETH:
      return (
        <svg
          width='16'
          height='16'
          viewBox='0 0 256 417'
          xmlns='http://www.w3.org/2000/svg'
          preserveAspectRatio='xMidYMid'
        >
          <path
            fill='#fff'
            d='M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z'
          />
          <path fill='#fff' d='M127.962 0L0 212.32l127.962 75.639V154.158z' />
          <path
            fill='#fff'
            d='M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z'
          />
          <path fill='#fff' d='M127.962 416.905v-104.72L0 236.585z' />
        </svg>
      );
    case CryptoCurrencyEnum.SOL:
      return (
        <svg
          width='16'
          height='16'
          viewBox='0 0 397.7 311.7'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fill='#fff'
            d='M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zM64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8zM333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z'
          />
        </svg>
      );
    case CryptoCurrencyEnum.USDT:
      return (
        <svg
          width='16'
          height='16'
          viewBox='0 0 2000 2000'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fill='#fff'
            d='M1000,0c552.26,0,1000,447.74,1000,1000S1552.24,2000,1000,2000,0,1552.38,0,1000,447.68,0,1000,0'
          />
          <path
            fill='#53ae94'
            d='M1123.42,866.76V718H1463.6V491.34H537.28V718H877.5V866.64C601,879.34,393.1,934.1,393.1,999.7s208,120.36,484.4,133.14v476.5h246V1132.8c276-12.74,483.48-67.46,483.48-133s-207.48-120.26-483.48-133m0,225.64v-0.12c-6.94.44-42.6,2.58-122,2.58-63.48,0-108.14-1.8-123.88-2.62v0.2C633.34,1081.66,451,1039.12,451,988.22S633.36,894.84,877.62,884V1050.1c16,1.1,61.76,3.8,124.92,3.8,75.86,0,114-3.16,121-3.8V884c243.8,10.86,425.72,53.44,425.72,104.16s-182,93.32-425.72,104.18'
          />
        </svg>
      );
    case CryptoCurrencyEnum.AVALANCHE:
      return (
        <svg
          width='16'
          height='16'
          viewBox='0 0 1503 1504'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path fill='#fff' d='M287 258L752 995H376L287 258Z' />
          <path fill='#fff' d='M752 995L460 1260L196 995H752Z' />
          <path fill='#fff' d='M915 639L752 995L1215 258L915 639Z' />
          <path fill='#fff' d='M1215 258L752 995H1039L1215 258Z' />
          <path fill='#fff' d='M752 995L915 1260L1039 995H752Z' />
        </svg>
      );
    default:
      return null;
  }
};

const tokenDisplayNames: Partial<Record<CryptoCurrencyEnum, string>> = {
  [CryptoCurrencyEnum.ETH]: 'Buy with ETH',
  [CryptoCurrencyEnum.SOL]: 'Buy with SOL',
  [CryptoCurrencyEnum.USDT]: 'Buy with USDT',
  [CryptoCurrencyEnum.AVALANCHE]: 'Buy with Avalanche',
};

function BuyNFTComponent({ nft }: { nft: NFT }) {
  const [isLoading, setIsLoading] = useState(false);
  const { walletProvider } = useAppKitProvider('eip155');
  const networkState = useAppKitNetwork();
  const { address: userAddress } = useAppKitAccount();
  const chainId = useMemo(
    () => networkState?.chainId as ChainId,
    [networkState]
  );
  const { useSubmitTxHashMutation } = nftApi;
  const [submitTxHash] = useSubmitTxHashMutation();

  const buyNFT = async (tokenName: CryptoCurrencyEnum) => {
    try {
      setIsLoading(true);
      if (!chainId) return toast.error('Please connect your wallet first!');
      const isEVM = isEvmChain(chainId);
      const isSolana = isSolanaChain(chainId);
      if (isEVM) {
        const provider = walletProvider
          ? new ethers.providers.Web3Provider(walletProvider)
          : null;
        const signer = provider?.getSigner();
        if (!signer || !userAddress)
          return toast.error('Please connect your wallet first!');
        switch (chainId) {
          case ChainId.Avalanche: {
            return await buyNFTAvalanche(signer, tokenName);
          }
          case ChainId.Ethereum: {
            return await buyNFTWithTokenETH(signer, tokenName);
          }
          default:
            toast.error('Network not supported yet');
            break;
        }
      }

      if (isSolana) {
        toast.error('Solana not supported yet');
      }
    } catch (e: any) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const buyNFTAvalanche = async (
    signer: ethers.providers.JsonRpcSigner,
    tokenName: CryptoCurrencyEnum
  ) => {
    try {
      const isNative = isTokenNativeOnChain(tokenName, chainId);

      const config = getBlockchainConfigByChainId(
        chainId
      ) as AvalancheBlockchainConfig;

      const tokenAddress = getTokenAddressByChainIdAndTokenName(
        chainId,
        tokenName
      );

      const buyerContract = new ethers.Contract(
        config.buyerContractAddress,
        config.buyerContractABI,
        signer
      );

      const nftContract = new ethers.Contract(
        config.nftContractAddress,
        config.nftContractABI,
        signer
      );

      const collectionId = nft.season?.collectionNFTId;
      const tokenId = nft._id;

      const usdPrice = await nftContract.getTokenPrice(tokenId);

      let tx;
      let hash: string;

      if (isNative) {
        // Native token (AVAX)
        const requiredNative = await buyerContract.getNativeTokenAmountForUsd(
          usdPrice
        );
        tx = await buyerContract.buyNFT(
          collectionId,
          tokenId,
          ethers.constants.AddressZero, // address(0) for native
          0,
          { value: requiredNative }
        );
        await tx.wait();
        hash = tx.hash;
        toast.success('NFT purchased successfully with AVAX!');
      } else {
        // ERC20 token
        const tokenContract = new ethers.Contract(
          tokenAddress,
          blockChainConfig.erc20Abi,
          signer
        );
        const requiredAmount = await buyerContract.getTokenAmountForUsd(
          tokenAddress,
          usdPrice
        );
        const approveTx = await tokenContract.approve(
          config.buyerContractAddress,
          requiredAmount
        );
        await approveTx.wait();

        tx = await buyerContract.buyNFT(
          collectionId,
          tokenId,
          tokenAddress,
          requiredAmount
        );
        await tx.wait();
        hash = tx.hash;
        toast.success('NFT purchased successfully with token!');
      }

      const network = mapChainIdToBlockchainName(chainId);

      await submitTxHash({
        txHash: hash,
        network,
      });
    } catch (err) {
      console.error('Error buying NFT:', err);
      toast.error('Failed to buy NFT!');
    }
  };

  const buyNFTWithTokenETH = async (
    signer: ethers.providers.JsonRpcSigner,
    tokenName: CryptoCurrencyEnum
  ) => {
    try {
      const isNative = isTokenNativeOnChain(tokenName, chainId);

      const config = getBlockchainConfigByChainId(
        chainId
      ) as EthereumBlockchainConfig;

      const tokenAddress = getTokenAddressByChainIdAndTokenName(
        chainId,
        tokenName
      );

      const buyerContract = new ethers.Contract(
        config.buyerContractAddress,
        config.buyerContractABI,
        signer
      );

      const collectionId = nft.season?.collectionNFTId;
      const tokenId = nft._id;

      const [requiredAmount, ccipFee] =
        await buyerContract.getCCIPFeeAndMessage(
          collectionId,
          tokenId,
          isNative,
          isNative ? ethers.constants.AddressZero : tokenAddress
        );

      let tx;
      let hash: string;

      if (isNative) {
        const totalValue = requiredAmount.add(ccipFee);
        tx = await buyerContract.buyNFTCrossChain(
          collectionId,
          tokenId,
          true,
          ethers.constants.AddressZero,
          { value: totalValue }
        );
        await tx.wait();
        hash = tx.hash;
        toast.success('NFT purchased successfully with ETH!');
      } else {
        const tokenContract = new ethers.Contract(
          tokenAddress,
          blockChainConfig.erc20Abi,
          signer
        );

        const balance = await tokenContract.balanceOf(userAddress);
        if (balance.lt(requiredAmount)) {
          toast.error('Not enough token balance');
          return;
        }

        const allowance = await tokenContract.allowance(
          userAddress,
          config.buyerContractAddress
        );
        if (allowance.lt(requiredAmount)) {
          const approveTx = await tokenContract.approve(
            config.buyerContractAddress,
            requiredAmount
          );
          await approveTx.wait();
        }

        tx = await buyerContract.buyNFTCrossChain(
          collectionId,
          tokenId,
          false,
          tokenAddress,
          { value: ccipFee }
        );
        await tx.wait();
        hash = tx.hash;
        toast.success('NFT purchased successfully with token!');
      }

      const network = mapChainIdToBlockchainName(chainId);

      await submitTxHash({
        txHash: hash,
        network,
      });
    } catch (err) {
      console.error('Error buying NFT:', err);
      toast.error('Failed to buy NFT!');
    }
  };

  const supportedTokens = useMemo(() => {
    return chainId ? SUPPORTED_TOKENS_BY_CHAIN[chainId]?.buy ?? [] : [];
  }, [chainId]);

  const buttonVariants = {
    hover: { y: -3, boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)' },
    tap: { scale: 0.95 },
  };

  return (
    <div className='flex gap-3 flex-wrap justify-center'>
      {supportedTokens.map((token) => (
        <motion.div
          key={token}
          whileHover='hover'
          whileTap='tap'
          variants={buttonVariants}
          className='relative overflow-hidden'
        >
          <div className='absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          <Button
            onClick={() => !isLoading && buyNFT(token)}
            className='relative z-10 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white border-none shadow-lg shadow-amber-900/20 font-medium'
            size='sm'
            disabled={isLoading}
          >
            {!isLoading ? (
              <>
                {getCryptoIcon(token)}
                <span className='ml-1'>
                  {tokenDisplayNames[token] || `Buy with ${token}`}
                </span>
                <span className='text-xs ml-1 bg-amber-800 px-2 py-0.5 rounded-full'>
                  ${nft.priceUsd}
                </span>
              </>
            ) : (
              <span>Processing...</span>
            )}
          </Button>
          {/* Hiệu ứng ánh sáng khi hover */}
          <div className='absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/30 to-amber-400/0 opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out'></div>
        </motion.div>
      ))}
    </div>
  );
}

export default BuyNFTComponent;
