import { NavMenu } from './NavMenu';
import logo from '../assets/img/credibled_logo_205x45.png';

export function MobileNav() {
	return (
		<nav className='navbar navbar-expand navbar-transparent fixed-top mobile_logo block mobile:hidden'>
			<div className='container-fluid'>
				<div className='navbar-wrapper'>
					<div>
						<a
							className='navbar-brand'
							href='/'
						>
							<img
								src={logo}
								alt='Credibled Logo'
								className='mob_logo'
							/>
						</a>
					</div>
				</div>
				<NavMenu />
			</div>
		</nav>
	);
}
