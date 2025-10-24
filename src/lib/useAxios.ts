import { useState, useCallback } from 'react';
import axiosInstance from './axios';

interface AxiosOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: Record<string, unknown> | FormData;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export function useAxios<T = unknown>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const sendRequest = useCallback(async (options: AxiosOptions) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await axiosInstance({
        method: options.method || 'GET',
        url: options.url,
        data: options.data,
        params: options.params,
        headers: options.headers,
      });
      setData(response.data);
      return response.data;
    } catch (err: unknown) {
      setError(
        (err && typeof err === 'object' && 'response' in err && 
         err.response && typeof err.response === 'object' && 'data' in err.response &&
         err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
         ? (err.response.data as { message: string }).message
         : err instanceof Error ? err.message : 'Request failed')
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, sendRequest };
} 