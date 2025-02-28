import { createBrowserRouter, 
  // Navigate, 
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
const {
  ROOT,
  AUTH,
  MISSIONS,
  FRIENDS,
  GAMES,
  PROFILE,
  // SETTING,
  // SELECT_LANGUAGE,
  // REFERRAL,
  // GAMES_LOTTERY_SPINNER,
  // GAMES_LOTTERY_SPINNER_HISTORY,
  // GAMES_FLAPPY_JFOX 
} = routesPath;

// const PrivateRoute = ({ children }: {children: React.ReactNode}) => {
//   const token = localStorage.getItem('auth-token');
//   if (!token) {
//     return <Navigate to={AUTH} replace />;
//   }
//   return children;
// };


const routes = createBrowserRouter([

  {
    path: ROOT,
    element: <PageLayout/>,
    children: [
      { index: true, element: <AirdropPage /> },
      { path: MISSIONS, element: <MissionsPage /> },
      { path: FRIENDS, element: <FriendsPage /> },
      { path: GAMES, element: <GamesPage /> },
      { path: PROFILE, element: <ProfilePage /> },
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
