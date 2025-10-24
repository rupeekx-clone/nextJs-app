/**
 * Shared types for action system
 */

import { AppDispatch } from '@/store/store';

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ActionConfig<TRequest = unknown, TResponse = unknown> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string | ((data: TRequest) => string);
  loaderKey: string;
  onSuccess?: (data: TResponse, dispatch: AppDispatch) => void;
  onError?: (error: Error, dispatch: AppDispatch) => void;
}

export interface ActionExecutor<TRequest = unknown, TResponse = unknown> {
  execute: (data?: TRequest) => Promise<ActionResult<TResponse>>;
}
