import Layouts from '../../components/layouts';
import { Navigate, Outlet } from 'react-router-dom';
import { AdminProvider } from '../../contexts';
import { useAuth } from '../../contexts/AuthContext';

const ClientAdmin = () => {
	const { refreshToken, type } = useAuth();

	if (refreshToken === null || type === null) {
		return <Navigate to='/admin/login' />;
	}

	if (type === 'user') return <Navigate to='/home/requests' />;

	return (
		<AdminProvider>
			<Layouts>
				<Outlet />
			</Layouts>
		</AdminProvider>
	);
};
export default ClientAdmin;
