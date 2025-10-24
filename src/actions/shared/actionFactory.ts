import { apiClient } from '@/lib/apiClient';
import { store } from '@/store/store';
import { setLoader } from '@/store/slices/uiSlice';
import { ActionConfig, ActionExecutor, ActionResult } from './types';

/**
 * Factory function to create actions with .execute() pattern
 * Handles loading states, Redux dispatch, and error handling automatically
 */
export function createAction<TRequest = unknown, TResponse = unknown>(
  config: ActionConfig<TRequest, TResponse>
): ActionExecutor<TRequest, TResponse> {
  return {
    async execute(data?: TRequest): Promise<ActionResult<TResponse>> {
      const dispatch = store.dispatch;
      
      try {
        // Set loading state
        dispatch(setLoader({ key: config.loaderKey, loading: true }));

        // Make API request
        const url = typeof config.url === 'function' ? config.url(data as TRequest) : config.url;
        const response = await apiClient.request<TResponse>({
          method: config.method,
          url: url,
          data: data,
        });

        // Handle success
        if (config.onSuccess) {
          config.onSuccess(response, dispatch);
        }

        // Clear loading state
        dispatch(setLoader({ key: config.loaderKey, loading: false }));

        return {
          success: true,
          data: response,
          message: (response as Record<string, unknown>)?.message as string || 'Success',
        };
      } catch (error: unknown) {
        // Clear loading state
        dispatch(setLoader({ key: config.loaderKey, loading: false }));

        // Handle error
        if (config.onError && error instanceof Error) {
          config.onError(error, dispatch);
        }

        const errorMessage = error instanceof Error ? error.message : 'Request failed';
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
  };
}
