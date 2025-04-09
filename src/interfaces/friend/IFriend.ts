import { IRewardTree } from "../reward-tree/IRewardTree";

export interface IFriend {
  id: string;
  referrer: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    name: string;
    username: string;
    avatar: string;
    pointsBalance: number;
  };
  referee: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    name: string;
    username: string;
    avatar: string;
    pointsBalance: number;
  };
  referrerPoints: number;
  referrerRewardTree: IRewardTree;
  refereeRewardTree: IRewardTree;
  createdAt: string;
  updatedAt: string;
}

export interface IMappedFriend {
  id: string;
  name: string;
  avatar: string;
  rewardTree: IRewardTree | null;
  pointsBalance: number;
  bonusPoints: number;
  createdAt: string;
}
