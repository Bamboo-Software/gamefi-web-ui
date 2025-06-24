/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from 'react';
import { ethers } from 'ethers-ts';
import {
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
} from '@reown/appkit/react';
import { ChainId, CryptoCurrencyEnum } from '@/enums/blockchain';
import {
  generateRandomStakeId,
  getBlockchainConfigByChainId,
  getTokenAddressByChainIdAndTokenName,
  isEvmChain,
  isSolanaChain,
  isTokenNativeOnChain,
  mapChainIdToBlockchainName,
  SUPPORTED_TOKENS_BY_CHAIN,
} from '@/utils/blockchain';
import { toast } from 'sonner';
import { blockChainConfig } from '@/constants/blockchain';
import { stakeApi } from '@/services/stake';
import { motion } from 'framer-motion';
import { DataTable } from '@/components/data-table';
import { AvalancheBlockchainConfig } from '@/interfaces/blockchain';
import { IStakeEntry } from '@/interfaces/stake';
import { StakeEntryStatus } from '@/enums/stake';

const StakingComponent = () => {
  const { useSubmitTxHashMutation, useSubmitWithdrawTxHashMutation } = stakeApi;
  const [submitTxHash] = useSubmitTxHashMutation();
  const [submitWithdrawTxHash] = useSubmitWithdrawTxHashMutation();
  const { walletProvider } = useAppKitProvider('eip155');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [stakeId, setStakeId] = useState('');
  const [lockTime, setLockTime] = useState<number>(0);
  const [token, setToken] = useState<CryptoCurrencyEnum | null>(null);
  const networkState = useAppKitNetwork();
  const chainId = useMemo(
    () => networkState?.chainId as ChainId,
    [networkState]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { address: userAddress } = useAppKitAccount();
  const [userUSDBalance, setUserUSDBalance] = useState(0)
  useEffect(() => {
    async function fetchLockTime() {
      try {
        const config = getBlockchainConfigByChainId(
          ChainId.Avalanche
        ) as AvalancheBlockchainConfig;
        const provider = new ethers.providers.JsonRpcProvider(
          blockChainConfig.avalancheRPCUrl
        );
        const contract = new ethers.Contract(
          config.stakingContractAddress,
          config.stakingContractABI,
          provider
        );
        const lockTime = await contract.lockTime();
        setLockTime(Number(lockTime));
      } catch (e) {
        setLockTime(0);
        console.error('Failed to fetch lockTime', e);
      }
    }
    if (chainId) fetchLockTime();
  }, [chainId]);

  const { useGetAllNFTQuery } = stakeApi;
  const { data: stakes } = useGetAllNFTQuery({
    page: currentPage,
    limit: itemsPerPage,
  });
  const stake = async () => {
    if (!token) return toast.error('Please select token first!');
    if (!chainId) return toast.error('Please connect your wallet first!');
    const isEVM = isEvmChain(chainId);
    const isSolana = isSolanaChain(chainId);
    const newStakeId = generateRandomStakeId();

    if (isEVM) {
      const provider = walletProvider
        ? new ethers.providers.Web3Provider(walletProvider)
        : null;
      const signer = provider?.getSigner();
      if (!signer || !userAddress)
        return toast.error('Please connect your wallet first!');
      switch (chainId) {
        case ChainId.Avalanche: {
          const isNative = isTokenNativeOnChain(token, chainId);
          return await stakeAvalanche(signer, token, newStakeId, isNative);
        }
        case ChainId.Ethereum: {
          const isNative = isTokenNativeOnChain(token, chainId);
          return await stakeTokenETH(signer, token, newStakeId, isNative);
        }

        default:
          toast.error('Network not supported yet');
          break;
      }
    }

    if (isSolana) {
      toast.error('Solana not supported yet');
    }
  };

  const stakeAvalanche = async (
    signer: ethers.providers.JsonRpcSigner,
    token: CryptoCurrencyEnum,
    stakeId: string,
    isNative: boolean
  ) => {
    if (!walletProvider) return toast.error('Connect wallet!');
    setLoading(true);
    try {
      const config = getBlockchainConfigByChainId(
        chainId
      ) as AvalancheBlockchainConfig;
      const contract = new ethers.Contract(
        config.stakingContractAddress,
        config.stakingContractABI,
        signer
      );

      let tx;
      if (isNative) {
        // Native staking: tokenAddress = address(0), amount = 0, value = ethers.utils.parseEther(amount)
        tx = await contract.stake(stakeId, 0, ethers.constants.AddressZero, {
          value: ethers.utils.parseEther(amount),
        });
      } else {
        // ERC20 staking: tokenAddress = token address, amount = amountParsed, value = 0
        const tokenAddress = getTokenAddressByChainIdAndTokenName(
          chainId,
          token
        );
        const erc20 = new ethers.Contract(
          tokenAddress,
          blockChainConfig.erc20Abi,
          signer
        );
        const decimals = await erc20.decimals();
        const amountParsed = ethers.utils.parseUnits(amount, decimals);

        // Approve trước
        const approveTx = await erc20.approve(
          config.stakingContractAddress,
          amountParsed
        );
        await approveTx.wait();

        tx = await contract.stake(stakeId, amountParsed, tokenAddress);
      }

      await tx.wait();
      const { hash } = tx;
      const network = mapChainIdToBlockchainName(chainId);

      await submitTxHash({
        network,
        txHash: hash,
      });

      toast.success(
        isNative ? 'Staked native successfully!' : 'Staked ERC20 successfully!'
      );
    } catch (e) {
      toast.error(isNative ? 'Stake native failed!' : 'Stake ERC20 failed!');
      console.error(e);
    }
    setLoading(false);
  };

  const stakeTokenETH = async (
    signer: ethers.providers.JsonRpcSigner,
    token: CryptoCurrencyEnum,
    stakeId: string,
    isNative: boolean // Thêm tham số này để xác định native hay ERC20
  ) => {
    if (!walletProvider) return toast.error('Connect wallet!');
    setLoading(true);
    try {
      const config = getBlockchainConfigByChainId(
        chainId
      ) as AvalancheBlockchainConfig;
      const contract = new ethers.Contract(
        config.stakingContractAddress,
        config.stakingContractABI,
        signer
      );

      let tx;
      let amountParsed: ethers.BigNumber;
      let symbol: string;
      let tokenAddress: string;

      if (isNative) {
        const wethAddress = getTokenAddressByChainIdAndTokenName(chainId, token);
        tokenAddress = ethers.constants.AddressZero;
        symbol = 'WETH';
        amountParsed = ethers.utils.parseEther(amount);

        // Lấy CCIP fee
        const [ccipFee] = await contract.getCCIPFeeAndMessage(
          stakeId,
          amountParsed,
          wethAddress,
          symbol
        );

        // Gọi stakeToken, value = amount + ccipFee
        tx = await contract.stakeToken(stakeId, amountParsed, tokenAddress, {
          value: amountParsed.add(ccipFee),
        });
      } else {
        // ERC20
        tokenAddress = getTokenAddressByChainIdAndTokenName(chainId, token);
        const erc20 = new ethers.Contract(
          tokenAddress,
          blockChainConfig.erc20Abi,
          signer
        );
        const decimals = await erc20.decimals();
        amountParsed = ethers.utils.parseUnits(amount, decimals);
        symbol = await erc20.symbol();

        // Lấy CCIP fee
        const [ccipFee] = await contract.getCCIPFeeAndMessage(
          stakeId,
          amountParsed,
          tokenAddress,
          symbol
        );

        // Approve trước
        const approveTx = await erc20.approve(
          config.stakingContractAddress,
          amountParsed
        );
        await approveTx.wait();

        // Gọi stakeToken, value = ccipFee
        tx = await contract.stakeToken(stakeId, amountParsed, tokenAddress, {
          value: ccipFee,
        });
      }

      await tx.wait();
      const { hash } = tx;
      const network = mapChainIdToBlockchainName(chainId);

      await submitTxHash({
        network,
        txHash: hash,
      });
      toast.success(
        isNative ? 'Staked native successfully!' : 'Staked ERC20 successfully!'
      );
    } catch (e) {
      toast.error(isNative ? 'Stake native failed!' : 'Stake ERC20 failed!');
      console.error(e);
    }
    setLoading(false);
  };

  const withdrawByStakeId = async () => {
    if (!walletProvider) return toast.error('Connect wallet!');
    if(chainId !== ChainId.Avalanche) return toast.error('Switch your network to Avalanche first!');
    setLoading(true);
    try {
      const config = getBlockchainConfigByChainId(
        ChainId.Avalanche
      ) as AvalancheBlockchainConfig;
      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        config.stakingContractAddress,
        config.stakingContractABI,
        signer
      );
      const tx = await contract.withdrawByStakeId((stakeId));
      await tx.wait();
      const network = mapChainIdToBlockchainName(chainId);
      const { hash } = tx;
      await submitWithdrawTxHash({
        network,
        txHash: hash,
      });

      toast.success('Withdraw by stakeId success!');
    } catch (e) {
      toast.error('Withdraw by stakeId failed!');
      console.error(e);
    }
    setLoading(false);
  };
  const supportedTokens = useMemo(() => {
    return chainId ? SUPPORTED_TOKENS_BY_CHAIN[chainId]?.stake ?? [] : [];
  }, [chainId]);

  // Cấu hình cột cho DataTable
  const columns = [
    {
      key: 'stakeId',
      title: 'ID',
      sortable: true,
      render: (item: IStakeEntry) => (
        <span className='font-medium text-white'>{item.stakeId}</span>
      ),
    },
    {
      key: 'amount',
      title: 'Amount',
      sortable: true,
      render: (item: IStakeEntry) => (
        <span className='text-indigo-200'>
          {item.amount.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 6,
          })}
        </span>
      ),
    },
    {
      key: 'isNative',
      title: 'Type',
      render: (item: IStakeEntry) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.isNative
              ? 'bg-green-900/50 text-green-300'
              : 'bg-blue-900/50 text-blue-300'
          }`}
        >
          {item.isNative ? 'Native' : item.symbol || 'Token'}
        </span>
      ),
    },
    {
      key: 'timestamp',
      title: 'Staked Time',
      sortable: true,
      render: (item: IStakeEntry) => (
        <span className='text-indigo-200'>
          {new Date(item.timestamp).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'unlockTime',
      title: 'Unlock Time',
      render: (item: IStakeEntry) => {
        const unlockTimestamp =
          new Date(item.timestamp).getTime() + lockTime * 1000; // item.timestamp có thể là ms hoặc s, kiểm tra lại
        const now = Date.now();
        const isUnlocked = now > unlockTimestamp;
        return (
          <div className='flex flex-col'>
            <span className='text-indigo-200'>
              {new Date(unlockTimestamp).toLocaleString()}
            </span>
            {isUnlocked && !item.withdrawn ? (
              <span className='text-xs text-green-400 mt-1'>
                Ready to withdraw
              </span>
            ) : !item.withdrawn ? (
              <span className='text-xs text-amber-400 mt-1'>Locked</span>
            ) : null}
          </div>
        );
      },
    },
    {
      key: 'status',
      title: 'Status',
      render: (item: IStakeEntry) => {
        return (
          <>
            {item.status === StakeEntryStatus.WITHDRAWN ? (
              <span className='px-2 py-1 rounded-full bg-gray-800 text-gray-400 text-xs font-medium'>
                Withdrawn
              </span>
            ) : item.status === StakeEntryStatus.WAITING ? (
              <span className='px-2 py-1 rounded-full bg-green-900/50 text-green-300 text-xs font-medium'>
                Waiting
              </span>
            ) : item.status === StakeEntryStatus.FAILED ? (
              <span className='px-2 py-1 rounded-full bg-green-900/50 text-green-300 text-xs font-medium'>
                Failed
              </span>
            ) : (
              <span className='px-2 py-1 rounded-full bg-amber-900/50 text-amber-300 text-xs font-medium'>
                Staked
              </span>
            )}
          </>
        );
      },
    },
  ];

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sắp xếp dữ liệu
  const sortedStakes = useMemo(() => {
    if (!stakes) return null;
    if (!sortConfig) return stakes.data.items;
    return [...stakes.data.items].sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [stakes, sortConfig]);

  async function getUserStakesInfo() {
    try {
      const config = getBlockchainConfigByChainId(
        ChainId.Avalanche
      ) as AvalancheBlockchainConfig;
      const provider = new ethers.providers.JsonRpcProvider(
        blockChainConfig.avalancheRPCUrl
      );
      const stakingContract = new ethers.Contract(
        config.stakingContractAddress,
        config.stakingContractABI,
        provider
      );
      const usdBalance = await stakingContract.getStakedBalanceInUSD(userAddress);
      setUserUSDBalance( Number(usdBalance)/10** blockChainConfig.standardDecimals )
    } catch (error) {
      setUserUSDBalance(0)
      console.error("Failed to get user usd balance:", error);
    }
  }

  useEffect(()=> {
    if(userAddress && walletProvider) getUserStakesInfo()
  }, [userAddress, walletProvider])


  return (
    <motion.div
      className='w-full flex flex-col'
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className='px-4 md:px-8 py-6 max-w-7xl mx-auto w-full'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold text-white mb-2 flex items-center'>
            <span className='bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent'>
              Staking
            </span>
            <motion.span
              className='ml-2 inline-block'
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              💰
            </motion.span>
          </h1>
          <div className='h-1 w-32 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 rounded-full'></div>
          <p className='text-gray-300 mt-2'>
            Stake your tokens and earn rewards
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Staking Form */}
          <div className='lg:col-span-1'>
            <div className='bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 h-full'>
              <h2 className='text-xl font-bold text-white mb-4'>
                Stake Tokens
              </h2>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>
                    Amount
                  </label>
                  <input
                    type='number'
                    placeholder='Enter amount'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className='w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-2 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>
                    Select Token
                  </label>
                  <select
                    value={token?.toString()}
                    onChange={(e) =>
                      setToken(e.target.value as CryptoCurrencyEnum)
                    }
                    className='w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50'
                  >
                    <option value={'null'}>Select token</option>
                    {supportedTokens.map((token) => (
                      <option key={token} value={token}>
                        {token}
                      </option>
                    ))}
                  </select>
                </div>

                <motion.button
                  onClick={stake}
                  disabled={loading}
                  className='w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <svg
                        className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 4v16m8-8H4'
                        />
                      </svg>
                      Stake
                    </>
                  )}
                </motion.button>
              </div>

              <div className='mt-8 pt-6 border-t border-purple-700/30'>
                <h3 className='text-lg font-semibold text-white mb-4'>
                  Withdraw
                </h3>

                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-300 mb-1'>
                      Stake ID
                    </label>
                    <input
                      placeholder='Enter Stake ID'
                      value={stakeId}
                      onChange={(e) => setStakeId(e.target.value)}
                      className='w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-2 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50'
                    />
                  </div>

                  <motion.button
                    onClick={withdrawByStakeId}
                    disabled={loading}
                    className='w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <svg
                          className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                          />
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                          />
                        </svg>
                        Withdraw
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Stakes Table */}
          <div className='lg:col-span-2'>
            <div className='bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-6 h-full'>
              <h2 className='text-xl font-bold text-white mb-4'>Your Stakes{userUSDBalance && (
              `: $${userUSDBalance.toLocaleString(undefined, {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 0
                })}`
              )}</h2>

              {stakes && stakes?.data?.total > 0 && sortedStakes ? (
                <DataTable
                  data={sortedStakes}
                  columns={columns}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  totalItems={stakes.data.total}
                  isLoading={loading}
                  rowHoverEffect={true}
                  stripedRows={true}
                  stickyHeader={true}
                />
              ) : (
                <div className='flex flex-col items-center justify-center py-12 text-center'>
                  <div className='w-20 h-20 bg-indigo-900/30 rounded-full flex items-center justify-center mb-4'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-10 w-10 text-indigo-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                  <h3 className='text-xl font-semibold text-white mb-2'>
                    No Stakes Found
                  </h3>
                  <p className='text-gray-400 max-w-md'>
                    You don't have any active stakes. Start staking your tokens
                    to earn rewards.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StakingComponent;
