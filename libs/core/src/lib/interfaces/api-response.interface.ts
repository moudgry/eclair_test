import { Observable } from "rxjs";

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  statusCode: number;
  timestamp: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  timestamp: string;
  errors?: ValidationErrorItem[];
  path?: string;
}

export interface ValidationErrorItem {
  field: string;
  message: string;
  value: unknown;
}

// Add generic type for API responses
export type ApiResponseType<T> = Observable<ApiResponse<T>>;
