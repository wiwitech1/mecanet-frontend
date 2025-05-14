export interface ApiResponse<T> {
  data: T;
  info: {
    totalRecords: number;
    status: string;
    message?: string;
  };
}

export interface ApiListResponse<T> {
  data: T[];
  info: {
    totalRecords: number;
    status: string;
    message?: string;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: string;
  };
} 