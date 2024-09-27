import Drawer from '@mui/material/Drawer';
import { composeStore } from 'utils/composeStore';
import { Sidebar } from './Sidebar';
import { useMediaQuery } from '@mui/material';
import { useEffect, useLayoutEffect } from 'react';

export const useDrawerStore = composeStore({
	name: 'drawer',
	initialState: { open: false },
	storage: null,
});

export function SidebarDrawer() {
	const isDesktop = useMediaQuery('(min-width:1280px)');
	const store = useDrawerStore();
	useLayoutEffect(() => {
		if (isDesktop && !store.open) {
			store.setStore({ open: true });
		}
		//Need to do this as this is a one time event only until we get useEffectEvent in react 19
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		if (store.open && !isDesktop) {
			store.setStore({ open: false });
		}
		//here too
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDesktop]);

	return (
		<>
			{isDesktop ? (
				<Drawer
					open={store.open}
					onClose={() => store.setStore({ open: false })}
					variant='persistent'
					PaperProps={{
						className: 'sticky border-none h-max top-[58px] w-[260px]',
					}}
				>
					<Sidebar />
				</Drawer>
			) : (
				<Drawer
					open={store.open}
					onClose={() => store.setStore({ open: false })}
					variant='temporary'
					PaperProps={{ className: 'top-14 w-[260px]' }}
				>
					<Sidebar />
				</Drawer>
			)}
		</>
	);
}
