import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { useDispatch, useSelector, useStore } from 'react-redux'
import { authApi } from '@/services/auth';

import authReducer ,{ namespace as authNamespace } from './auth/authSlice';
import themeReducer, { namespace as themeNamespace } from './theme/themeSlice';
import { referralApi } from '@/services/referral';
import { userApi } from '@/services/user';
import { tasksApi } from '@/services/tasks';
import { lotteryApi } from '@/services/lottery';
import { rewardTreeApi } from '@/services/reward-tree';
import { airdropApi } from '@/services/airdrop';
import {gamesApi} from '@/services/game';
import { uploadApi } from '@/services/upload';

export const listenerMiddleware = createListenerMiddleware({
  onError: () => console.error('An error listener middleware occurred'),
});


const reducer = {
  [authNamespace]: authReducer,
  [themeNamespace]: themeReducer,
  
  [authApi.reducerPath]: authApi.reducer,
  [referralApi.reducerPath]: referralApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [tasksApi.reducerPath]: tasksApi.reducer,
  [lotteryApi.reducerPath]: lotteryApi.reducer,
  [rewardTreeApi.reducerPath]: rewardTreeApi.reducer,
  [airdropApi.reducerPath]: airdropApi.reducer,
  [gamesApi.reducerPath]: gamesApi.reducer,
  [uploadApi.reducerPath]: uploadApi.reducer,
};

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
    .concat(
      authApi.middleware,
      referralApi.middleware,
      userApi.middleware,
      tasksApi.middleware,
      lotteryApi.middleware,
      rewardTreeApi.middleware,
      airdropApi.middleware,
      gamesApi.middleware,
      uploadApi.middleware
    )
    .prepend(listenerMiddleware.middleware)
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppStore = useStore.withTypes<AppStore>()

