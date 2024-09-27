import { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useDrawerStore } from './SidebarDrawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box/Box';

export function SuperAdminLinks() {
	const store = useDrawerStore();
	const isDesktop = useMediaQuery('(min-width:1280px)');
	const setStore = store.setStore;
	const handleClick = useCallback(() => {
		if (isDesktop) {
			return;
		}
		setStore({ open: false });
	}, [isDesktop, setStore]);

	return (
		<Box
			component='aside'
			className='pt-2'
		>
			{superAdminLinks.map(v => (
				<NavLink
					key={v.linkText}
					to={v.to}
					className={({ isActive }) =>
						`nav-link my-1 flex items-center gap-x-2 rounded-xl py-2 capitalize text-black hover:bg-[#ed642b29] ${isActive && 'active1 bg-[#ed642b29]'}`
					}
					onClick={handleClick}
				>
					<i className='material-icons text-gray-400'>{v.icon}</i>
					{v.linkText}
				</NavLink>
			))}
		</Box>
	);
}

const superAdminLinks = [
	{
		icon: 'people',
		linkText: 'Clients',
		includes: 'clients',
		to: '/super-admin/clients',
	},
	{
		icon: 'manage_accounts',
		linkText: 'Users',
		includes: 'users',
		to: '/super-admin/users',
	},
	{
		icon: 'manage_accounts',
		linkText: 'Admins',
		includes: 'admins',
		to: '/super-admin/admins',
	},
	{
		icon: 'notes',
		linkText: 'Reports',
		includes: 'reports',
		to: '/super-admin/reports',
	},
	{
		icon: 'admin_panel_settings',
		linkText: 'X-Mode',
		includes: 'xmode',
		to: '/super-admin/xmode',
	},
	{
		icon: 'campaign',
		linkText: 'Announcement',
		includes: 'announcement',
		to: '/super-admin/announcement',
	},
];
