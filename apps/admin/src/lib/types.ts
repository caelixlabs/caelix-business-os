export interface ApiEnvelope<T> {
  success: true;
  data: T;
  metadata?: Record<string, unknown>;
}

export interface ApiErrorEnvelope {
  success: false;
  code: string;
  message: string;
  timestamp: string;
  path: string;
  details?: unknown;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
