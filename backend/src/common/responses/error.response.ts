import { ErrorResponse } from './api-response.interface';

export const errorResponse = (
  errorCode: string,
  message: string,
  statusCode: number,
  path: string,
): ErrorResponse => {
  return {
    success: false,
    errorCode,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    path,
  };
};