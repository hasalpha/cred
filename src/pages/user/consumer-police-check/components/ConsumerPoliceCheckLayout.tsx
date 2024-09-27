import Container from '@mui/material/Container/Container';
import { Outlet } from 'react-router-dom';
import { CredibledTopBorder } from 'components/CredibledTopBorder';
import { LogoTitleComponent } from 'components/LogoTitleComponent';

export default function ConsumerPoliceCheckLayout() {
	return (
		<>
			<CredibledTopBorder />
			<Container
				fixed
				className='mt-14'
			>
				<LogoTitleComponent title='' />
				<Outlet />
				<br />
				<br />
			</Container>
		</>
	);
}
