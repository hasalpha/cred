import { useEffect, useState } from 'react';
import { z } from 'zod';
import { NewBackgroundCheck } from '../../components';
import TypeCard from '../../components/TypeCard';
import Stack from '@mui/material/Stack/Stack';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const requestTypeSchema = z.union([
	z.literal('reference-check'),
	z.literal('background-check'),
]);

export type RequestType = z.infer<typeof requestTypeSchema>;

function NewRequest() {
	const { isBackgroundCheck } = useAuth();
	const [requestType, setRequestType] =
		useState<RequestType>('reference-check');
	const location = useLocation();

	useEffect(() => {
		const activeNewRequest = location?.state?.activeBackgroundCheck
			? 'background-check'
			: 'reference-check';
		setRequestType(activeNewRequest);
		window.history.replaceState({}, document.title);
	}, [location?.state?.activeBackgroundCheck]);

	return (
		<>
			{isBackgroundCheck && (
				<Stack
					direction='row'
					justifyContent='space-evenly'
					className='mt-20 lg:mt-0'
				>
					<TypeCard
						active={requestType === 'reference-check'}
						heading='Reference Check'
						handleChange={() => setRequestType('reference-check')}
					/>
					<TypeCard
						active={requestType === 'background-check'}
						heading='Background Check'
						handleChange={() => setRequestType('background-check')}
					/>
				</Stack>
			)}
			{isBackgroundCheck && requestType === 'background-check' && (
				<NewBackgroundCheck />
			)}
		</>
	);
}

export default NewRequest;
