import React, { useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { Logout, RefreshToken } from '../apis';
import { parseBackgroundCheck } from '../pages/auth/SignIn';

type CookieType = string | null;

type AuthType = {
	refreshToken: CookieType;
	accessToken: CookieType;
	loading: boolean;
	type: CookieType;
	isBackgroundCheck: boolean;
	setAccessToken: React.Dispatch<React.SetStateAction<CookieType>>;
	setRefreshToken: React.Dispatch<React.SetStateAction<CookieType>>;
	setType: React.Dispatch<React.SetStateAction<CookieType>>;
	setIsBackgroundCheck: React.Dispatch<React.SetStateAction<boolean>>;
};

function isValid(arg: string | null | undefined): arg is string {
	return typeof arg === 'string';
}

export const AuthContext = React.createContext<null | AuthType>(null);

type UseSelector = <T extends AuthType, K extends keyof AuthType>(
	context: T
) => T[K];

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error(
			'useAuth can only be used within the AuthProvider component!'
		);
	}
	return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [refreshToken, setRefreshToken] = useState<CookieType>(null);
	const [accessToken, setAccessToken] = useState<CookieType>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [type, setType] = useState<CookieType>(null);
	const [isBackgroundCheck, setIsBackgroundCheck] = useState<boolean>(() => {
		const isBackgroundCheck = Cookies.get('isBackgroundCheck') as
			| 'true'
			| 'false';
		if (isBackgroundCheck == null) return false;
		return parseBackgroundCheck(isBackgroundCheck);
	});

	useEffect(() => {
		resolveAuth();
		const rt = setInterval(
			async () => {
				RefreshToken();
			},
			1 * 24 * 60 * 60 * 1000
		);
		return () => {
			clearInterval(rt);
		};
	}, []);

	const resolveAuth = async () => {
		const value = Cookies.get('refresh');
		if (isValid(value)) {
			setRefreshToken(value);
			const type = Cookies.get('type');
			if (isValid(type)) setType(type as any);
			const refresh = await RefreshToken();
			if (refresh !== undefined && refresh.status === 200) {
				const access = refresh.data.access;
				setAccessToken(access);
				Cookies.set('access', access);
			} else {
				Logout();
			}
			setLoading(false);
		} else {
			setLoading(false);
		}
	};

	const value = React.useMemo(
		() => ({
			refreshToken,
			accessToken,
			loading,
			type,
			setAccessToken,
			setRefreshToken,
			setType,
			isBackgroundCheck,
			setIsBackgroundCheck,
		}),
		[accessToken, isBackgroundCheck, loading, refreshToken, type]
	);

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
