import { useCallback } from 'react';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import { NavLink } from 'react-router-dom';
import { useDrawerStore } from './SidebarDrawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CircularProgress } from '@mui/material';

export function UserLinks() {
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
		<>
			<NavLink
				to='/home/add-new-request'
				className={() =>
					`nav-link my-3 flex items-center gap-x-2 rounded-xl bg-credibledOrange py-2 capitalize text-white`
				}
				onClick={handleClick}
			>
				<i className='material-icons text-white'>post_add</i>
				New Request
			</NavLink>
			{userLinks.map(v => (
				<NavLink
					key={v.linkText}
					to={v.to}
					className={({ isActive }) =>
						`nav-link flex items-center gap-x-2 rounded-xl py-2 capitalize text-black hover:bg-[#ed642b29] ${isActive && 'active1 bg-[#ed642b29]'}`
					}
					onClick={handleClick}
				>
					{({ isPending }) => (
						<>
							<i className='material-icons text-gray-400'>{v.icon}</i>
							{v.linkText}
							{isPending && (
								<CircularProgress
									size={15}
									color='primary'
								/>
							)}
						</>
					)}
				</NavLink>
			))}
		</>
	);
}

const userLinks = [
	{
		icon: 'dvr',
		linkText: 'Reference Check',
		includes: 'requests',
		to: '/home/requests',
	},
	{
		icon: <WorkHistoryIcon />,
		linkText: 'background check',
		includes: 'requests',
		to: '/home/background-check',
	},
	{
		icon: 'assignment',
		linkText: 'Questionnaires',
		includes: null,
		to: '/home/questionnaires',
	},
	{
		icon: 'view_list',
		linkText: 'Questionnaire Builder',
		includes: null,
		to: '/home/template-homepage',
	},
	{
		icon: 'settings',
		linkText: 'settings',
		includes: 'settings',
		to: '/home/settings',
	},
];
