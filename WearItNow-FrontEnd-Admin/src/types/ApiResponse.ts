// src/types/ApiResponse.ts

/**
 * Generic API response interface
 * @template T The type of data returned by the API
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
} 