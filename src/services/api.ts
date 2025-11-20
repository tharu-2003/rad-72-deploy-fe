import axios, {  AxiosError } from "axios";
import { refreshTokens } from "./auth";

const api = axios.create({
  baseURL: "http://rad-72-deploy-be-peach.vercel.app/api/v1"
  // baseURL: "http://localhost:5000/api/v1"
});

const PUBLIC_ENDPOINT = ["/auth/login", "/auth/register"];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  const isPublic = PUBLIC_ENDPOINT.some((url) => config.url?.includes(url));

  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (
      error.response?.status === 401 &&
      !PUBLIC_ENDPOINT.some((url) => originalRequest.url?.includes(url)) &&
      originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const data = await refreshTokens(refreshToken);
        localStorage.setItem("accessToken", data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return axios(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToke");
        window.location.href = "/login";

        console.error(refreshErr);
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
