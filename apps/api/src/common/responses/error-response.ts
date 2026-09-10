export interface ErrorResponse {
  success: false;
  code: string;
  message: string;
  timestamp: string;
  path: string;
  details?: unknown;
}
