export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiErrorResponseDetail {
  success: boolean;
  statusCode: number;
  message: string | Array<{ field: string; error: string }>;
  error: string;
}

export interface ApiErrorResponse {
  status: number;
  data: ApiErrorResponseDetail;
}
