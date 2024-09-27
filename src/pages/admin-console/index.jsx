import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext, SuperAdminProvider } from '../../contexts';
import Layouts from '../../components/layouts';
import Cookies from 'js-cookie';

const AdminConsole = () => {
	useContext(AuthContext);
	const location = useLocation();
	const token = Cookies.get('refresh');
	if (!token) {
		return (
			<Navigate
				to='/admin/signin'
				replace
				state={{ redirectURL: location.pathname }}
			/>
		);
	}
	return (
		<SuperAdminProvider>
			<Layouts>
				<Outlet />
			</Layouts>
		</SuperAdminProvider>
	);
};

export default AdminConsole;
