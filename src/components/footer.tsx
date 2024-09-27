import { useAuth } from 'contexts/AuthContext';
import MuiLink from '@mui/material/Link/Link';
import { Link, useLocation } from 'react-router-dom';

export function Footer() {
	const { type } = useAuth();
	const currLink = useLocation().pathname;
	const baseLink = currLink.split('/')[1];
	const { isBackgroundCheck } = useAuth();
	switch (type) {
		case 'admin': {
			return (
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
								<a
									className='nav-link'
									href='#!'
									id='footermore'
									data-toggle='dropdown'
									aria-haspopup='true'
									aria-expanded='false'
								>
									<i className='material-icons-outlined'>more_vert</i>
									<p>More</p>
								</a>
								<div
									className='dropdown-menu'
									aria-labelledby='navbarDropdownMenuLink'
								>
									<Link
										className='dropdown-item'
										to={`/admin/billing`}
									>
										Billing
									</Link>
									<Link
										className='dropdown-item'
										to={`/${baseLink}/users`}
									>
										Reports
									</Link>
								</div>
							</li>
						</ul>
					</nav>
				</footer>
			);
		}
		case 'user': {
			return (
				<footer className='footer showonmobile z-10'>
					<nav className='mobile:hidden'>
						<ul className='mobile_footer'>
							<li
								className={`nav-item ${
									currLink.includes('add-new-request') ? 'mobile-active' : null
								}`}
							>
								<Link
									className='nav-link'
									to={`/home/add-new-request`}
								>
									<i className='material-icons-outlined'>post_add</i>
									<p>New Request</p>
								</Link>
							</li>
							<li className='nav-item'>
								<Link
									className={`nav-item ${
										currLink.includes('requests') &&
										!currLink.includes('add-new-request')
											? 'mobile-active'
											: null
									}`}
									to='/home/requests'
								>
									<i className='material-icons-outlined'>dvr</i>
									<p>Reference Check</p>
								</Link>
							</li>
							{isBackgroundCheck && (
								<li
									className={`nav-item ${
										currLink.includes('background-check')
											? 'mobile-active'
											: null
									}`}
								>
									<Link
										className='nav-link'
										to='/home/background-check'
									>
										<i className='material-icons-outlined'>shield</i>
										<p>Background Check</p>
									</Link>
								</li>
							)}
							<li className='nav-item dropdown'>
								<a
									className='nav-link'
									href='#!'
									id='footermore'
									data-toggle='dropdown'
									aria-haspopup='true'
									aria-expanded='false'
								>
									<i className='material-icons-outlined'>more_vert</i>
									<p>More</p>
								</a>
								<div
									className='dropdown-menu'
									aria-labelledby='navbarDropdownMenuLink'
								>
									{isBackgroundCheck && (
										<Link
											className='dropdown-item'
											to={`/${baseLink}/questionnaires`}
										>
											Questionnaires
										</Link>
									)}
									<Link
										className='dropdown-item'
										to={`/home/template-homepage`}
									>
										Questionnaire Builder
									</Link>
									<Link
										className='dropdown-item'
										to={`/${baseLink}/settings`}
									>
										Settings
									</Link>
								</div>
							</li>
						</ul>
					</nav>
				</footer>
			);
		}
		case 'super-admin': {
			return (
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
								<a
									className='nav-link'
									href='#!'
									id='footermore'
									data-toggle='dropdown'
									aria-haspopup='true'
									aria-expanded='false'
								>
									<i className='material-icons-outlined'>more_vert</i>
									<p>More</p>
								</a>
								<div
									className='dropdown-menu'
									aria-labelledby='navbarDropdownMenuLink'
								>
									<Link
										className='dropdown-item'
										to='/super-admin/reports'
									>
										Reports
									</Link>
									<Link
										className='dropdown-item'
										to='/super-admin/audit-log'
									>
										Audit Log
									</Link>
									<Link
										className='dropdown-item'
										to='/super-admin/settings'
									>
										Settings
									</Link>
								</div>
							</li>
						</ul>
					</nav>
				</footer>
			);
		}
	}
}
