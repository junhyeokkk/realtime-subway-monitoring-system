import { SuccessResponse } from './api-response.interface';

export const successResponse = <T>(
  data: T,
  message = 'Success',
): SuccessResponse<T> => {
  return {
    success: true,
    data,
    message,
  };
};