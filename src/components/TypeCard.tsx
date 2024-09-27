import React from 'react';
import FactCheckTwoToneIcon from '@mui/icons-material/FactCheckTwoTone';
import Box from '@mui/material/Box/Box';
import Paper from '@mui/material/Paper/Paper';
import Typography from '@mui/material/Typography/Typography';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

function TypeCard({
	heading,
	handleChange,
	active,
}: {
	heading: string;
	handleChange: () => void;
	active: boolean;
}) {
	return (
		<Paper
			className={`scale-200 mb-5 flex flex-col justify-center border-2 border-credibledOrange p-10 text-center hover:scale-150 hover:cursor-pointer ${active && 'bg-slate-200'} mt-auto sm:mt-5`}
			variant={active ? 'outlined' : 'elevation'}
			onClick={handleChange}
			elevation={10}
		>
			<Box>
				{heading === 'Reference Check' ? (
					<FactCheckTwoToneIcon className='text-5xl lg:text-8xl' />
				) : (
					<VerifiedUserIcon className='text-5xl lg:text-8xl' />
				)}
			</Box>
			<Typography
				variant='h4'
				className='text-sm text-slate-900 lg:text-2xl'
			>
				{heading}
			</Typography>
		</Paper>
	);
}

export default React.memo(TypeCard);
