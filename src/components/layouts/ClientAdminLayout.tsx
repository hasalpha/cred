import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/img/credibled_logo_205x45.png';
import Stack from '@mui/material/Stack/Stack';
import Box from '@mui/material/Box/Box';
import { NavMenu } from 'components/NavMenu';

const ClientAdminLayout = ({ children }: { children: JSX.Element }) => {
	const currLink = useLocation().pathname;
	const baseLink = currLink.split('/')[1];
	return (
		<>
			<Stack direction='row'>
				{currLink.includes('template-builder') ? null : (
					<div>
						<div className='absolute right-0'>
							<NavMenu />
						</div>
						<div
							className='sidebar relative'
							data-color='purple'
							data-background-color='white'
						>
							<div className='logo text-center'>
								<Link
									className='navbar-brand'
									to={`/${baseLink}/users`}
								>
									<img
										src={logo}
										alt='Credibled Logo'
									/>
								</Link>
								<h4 className='text-secondary'>Client Admin</h4>
							</div>

							<div className='sidebar-wrapper'>
								<ul className='nav'>
									<li className='nav-item'>
										<Link
											className='nav-link or_bg'
											to={`/${baseLink}/users/add-new-user`}
										>
											<i className='material-icons txt_white'>post_add</i>

											<span className='new_req'>New </span>
											<span className='new_req'>user</span>
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
											<i className='material-icons-outlined'>
												supervisor_account
											</i>
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
											currLink.includes('template-homepage') ? 'active' : null
										}`}
									>
										<Link
											className={`nav-link ${
												currLink.includes('template-homepage')
													? 'active1'
													: null
											}`}
											to={`/${baseLink}/template-homepage`}
										>
											<i className='material-icons-outlined'>view_list</i>
											<p>Questionnaire Builder</p>
										</Link>
									</li>
									<li
										className={`nav-item ${
											currLink.includes('questionnaires') ? 'active' : null
										}`}
									>
										<Link
											className={`nav-link ${
												currLink.includes('questionnaires') ? 'active1' : null
											}`}
											to={`/${baseLink}/questionnaires`}
										>
											<i className='material-icons-outlined'>assignment</i>
											<p>Questionnaires</p>
										</Link>
									</li>
									<li
										className={`nav-item ${
											currLink.includes('billing') ? 'active' : null
										}`}
									>
										<Link
											className={`nav-link ${
												currLink.includes('billing') ? 'active1' : null
											}`}
											to={`/${baseLink}/billing`}
										>
											<i className='material-icons-outlined'>receipt</i>
											<p>billing</p>
										</Link>
									</li>
									<li
										className={`nav-item ${
											currLink.includes('settings') ? 'active' : null
										}`}
									>
										<Link
											className={`nav-link ${
												currLink.includes('settings') ? 'active1' : null
											}`}
											to={`/${baseLink}/settings`}
										>
											<i className='material-icons-outlined'>settings</i>
											<p>Settings</p>
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
				)}
				<Box className='w-full p-4'>{children}</Box>
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
								<p>Admins</p>
							</Link>
						</li>
						<li className='nav-item'>
							<Link
								className={`nav-link ${
									currLink.includes('settings') ? 'mobile-active' : null
								}`}
								to={`/${baseLink}/settings`}
							>
								<i className='material-icons-outlined'>settings</i>
								<p>Settings</p>
							</Link>
						</li>
						<li className='nav-item dropdown'>
							<div
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
										to={`$/{baseLink}/users`}
									>
										Reports
									</Link>
									<Link
										className='dropdown-item'
										to={`/${baseLink}/billing`}
									>
										billing
									</Link>
								</div>
							</div>
						</li>
					</ul>
				</nav>
				{/* <!-- your footer here --> */}
			</footer>
		</>
	);
};

export { ClientAdminLayout };
