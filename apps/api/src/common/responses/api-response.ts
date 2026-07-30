export interface ApiResponse<T> {
  success: true;
  data: T;
  metadata?: Record<string, unknown>;
}

export function isApiResponse(
  value: unknown,
): value is ApiResponse<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    'data' in value
  );
}