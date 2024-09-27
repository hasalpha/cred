import UserBanner from '../../components/banners/userBannerView';
import { ReactNode, Suspense } from 'react';
import { SidebarDrawer } from 'components/SidebarDrawer';
import Stack from '@mui/material/Stack/Stack';
import { useMediaQuery } from '@mui/material';
import Loading from 'components/Loading';
import { lazily } from 'react-lazily';
import { MainNav } from 'components/MainNav';
const { Footer } = lazily(() => import('../footer'));

const UserLayout = ({ children }: { children: ReactNode }) => {
	const isDesktop = useMediaQuery('(min-width: 900px)');
	return (
		<Stack>
			<UserBanner />
			<MainNav />
			<Stack
				direction='row'
				columnGap={1}
				className='pb-20 md:pb-0'
			>
				<SidebarDrawer />
				{children}
			</Stack>
			{!isDesktop && (
				<Suspense fallback={<Loading />}>
					<Footer />
				</Suspense>
			)}
		</Stack>
	);
};

export { UserLayout };
