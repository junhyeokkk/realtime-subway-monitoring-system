export interface SuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface ErrorResponse {
  success: false;
  errorCode: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
}