import React from 'react';
import GenericModal from '../GenericModal';
import TextField from '@mui/material/TextField/TextField';
import Box from '@mui/material/Box/Box';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { toast } from 'react-toastify';
import { SavedEmailTemplate, usePreviewEmail } from '../../Common';
import { useParams } from 'react-router-dom';

export default function PreviewModal({
	handleClose,
	open,
	template,
}: {
	handleClose: () => void;
	open: boolean;
	template: SavedEmailTemplate;
}) {
	const mutation = usePreviewEmail();
	const { uuid } = useParams() as { uuid: string };

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { email } = Object.fromEntries(
			new FormData(e.currentTarget).entries()
		) as { email: string };
		mutation.mutate(
			{ uuid, email, subject: template.subject, body: template.body },
			{
				onSuccess: () => {
					toast.success('Email sent!');
				},
				onError: () => {
					toast.error('Email not sent!');
				},
			}
		);
	};

	return (
		<GenericModal
			handleClose={handleClose}
			open={open}
		>
			<Box
				component='form'
				onSubmit={handleSubmit}
			>
				<h2
					id='modal-title'
					className='text-center font-bold underline decoration-credibledOrange'
				>
					Email Preview
				</h2>
				<p id='modal-description'>
					A copy of this email will be sent to the following email address:
				</p>
				<TextField
					name='email'
					variant='standard'
					type='email'
					required
					label='Email Address'
					fullWidth
				/>
				<Box className='text-right'>
					<LoadingButton
						type='submit'
						variant='contained'
						color='secondary'
						className='ml-1/2 mt-4'
						size='large'
						loading={mutation.isPending}
					>
						Send
					</LoadingButton>
				</Box>
			</Box>
		</GenericModal>
	);
}
