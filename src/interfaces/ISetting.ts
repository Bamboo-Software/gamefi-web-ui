import { SettingKeyEnum } from "@/enums/setting";
import { ApiResponse } from "./IApiResponse";

export interface ISetting {
  id: string;
  key: SettingKeyEnum;
  value: SettingValueType;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SettingValueType = string | number | number[];

export type ISettingResponse = ApiResponse<ISetting[]>;
