import axios, { AxiosError, AxiosInstance } from "axios";
import { Effect } from "effect";

export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - could redirect to login
    }
    return Promise.reject(error);
  },
);

// Effect wrapper for Axios requests
export const fetchWithEffect = <T>(
  request: () => Promise<{ data: T }>,
): Effect.Effect<T, AxiosError> => {
  return Effect.tryPromise({
    try: async () => {
      const response = await request();
      return response.data;
    },
    catch: (error) => error as AxiosError,
  });
};
