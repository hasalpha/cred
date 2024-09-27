import { Stack } from '@mui/material';
import logo from '../assets/img/credibled_logo_205x45.png';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function GenericErrorElement({
	children = <h2>Something went wrong!</h2>,
	showRedirect = true,
}: {
	children?: ReactNode;
	showRedirect?: boolean;
}) {
	return (
		<>
			<Link
				className='ml-auto mt-4 block text-center'
				to='/signin'
			>
				<img
					src={logo}
					alt='Credibled Logo'
					style={{ height: '50px' }}
				/>
			</Link>
			<Stack
				className='justified p-24'
				direction='column'
				justifyContent='center'
				alignItems='center'
			>
				{children}
				{showRedirect && (
					<Link
						to='/'
						className='text-credibledOrange underline hover:text-credibledPurple focus:outline focus:outline-2 focus:outline-offset-2'
					>
						Go back to home page
					</Link>
				)}
			</Stack>
		</>
	);
}
