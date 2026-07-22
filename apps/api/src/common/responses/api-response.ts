export interface ApiResponse<T> {
  success: true;
  data: T;
  metadata?: Record<string, unknown>;
}