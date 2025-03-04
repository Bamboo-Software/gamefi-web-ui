import { createBrowserRouter, 
  Navigate, 
  RouterProvider } from 'react-router-dom';
import routesPath from '@/constants/routes';
import ErrorPage from '@/pages/ErrorPage';
import PageLayout from './layouts/PageLayout';
import AirdropPage from './pages/airdrop/AirdropPage';
import AuthPage from './pages/auth/AuthPage';
import AuthLayout from './layouts/AuthLayout';
import MissionsPage from './pages/missions/MissionsPage';
import FriendsPage from './pages/friends/FriendsPage';
import GamesPage from './pages/games/GamesPage';
import ProfilePage from './pages/profile/ProfilePage';
import FlappyJfoxGame from './pages/games/ourgame/flappy-jfox-game';
import { useGetMeQuery } from './services/auth';
import LotterySpinnerGame from './pages/games/ourgame/lottery-spinner-game';
import LoadingPage from './pages/LoadingPage';
const {
  ROOT,
  AUTH,
  MISSIONS,
  FRIENDS,
  GAMES,
  PROFILE,

  GAMES_LOTTERY_SPINNER,
  GAMES_FLAPPY_JFOX 
} = routesPath;

const PrivateRoute = ({ children }: {children: React.ReactNode}) => {
  const token = localStorage.getItem('auth-token');

  const { error, isLoading } = useGetMeQuery({});
  

  if (isLoading) {
    return <LoadingPage/>;
  }
  if (!token || (error && 'status' in error && error.status === 401)) {
    localStorage.removeItem('auth-token');
    return <Navigate to="/auth" replace />;
  }
  return children;
};


const routes = createBrowserRouter([

  {
    path: ROOT,
    element: <PrivateRoute><PageLayout/></PrivateRoute>,
    children: [
      { index: true, element: <AirdropPage /> },
      { path: MISSIONS, element: <MissionsPage /> },
      { path: FRIENDS, element: <FriendsPage /> },
      { path: GAMES, element: <GamesPage /> },
      { path: PROFILE, element: <ProfilePage /> },
      { path: GAMES_FLAPPY_JFOX, element: <FlappyJfoxGame /> },
      { path: GAMES_LOTTERY_SPINNER, element: <LotterySpinnerGame/>},
    ],
  },
  {
    path: AUTH,
    element: <AuthLayout/>,
    children: [
      { index: true, element: <AuthPage /> },
    ],
  },
  { path: '*', element: <ErrorPage /> },
]);


function App() {

  return (
    <RouterProvider router={routes} />
  )
}

export default App;
