export interface Season {
  _id: string;
  gameId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  collectionNFTName?: string;
  collectionNFTSymbol?: string;
  requireNFTToPlay: boolean;
  requireNFT: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  startDate?: string;
  endDate?: string;
  deletedAt?: string;
  collectionNFTId?: string;
  game?: Game;
}

export interface CreateSeasonRequest {
  gameId: number;
  name: string;
  description?: string;
  imageUrl?: string;
  collectionNFTName?: string;
  collectionNFTSymbol?: string;
  requireNFT?: boolean;
  startDate?:string;
  endDate?:string;
}
