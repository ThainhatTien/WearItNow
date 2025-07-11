// src/types/ApiResponse.ts
export interface ApiResponse<T> {
    result: T;
    message?: string;
    error?: string;
  }
  