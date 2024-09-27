import { Button } from '@mui/material';
import { Logout } from 'apis';
import { useAuth } from 'contexts/AuthContext';
import Cookies from 'js-cookie';
import { useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function NavMenu() {
	const { type } = useAuth();
	const navigate = useNavigate();
	const currLink = useLocation().pathname;
	const baseLink = currLink.split('/')[1];
	const firstName = useMemo(() => localStorage.getItem('firstName'), []);

	const handleLogout = useCallback(async () => {
		try {
			await Logout();

			const getbannerTracker = JSON.parse(
				localStorage.getItem('bannerTracker') || '{}'
			);
			localStorage.clear();
			// Is localStorage Saved or not...
			Object.keys(getbannerTracker).length > 0 &&
				(() => {
					localStorage.setItem(
						'bannerTracker',
						JSON.stringify(getbannerTracker)
					);
				})();

			if ('caches' in window) {
				caches.keys().then(names => {
					names.forEach(name => {
						caches.delete(name);
					});
				});
			}
			Cookies.remove('isBackgroundCheck');
			Cookies.remove('userType');
			navigate(`${baseLink.includes('admin') ? '/admin/login' : '/signin'}`);
		} catch (e) {
			navigate(`${baseLink.includes('admin') ? '/admin/login' : '/signin'}`);
		}
	}, [navigate, baseLink]);

	if (type === 'super-admin') {
		return (
			<Button
				onClick={handleLogout}
				variant='contained'
				color='secondary'
				size='large'
			>
				Log out
			</Button>
		);
	}

	return (
		<ul className='m-0 flex list-none items-center justify-center p-2'>
			<li className='nav-item dropdown'>
				<a
					className='nav-link dropdown-toggle text-credibledPurple'
					href='#!'
					data-toggle='dropdown'
					aria-haspopup='true'
					aria-expanded='false'
					role='menuitem'
				>
					<i className='material-icons'>account_box</i> Hi,{' '}
					<span className='text-secondary'>{firstName || 'There'}</span>
				</a>
				<div
					className='dropdown-menu'
					aria-labelledby='navbarDropdownMenuLink'
				>
					<Link
						to={`/${baseLink}/settings`}
						className='dropdown-item'
					>
						Profile
					</Link>
					<button
						className='dropdown-item'
						style={{ cursor: 'pointer' }}
						onClick={handleLogout}
					>
						Log out
					</button>
				</div>
			</li>
		</ul>
	);
}
