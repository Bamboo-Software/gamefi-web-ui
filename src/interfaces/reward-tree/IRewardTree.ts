export interface IRewardTree {
  id: string;
  userId: string;
  treeLevel: number; // 6 levels
  experience: number;
  waterCount: number;
  shakeCount: number;
  lastWateredAt: Date;
  lastShakenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
