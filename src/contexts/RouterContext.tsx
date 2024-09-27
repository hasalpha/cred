import {
	Navigate,
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from 'react-router-dom';
import DetectBrowser from '../pages/user/DetectBrowser';
import { GenericErrorElement } from '../components/GenericErrorElement';
import { getAdminRoutes } from '../pages/user/AdminRoutes';
import { getUserRoutes } from '../pages/user/UserRoutes';

export const credibledRouter = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path='*'
			element={<DetectBrowser />}
			errorElement={<GenericErrorElement />}
		>
			{getUserRoutes()}
			{getAdminRoutes()}
			<Route
				path='*'
				element={<Navigate to='/' />}
			/>
		</Route>
	)
);
