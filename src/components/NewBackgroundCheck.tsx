import React from 'react';
import Heading from './Heading';
import TextField from '@mui/material/TextField/TextField';
import Typography from '@mui/material/Typography/Typography';
import Paper from '@mui/material/Paper/Paper';
import Box from '@mui/material/Box/Box';
import { LoadingButton } from '@mui/lab';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import AddModeratorTwoToneIcon from '@mui/icons-material/AddModeratorTwoTone';
import InputAdornment from '@mui/material/InputAdornment';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useImmer, useImmerReducer } from 'use-immer';
import usePostBackgroundCheck from '../hooks/usePostBackgroundCheck';
import { useCheckTypes } from '../hooks';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function NewBackgroundCheck() {
	const { isBackgroundCheck } = useAuth();
	const [errorStates, setErrorStates] = useImmer<{
		email: null | string;
		checkType: null | string;
	}>({ email: null, checkType: null });
	const navigate = useNavigate();
	const [state, dispatch] = useImmerReducer(
		backgroundCheckReducer,
		initialState
	);
	const mutatePost = usePostBackgroundCheck();
	const { data: backgroundChecks, isLoading } = useCheckTypes()!;

	const checkTypeMenuItems = React.useMemo(
		() =>
			backgroundChecks?.map(v => (
				<MenuItem
					key={v.uuid}
					value={v.uuid}
					selected={v.uuid === state.checkType}
					disabled={v.uuid === state.checkType}
				>
					{v.name}
				</MenuItem>
			)),
		[backgroundChecks, state.checkType]
	);
	if (!isBackgroundCheck)
		return (
			<Navigate
				to='/home/add-new-request'
				replace
			/>
		);
	if (isLoading) return null;
	const handleDispatch = (value: string, type: ActionSchema['type']) => {
		const dispatchObject = { type, payload: { value } };
		const result = actionTypeSchema.safeParse(dispatchObject);
		if (!result.success) return toast.error(result.error.message);
		const { data } = result;
		if (data.type === 'SELECT_OPTION')
			setErrorStates(draftstate => {
				draftstate.checkType = null;
			});
		if (data.type === 'INPUT_EMAIL')
			setErrorStates(draftstate => {
				draftstate.email = null;
			});
		dispatch(data);
	};

	const handleSubmit = () => {
		const result = backgroundCheckSchema.safeParse(state);
		if (!result.success) {
			if (result?.error?.issues) {
				const errorObject = { ...errorStates };
				for (let issue of result.error.issues)
					errorObject[issue.path as unknown as keyof typeof errorStates] =
						issue.message;
				setErrorStates(errorObject);
			}
			return;
		}
		mutatePost.mutate(
			{
				email: result.data.email,
				scan_type: result.data.checkType,
				checkType: result.data.checkType,
			},
			{
				onSuccess() {
					toast.success('Submitted successfully');
					navigate('../background-check');
				},
			}
		);
	};

	return (
		<Box>
			<Heading heading='New Background Check' />
			<Paper
				className='p-4'
				elevation={4}
			>
				<Typography
					fontSize={20}
					mb={3}
					fontWeight={100}
				>
					Candidate Details
				</Typography>
				<TextField
					autoComplete='off'
					type='email'
					label='Email'
					variant='filled'
					color='secondary'
					helperText={
						!!errorStates.email
							? errorStates.email
							: "Enter the candidate's email address"
					}
					fullWidth
					required
					size='small'
					margin='dense'
					className='mb-4'
					value={state.email}
					onChange={e => handleDispatch(e.target.value, 'INPUT_EMAIL')}
					error={!!errorStates.email}
				/>
				<TextField
					error={!!errorStates.checkType}
					value={state.checkType}
					autoComplete='off'
					type='text'
					label='Background Check Type'
					color='secondary'
					helperText={
						backgroundChecks?.find(v => v.uuid === state.checkType)
							?.description ?? 'Select the type of background check'
					}
					fullWidth
					required
					select
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<AddModeratorTwoToneIcon color='secondary' />
							</InputAdornment>
						),
					}}
					SelectProps={{
						MenuProps: {
							sx: { maxHeight: '220px' },
						},
					}}
					margin='dense'
					className='mb-4'
					onChange={e => handleDispatch(e.target.value, 'SELECT_OPTION')}
					FormHelperTextProps={{
						className: 'text-justify',
					}}
				>
					{checkTypeMenuItems}
				</TextField>
				<LoadingButton
					variant='contained'
					color='secondary'
					className='mx-auto block'
					size='large'
					onClick={handleSubmit}
					loading={mutatePost.isPending}
				>
					Send Request
				</LoadingButton>
			</Paper>
		</Box>
	);
}

export default React.memo(NewBackgroundCheck);

const backgroundCheckSchema = z.object({
	checkType: z.string().min(1),
	email: z.string().email(),
});

const actionTypeSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('SELECT_OPTION'),
		payload: z.object({ value: z.string() }),
	}),
	z.object({
		type: z.literal('INPUT_EMAIL'),
		payload: z.object({ value: z.string() }),
	}),
]);

type BackgroundCheckSchemaType = z.infer<typeof backgroundCheckSchema>;
type ActionSchema = z.infer<typeof actionTypeSchema>;
const initialState: BackgroundCheckSchemaType = {
	checkType: '',
	email: '',
};

function backgroundCheckReducer(state = initialState, action: ActionSchema) {
	const result = actionTypeSchema.safeParse(action);
	if (!result.success) toast.error(result.error.message);
	else {
		const { data } = result;
		const { type, payload } = data;
		if (type === 'SELECT_OPTION') state.checkType = payload.value;
		else state.email = payload.value;
	}
}
