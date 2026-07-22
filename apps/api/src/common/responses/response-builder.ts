import { ApiResponse } from './api-response';

export class ResponseBuilder {
  static success<T>(
    data: T,
    metadata?: Record<string, unknown>,
  ): ApiResponse<T> {
    return {
      success: true,
      data,
      metadata,
    };
  }
}