import { Suspense, useMemo } from 'react';
import { useAuth } from 'contexts/AuthContext';
import Typography from '@mui/material/Typography/Typography';
import Box from '@mui/material/Box/Box';
import { lazily } from 'react-lazily';
import Loading from './Loading';
const { UserLinks } = lazily(() => import('./UserLinks'));
const { AdminLinks } = lazily(() => import('./AdminLinks'));
const { SuperAdminLinks } = lazily(() => import('./SuperAdminLinks'));

export function Sidebar() {
	const { type } = useAuth();
	const companyName = useMemo(() => localStorage.getItem('companyName'), []);

	return (
		<Box className='flex h-[94.1vh] flex-col gap-y-2 border-x-0 border-y-0 border-r-1 border-solid border-slate-300 px-3'>
			{type === 'user' && (
				<Suspense fallback={<Loading />}>
					<UserLinks />
				</Suspense>
			)}
			{type === 'admin' && (
				<Suspense fallback={<Loading />}>
					<AdminLinks />
				</Suspense>
			)}
			{type === 'super-admin' && (
				<Suspense fallback={<Loading />}>
					<SuperAdminLinks />
				</Suspense>
			)}
			{companyName && (
				<Typography
					variant='h6'
					className='mb-20 mt-auto text-center capitalize text-slate-300'
				>
					{companyName}
				</Typography>
			)}
		</Box>
	);
}
