import Cookies from 'js-cookie';
import type { UserTypes } from './types/types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function GenericRedirectComponent() {
	const userType = Cookies.get('userType') as UserTypes;
	const { refreshToken } = useAuth();
	if (!refreshToken)
		return (
			<Navigate
				to='/signin'
				replace
			/>
		);
	if (userType === 'SuperAdmin')
		return (
			<Navigate
				to='/super-admin/clients'
				replace
			/>
		);
	return <Navigate to='/home/requests' />;
}
