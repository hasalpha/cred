import { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useDrawerStore } from './SidebarDrawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box/Box';

export function AdminLinks() {
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
			{adminLinks.map(v => (
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

const adminLinks = [
	{
		icon: 'post_add',
		linkText: 'New user',
		includes: 'new-user',
		to: '/admin/add-new-user',
	},
	{
		icon: 'supervisor_account',
		linkText: 'Users',
		includes: 'users',
		to: '/admin/users',
	},
	{
		icon: 'manage_accounts',
		linkText: 'Admins',
		includes: 'admins',
		to: '/admin/admins',
	},
	{
		icon: 'view_list',
		linkText: 'Questionnaire Builder',
		includes: 'template-homepage',
		to: '/admin/template-homepage',
	},
	{
		icon: 'assignment',
		linkText: 'Questionnaires',
		includes: 'questionnaires',
		to: '/admin/questionnaires',
	},
	{
		icon: 'receipt',
		linkText: 'Billing',
		includes: 'billing',
		to: '/admin/billing',
	},
	{
		icon: 'settings',
		linkText: 'Settings',
		includes: 'settings',
		to: '/admin/settings',
	},
];
