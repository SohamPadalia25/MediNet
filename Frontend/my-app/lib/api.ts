import axios from "axios";
import { getAccessToken, getRefreshToken, updateTokens, clearAuth } from "@/lib/auth";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
	baseURL: apiBaseUrl,
	withCredentials: false,
});

// Attach access token
api.interceptors.request.use((config) => {
	const accessToken = getAccessToken();
	if (accessToken) {
		config.headers = config.headers || {};
		(config.headers as any)["Authorization"] = `Bearer ${accessToken}`;
	}
	return config;
});

// Handle 401 by attempting refresh
let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

api.interceptors.response.use(
	(res) => res,
	async (error) => {
		const originalRequest = error.config;
		if (error?.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					pendingRequests.push((token) => {
						if (token) {
							originalRequest.headers["Authorization"] = `Bearer ${token}`;
							resolve(api(originalRequest));
						} else {
							reject(error);
						}
					});
				});
			}

			isRefreshing = true;
			try {
				const refreshToken = getRefreshToken();
				if (!refreshToken) throw error;
				const resp = await axios.post(`${apiBaseUrl}/api/v1/users/refresh-token`, {
					refreshToken,
				}, { withCredentials: false });
				const newAccess = resp?.data?.data?.accessToken;
				const newRefresh = resp?.data?.data?.refreshToken;
				if (!newAccess || !newRefresh) throw error;
				updateTokens(newAccess, newRefresh);
				pendingRequests.forEach((cb) => cb(newAccess));
				pendingRequests = [];
				originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
				return api(originalRequest);
			} catch (e) {
				pendingRequests.forEach((cb) => cb(null));
				pendingRequests = [];
				clearAuth();
				return Promise.reject(e);
			} finally {
				isRefreshing = false;
			}
		}
		return Promise.reject(error);
	}
);

export default api;


