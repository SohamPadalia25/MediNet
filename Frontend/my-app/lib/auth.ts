export type UserRole = "doctor" | "patient" | "admin";

export type AuthUser = {
	_id: string;
	username: string;
	email: string;
	fullname: string;
	role: UserRole;
};

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "authUser";

const isBrowser = typeof window !== "undefined";

export function saveAuth(params: {
	accessToken: string;
	refreshToken: string;
	user: AuthUser;
}) {
	if (!isBrowser) return;
	localStorage.setItem(ACCESS_TOKEN_KEY, params.accessToken);
	localStorage.setItem(REFRESH_TOKEN_KEY, params.refreshToken);
	localStorage.setItem(USER_KEY, JSON.stringify(params.user));
}

export function updateTokens(accessToken: string, refreshToken: string) {
	if (!isBrowser) return;
	localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
	localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearAuth() {
	if (!isBrowser) return;
	localStorage.removeItem(ACCESS_TOKEN_KEY);
	localStorage.removeItem(REFRESH_TOKEN_KEY);
	localStorage.removeItem(USER_KEY);
}

export function getAccessToken(): string | null {
	if (!isBrowser) return null;
	return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
	if (!isBrowser) return null;
	return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getUser(): AuthUser | null {
	if (!isBrowser) return null;
	const raw = localStorage.getItem(USER_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as AuthUser;
	} catch {
		return null;
	}
}


