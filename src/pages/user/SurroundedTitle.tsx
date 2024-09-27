import Typography from '@mui/material/Typography/Typography';
import { ReactNode } from 'react';

export function SurroundedTitle({ children }: { children: ReactNode }) {
	return (
		<Typography
			className='text-xl font-bold'
			color='secondary'
			sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'start',
				'::before, ::after': {
					content: "''",
					flex: '0 0 30px',
					borderBottom: '4px solid',
				},
				':before': {
					marginRight: '10px',
				},
				':after': {
					marginLeft: '10px',
					flexGrow: 1,
				},
			}}
		>
			{children}
		</Typography>
	);
}
