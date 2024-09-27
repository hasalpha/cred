import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { Box, Link, Paper, TextField } from '@mui/material';
import React from 'react';
import {
	SavedEmailTemplate,
	useDeleteEmailTemplate,
	useGetEmails,
	useSaveEmailTemplate,
} from '../../Common';
import { useImmer } from 'use-immer';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

export default function EmailInput({
	uuid,
	template,
}: {
	uuid: string;
	template?: SavedEmailTemplate;
}) {
	const mutation = useSaveEmailTemplate();
	const deleteMutation = useDeleteEmailTemplate();
	const { refetch } = useGetEmails();
	const { uuid: clientUUID } = useParams() as { uuid: string };
	const [errors, setErrors] = useImmer<
		Record<'body' | 'subject', string | null>
	>({
		body: null,
		subject: null,
	});

	const handleDelete = () => {
		if (template?.uuid) {
			deleteMutation.mutate(template.uuid, {
				onSuccess: () => {
					refetch();
					return toast.success('Deleted email template!');
				},
				onError: (e: any) => {
					return toast.error(e?.message);
				},
			});
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		if (errors.body || errors.subject || mutation.isPending) return;
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries()) as Record<
			'body' | 'subject',
			string
		>;
		let error = false;
		if (!data.subject) {
			error = true;
			setErrors(draft => {
				draft.subject = 'Please enter subject!';
			});
		}
		if (!data.body) {
			error = true;
			setErrors(draft => {
				draft.body = 'Please enter body!';
			});
		}
		if (error) return;
		if (!!template) {
			return mutation.mutate(
				{ ...data, templateUUID: template.uuid, isEdit: true },
				{
					onSuccess: () => {
						refetch();
						return toast.success('Edited email template!');
					},
					onError: (e: any) => {
						return toast.error(e?.message);
					},
				}
			);
		}
		mutation.mutate(
			{ ...data, emailSendFunction: uuid, clientObject: clientUUID },
			{
				onSuccess: () => {
					refetch();
					return toast.success('Saved email template!');
				},
				onError: (e: any) => {
					return toast.error(e?.message);
				},
			}
		);
	};

	return (
		<Paper
			variant='outlined'
			className='px-4 py-2'
			square
			component='form'
			onSubmit={handleSubmit}
		>
			<TextField
				name='subject'
				variant='standard'
				type='text'
				required
				label='Subject'
				fullWidth
				error={!!errors.subject}
				helperText={errors.subject}
				defaultValue={template?.subject ?? ''}
			/>
			<br />
			<br />
			<TextField
				required
				multiline
				name='body'
				variant='outlined'
				type='text'
				label='Body'
				rows={10}
				fullWidth
				defaultValue={template?.body ?? ''}
			/>
			<br />
			<br />
			<Box className='text-center'>
				<LoadingButton
					className='text-center'
					size='large'
					variant='contained'
					color='secondary'
					type='submit'
				>
					Save
				</LoadingButton>
			</Box>
			{template?.uuid && (
				<Link
					href='#delete'
					onClick={handleDelete}
				>
					Delete
				</Link>
			)}
		</Paper>
	);
}
