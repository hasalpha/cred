import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useDrawerStore } from 'components/SidebarDrawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { lazily } from 'react-lazily';
import { Suspense } from 'react';
import Loading from 'components/Loading';
const { UserLayout } = lazily(() => import('./UserLayout'));

export const Main = styled('main', {
	shouldForwardProp: prop => prop !== 'open' && prop !== 'isDesktop',
})<{
	open?: boolean;
	isDesktop?: boolean;
}>(({ theme, open, isDesktop }) => ({
	transition: theme.transitions.create('margin', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	marginLeft: isDesktop ? `-${240}px` : 0,
	...(open && {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.shortest,
		}),
		marginLeft: 0,
	}),
	padding: theme.spacing(2),
}));

const Layouts = ({ children }: any) => {
	const currLink = useLocation().pathname;
	const store = useDrawerStore();
	const isDesktop = useMediaQuery('(min-width:1280px)');
	if (
		currLink === '/home/template-builder' ||
		currLink.includes('/home/template-builder')
	) {
		//Don't show navbar and sidebar during template builder
		return children;
	}

	return (
		<Suspense fallback={<Loading />}>
			<UserLayout>
				<Main
					open={store.open}
					className='w-full'
					isDesktop={isDesktop}
				>
					{children}
				</Main>
			</UserLayout>
		</Suspense>
	);
};

export default Layouts;
