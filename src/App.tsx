import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useLocation,
} from 'react-router-dom';
import routesPath from '@/constants/routes';
import ErrorPage from '@/pages/ErrorPage';
import PageLayout from './layouts/PageLayout';
import AirdropPage from './pages/airdrop/AirdropPage';
import AuthPage from './pages/auth/AuthPage';
import AuthLayout from './layouts/AuthLayout';

import GamesPage from './pages/games/GamesPage';
import ProfilePage from './pages/profile/ProfilePage';
import { useGetMeQuery, useLazyGetMeQuery } from './services/auth';
import LotterySpinnerGame from './pages/games/ourgame/lottery-spinner-game';
import AuthCallback from './pages/auth/components/AuthCallback';
import FlappyJfoxGame from './pages/games/ourgame/flappy-jfox-game/FlappyJfoxGame';
import { useRef, useEffect } from 'react';
import MinesweeperGame from './pages/games/ourgame/minesweeper/MinesweeperGame';
import { createAppKit } from '@reown/appkit/react';
import {
  metadata,
  networks,
  projectId,
  solanaWeb3JsAdapter,
  wagmiAdapter,
} from '@/configs/reown';
import { useAuthSocial } from './contexts/AuthSocialContext';
import { DefaultSIWX } from '@reown/appkit-siwx';
import { EIP155Verifier } from "@/services/wallet/EIP155Verifier";
import { SolanaVerifier } from "@/services/wallet/SolanaVerifier";
import StakingComponent from './pages/staking/staking';
import MarketplacePage from './pages/marketplace/MarketplacePage';
import NFTPage from './pages/nft/NFTPage';
import UserNFTPage from './pages/user-nft/UserNFTPage';

const {
  ROOT,
  AUTH,
  GAMES,
  PROFILE,
  GAMES_LOTTERY_SPINNER,
  GAMES_FLAPPY_JFOX,
  GAMES_MINESWEEPER,
  MARKETPLACE,
  STAKING,
  NFT,
  USER_NFT
} = routesPath;

// Thêm hiệu ứng loading đẹp mắt
const LoadingAnimation = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
    <div className="relative">
      <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-amber-400 animate-spin animate-reverse"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full bg-indigo-600 animate-pulse"></div>
      </div>
    </div>
  </div>
);

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('auth-token');
  const { error, isLoading } = useGetMeQuery({});

  if (isLoading) {
    return <LoadingAnimation />;
  }
  if (!token || (error && 'status' in error && error.status === 401)) {
    localStorage.removeItem('auth-token');
    return <Navigate to='/auth' replace />;
  }
  return children;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('auth-token');
  const location = useLocation();
  const [getMe, { isLoading, error }] = useLazyGetMeQuery();
  const isGetMeCalled = useRef(false);

  if (token && !isGetMeCalled.current) {
    getMe({});
    isGetMeCalled.current = true;
  }

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (location.pathname === '/auth/callback') {
    return children;
  }

  if (token && !(error && 'status' in error && error.status === 401)) {
    return <Navigate to='/' replace />;
  }

  return children;
};

// Thêm hiệu ứng chuyển trang
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="page-transition">
      {children}
    </div>
  );
};

const routes = createBrowserRouter([
  {
    path: ROOT,
    element: (
      <PrivateRoute>
        <PageTransition>
          <PageLayout />
        </PageTransition>
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <AirdropPage /> },
      { path: GAMES, element: <GamesPage /> },
      { path: PROFILE, element: <ProfilePage /> },
      { path: GAMES_FLAPPY_JFOX, element: <FlappyJfoxGame /> },
      { path: GAMES_LOTTERY_SPINNER, element: <LotterySpinnerGame /> },
      { path: GAMES_MINESWEEPER, element: <MinesweeperGame /> },
      { path: MARKETPLACE, element: <MarketplacePage /> },
      { path: STAKING, element: <StakingComponent /> },
      { path: NFT, element: <NFTPage /> },
      { path: USER_NFT, element: <UserNFTPage /> },
    ],
  },
  {
    path: AUTH,
    element: (
      <PublicRoute>
        <PageTransition>
          <AuthLayout />
        </PageTransition>
      </PublicRoute>
    ),
    children: [
      { index: true, element: <AuthPage /> },
      { path: 'callback', element: <AuthCallback /> },
    ],
  },
  { path: '*', element: <ErrorPage /> },
]);

function App() {
  const { loginOrSyncSocial } = useAuthSocial();
  
  // Thêm CSS cho hiệu ứng chuyển trang
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .page-transition {
        animation: fadeIn 0.5s ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-reverse {
        animation-direction: reverse;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  createAppKit({
    adapters: [wagmiAdapter, solanaWeb3JsAdapter],
    projectId,
    networks,
    metadata,
    themeMode: 'dark',
    features: {
      analytics: true,
      socials: [],
      email: false,
    },
    allWallets: 'SHOW',
    enableWalletConnect: true,
    // themeVariables: {
    //   '--w3m-accent': '#4f46e5', // Indigo-600
    //   '--w3m-accent-color': '#f59e0b', // Amber-500
    //   '--w3m-background-color': '#111827', // Gray-900
    //   '--w3m-container-border-radius': '12px',
    //   '--w3m-text-big-bold-font-weight': '700',
    // },
    debug: true,
    siwx: new DefaultSIWX({
      verifiers: [
        new EIP155Verifier(loginOrSyncSocial),
        new SolanaVerifier(loginOrSyncSocial),
      ],
    }),
  });
  
  return <RouterProvider router={routes} />;
}

export default App;
