import axios, { AxiosInstance } from "axios";

import { auth } from "./firebase";
import { cookieKeys, setCookie } from "./cookie";

/**
 * Adds interceptors to the provided Axios instance that handle authentication.
 *
 * - Request interceptor: attaches the current Firebase ID token as an
 *   `Authorization: Bearer <token>` header on every outgoing request. This is
 *   necessary for cross-origin deployments (e.g. Railway) where cookies set via
 *   `document.cookie` on the frontend domain are not sent to the backend domain.
 *
 * - Response interceptor: if the backend returns a 400 with the specific
 *   "@verifyToken invalid access token" message, the token is force-refreshed
 *   via Firebase and the request is retried once with the new token.
 *
 * @see verifyToken {@link server/src/middleware.ts}
 */
export const authInterceptor = (axiosInstance: AxiosInstance) => {
  // Attach the Firebase token to every request
  axiosInstance.interceptors.request.use(async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Handle network errors or request setup errors
      if (!error.response) {
        return Promise.reject(error);
      }

      const { status, data, config } = error.response;

      // Avoid infinite retry loops
      if (config._retry) {
        return Promise.reject(error);
      }

      if (status === 400 && data === "@verifyToken invalid access token") {
        config._retry = true;
        try {
          const currentUser = auth.currentUser;
          if (!currentUser) {
            return Promise.reject(error);
          }

          // Force-refresh the token
          const token = await currentUser.getIdToken(true);

          // Keep the cookie in sync for any same-origin usage
          setCookie({ key: cookieKeys.ACCESS_TOKEN, value: token });

          return axios({
            ...config,
            url: `${config.baseURL}${config.url}`,
            withCredentials: true,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      // For other status codes, or if the token refresh logic was not triggered
      return Promise.reject(error);
    }
  );
};
