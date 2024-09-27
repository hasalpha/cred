import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Layouts from '../../components/layouts';
import Cookies from 'js-cookie';
import { useLocalStorageHook } from '../../Common';
import { useAuth } from '../../contexts/AuthContext';

const User = () => {
	const { type } = useAuth();
	const location = useLocation();
	const [, , clearValue] = useLocalStorageHook('questions', null);
	const token = Cookies.get('refresh');

	useEffect(() => {
		location.pathname !== '/home/template-builder' && clearValue();
	}, [clearValue, location.pathname]);

	if (!token) {
		return (
			<Navigate
				to='/signin'
				replace
				state={{ redirectURL: location.pathname }}
			/>
		);
	}

	if (type === 'admin') {
		return <Navigate to='/admin/users' />;
	}

	return (
		<Layouts>
			<Outlet />
		</Layouts>
	);
};

export default User;
