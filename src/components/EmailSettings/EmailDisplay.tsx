import { Link, Paper, Stack, TextField } from '@mui/material';
import { useCallback } from 'react';
import { SavedEmailTemplate, useEmailTypes } from '../../Common';
import { useImmer } from 'use-immer';
import PreviewModal from './PreviewModal';
import EmailModal from './EmailModal';

export function EmailDisplay({ template }: { template: SavedEmailTemplate }) {
	const { data } = useEmailTypes();
	const [isPreviewOpen, setPreviewOpen] = useImmer<boolean>(false);

	const [isEmailModalOpen, setIsEmailModalOpen] = useImmer<boolean>(false);

	const handleEmailModalClose = useCallback(() => {
		setIsEmailModalOpen(false);
	}, [setIsEmailModalOpen]);

	const handlePreviewModalOpen = useCallback(() => {
		setPreviewOpen(true);
	}, [setPreviewOpen]);

	const handlePreviewModalClose = useCallback(() => {
		setPreviewOpen(false);
	}, [setPreviewOpen]);

	function handleEdit() {
		setIsEmailModalOpen(true);
	}

	return (
		<>
			<PreviewModal
				handleClose={handlePreviewModalClose}
				open={isPreviewOpen}
				template={template}
			/>
			<EmailModal
				key={'' + isEmailModalOpen}
				handleClose={handleEmailModalClose}
				open={isEmailModalOpen}
				template={template}
			/>
			<Paper
				variant='elevation'
				elevation={2}
				className='my-8 bg-slate-50 px-4 py-2'
			>
				<h3>{data?.find(v => v.uuid === template.emailSendFunction)?.name}</h3>
				<br />
				<TextField
					name='subject'
					variant='standard'
					type='text'
					required
					label='Subject'
					fullWidth
					InputProps={{ readOnly: true }}
					defaultValue={template.subject}
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
					InputProps={{ readOnly: true }}
					defaultValue={template.body}
				/>
				<br />
				<br />
				<Stack
					className='mb-8'
					direction='row'
					gap={5}
				>
					<Link
						href='#ejwo'
						onClick={handlePreviewModalOpen}
					>
						Preview
					</Link>
					<Link
						href='#3j2'
						onClick={handleEdit}
					>
						Edit
					</Link>
				</Stack>
			</Paper>
		</>
	);
}
