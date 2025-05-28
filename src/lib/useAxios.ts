import { useState, useCallback } from 'react';
import axiosInstance from './axios';

interface AxiosOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  params?: any;
  headers?: any;
}

export function useAxios<T = any>() {
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
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, sendRequest };
} 