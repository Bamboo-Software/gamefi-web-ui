import airdrop from '@/assets/icons/airdrop_icon.svg';
import games from '@/assets/icons/games_icon.svg';
import friends from '@/assets/icons/friends_icon.svg';
import missions from '@/assets/icons/missions_icon.svg';
import profile from '@/assets/icons/profile_icon.svg';
import { useTranslation } from 'react-i18next';
import routesPath from '@/constants/routes';


const {
  MISSIONS, GAMES, ROOT, FRIENDS, PROFILE
  } = routesPath;


export const BottomTabNavigator = () => {
  const { t } = useTranslation();

  return [
    {
      name: t('navbar.missions'),
      icon: missions,
      path: MISSIONS,
    },
    {
      name: t('navbar.games'),
      icon: games,
      path: GAMES,
    },
    {
      name: t('navbar.airdrop'),
      icon: airdrop,
      path: ROOT,
    },
    {
      name: t('navbar.friends'),
      icon: friends,
      path: FRIENDS,
    },
    {
      name: t('navbar.profile'),
      icon: profile,
      path: PROFILE,
    },
  ];
};