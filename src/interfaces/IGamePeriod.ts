import { IGame } from "@/services/game";
import { ApiResponse } from "./IApiResponse";

export interface IGamesPeriodResponseData extends IGame {
  period: string;
  startDate: Date;
  endDate: Date;
}

export type IGamesPeriodResponse = ApiResponse<IGamesPeriodResponseData[]>;
