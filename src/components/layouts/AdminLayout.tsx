import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/img/credibled_logo_205x45.png';
import MuiLink from '@mui/material/Link/Link';
import { ReactNode, useEffect } from 'react';
import { useSuperAdminContext } from 'contexts/SuperAdminContext';
import Stack from '@mui/material/Stack/Stack';
import Box from '@mui/material/Box/Box';
import { NavMenu } from 'components/NavMenu';

const AdminLayout = ({ children }: { children: ReactNode }) => {
	const { fetchClients, fetchAllUsers, fetchAllChecks } =
		useSuperAdminContext();
	useEffect(() => {
		fetchAllChecks();
		fetchAllUsers();
		fetchClients();
	}, [fetchAllChecks, fetchAllUsers, fetchClients]);
	const currLink = useLocation().pathname;
	const baseLink = currLink.split('/')[1];
	return (
		<>
			<Stack direction='row'>
				<div
					className='sidebar relative h-full'
					data-color='purple'
					data-background-color='white'
				>
					<div className='logo text-center'>
						<Link
							className='navbar-brand'
							to={`/${baseLink}/clients`}
						>
							<img
								src={logo}
								alt='Credibled Logo'
							/>
						</Link>
						<h4 className='text-secondary'>Super Admin Console</h4>
					</div>

					<div className='sidebar-wrapper'>
						<ul className='nav'>
							<li
								className={`nav-item ${
									currLink.includes('clients') ? 'active' : null
								}`}
							>
								<Link
									className={`nav-link ${
										currLink.includes('clients') ? 'active1' : null
									}`}
									to={`/${baseLink}/clients`}
								>
									<i className='material-icons'>people</i>
									<p>Clients</p>
								</Link>
							</li>
							<li
								className={`nav-item ${
									currLink.includes('users') ? 'active' : null
								}`}
							>
								<Link
									className={`nav-link ${
										currLink.includes('users') ? 'active1' : null
									}`}
									to={`/${baseLink}/users`}
								>
									<i className='material-icons-outlined'>manage_accounts</i>
									<p>Users</p>
								</Link>
							</li>
							<li
								className={`nav-item ${
									currLink.includes('admins') ? 'active' : null
								}`}
							>
								<Link
									className={`nav-link ${
										currLink.includes('admins') ? 'active1' : null
									}`}
									to={`/${baseLink}/admins`}
								>
									<i className='material-icons-outlined'>manage_accounts</i>
									<p>Admins</p>
								</Link>
							</li>
							<li
								className={`nav-item ${
									currLink.includes('reports') ? 'active' : null
								}`}
							>
								<Link
									className={`nav-link ${
										currLink.includes('reports') ? 'active1' : null
									}`}
									to={`/${baseLink}/reports`}
								>
									<i className='material-icons-outlined'>notes</i>
									<p>Reports</p>
								</Link>
							</li>
							<li
								className={`nav-item ${
									currLink.includes('xmode') ? 'active' : null
								}`}
							>
								<Link
									className={`nav-link ${
										currLink.includes('xmode') ? 'active1' : null
									}`}
									to={`/${baseLink}/xmode`}
								>
									<i className='material-icons-outlined'>
										admin_panel_settings
									</i>
									<p>X-Mode</p>
								</Link>
							</li>
							<li
								className={`nav-item ${
									currLink.includes('announcement') ? 'active' : null
								}`}
							>
								<Link
									className={`nav-link ${
										currLink.includes('announcement') ? 'active1' : null
									}`}
									to={`/${baseLink}/announcement`}
								>
									<i className='material-icons-outlined'>campaign</i>
									<p>Announcement</p>
								</Link>
							</li>
							<li
								className={`nav-item ${
									currLink.includes('audit-log') ? 'active' : null
								}`}
							></li>
						</ul>
					</div>
				</div>
				<Box className='w-full p-4'>{children}</Box>
				<div className='hideonmobile absolute right-12 top-4'>
					<NavMenu />
				</div>
			</Stack>
			<footer
				className='footer showonmobile'
				style={{ display: 'none' }}
			>
				<nav className='col-md-12'>
					<ul className='mobile_footer'>
						<li className='nav-item'>
							<Link
								className={`nav-link ${
									currLink.includes('clients') ? 'mobile-active' : null
								}`}
								to={`/${baseLink}/clients`}
							>
								<i className='material-icons-outlined'>people</i>
								<p>Clients</p>
							</Link>
						</li>
						<li className='nav-item'>
							<Link
								className={`nav-link ${
									currLink.includes('users') ? 'mobile-active' : null
								}`}
								to={`/${baseLink}/users`}
							>
								<i className='material-icons-outlined'>supervisor_account</i>
								<p>Users</p>
							</Link>
						</li>
						<li className='nav-item'>
							<Link
								className={`nav-link ${
									currLink.includes('admins') ? 'mobile-active' : null
								}`}
								to={`/${baseLink}/admins`}
							>
								<i className='material-icons-outlined'>manage_accounts</i>
								<p>Admin</p>
							</Link>
						</li>
						<li className='nav-item dropdown'>
							<MuiLink
								underline='none'
								color='#000'
								component='span'
								variant='caption'
								className='nav-link'
								id='footermore'
								data-toggle='dropdown'
								aria-haspopup='true'
								aria-expanded='false'
							>
								<i className='material-icons-outlined'>more_vert</i>
								<p>More</p>
								<div
									className='dropdown-menu'
									aria-labelledby='footermore'
								>
									<Link
										className='dropdown-item'
										to='/admin/reports'
									>
										Reports
									</Link>
									<Link
										className='dropdown-item'
										to='/admin/audit-log'
									>
										Audit Log
									</Link>
									<Link
										className='dropdown-item'
										to='/admin/settings'
									>
										Settings
									</Link>
								</div>
							</MuiLink>
						</li>
					</ul>
				</nav>
			</footer>
		</>
	);
};

export { AdminLayout };
