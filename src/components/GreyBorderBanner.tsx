import Paper from '@mui/material/Paper/Paper';
import { ReactNode } from 'react';

export function GreyBorderBanner({ children }: { children: ReactNode }) {
	return (
		<Paper
			variant='outlined'
			className='mb-4 px-4 pb-4 pt-4 sm:text-left md:text-justify'
		>
			{children}
		</Paper>
	);
}
