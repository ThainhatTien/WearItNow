// src/utils/apiUtils.ts

import { ApiResponse } from '../types/ApiResponse';
import axios, { AxiosError } from 'axios';

/**
 * Handles API errors and returns a standardized ApiResponse object
 * @param error The error object from axios
 * @returns ApiResponse with success: false and error details
 */
export const handleApiError = (error: unknown): ApiResponse<any> => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return {
      success: false,
      data: null,
      message: 'API request failed',
      error: axiosError.response?.data?.message || axiosError.message || 'Unknown error occurred'
    };
  }
  
  return {
    success: false,
    data: null,
    message: 'API request failed',
    error: error instanceof Error ? error.message : 'Unknown error occurred'
  };
}; 