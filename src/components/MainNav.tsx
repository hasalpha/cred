import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import logo from '../assets/img/credibled_logo_205x45.png';
import IconButton from '@mui/material/IconButton/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { NavMenu } from './NavMenu';
import Box from '@mui/material/Box/Box';
import { useDrawerStore } from './SidebarDrawer';
import { Link } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

export function MainNav() {
	const store = useDrawerStore();
	const { type } = useAuth();
	return (
		<AppBar
			variant='outlined'
			color='inherit'
			className='top-0 z-[1000] border-b-credibledOrange md:z-[1500]'
			elevation={0}
			position='sticky'
		>
			<Toolbar
				variant='dense'
				className='justify-between'
			>
				<Box>
					<IconButton
						size='large'
						edge='start'
						color='secondary'
						aria-label='menu'
						sx={{ mr: 2 }}
						onClick={() => store.setStore({ open: !store.open })}
						className='hidden mobile:inline-block'
					>
						<MenuIcon />
					</IconButton>
					{type === 'user' && (
						<Link to='/home/add-new-request'>
							<img
								src={logo}
								alt='Credibled Logo'
								width={150}
							/>
						</Link>
					)}
					{type !== 'user' && (
						<img
							src={logo}
							alt='Credibled Logo'
							width={150}
						/>
					)}
				</Box>
				<NavMenu />
			</Toolbar>
		</AppBar>
	);
}
