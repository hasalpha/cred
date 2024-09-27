import { Button, Stack, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useImmer } from 'use-immer';
import EmailModal from './EmailModal';
import { useGetEmails } from '../../Common';
import { EmailDisplay } from './EmailDisplay';

export default function EmailSettings() {
	const { data: emailTemplates, status } = useGetEmails();
	const [isEmailModalOpen, setIsEmailModalOpen] = useImmer<boolean>(false);
	useEffect(() => {
		setIsEmailModalOpen(false);
	}, [emailTemplates?.length, setIsEmailModalOpen]);

	const handleEmailModalClose = useCallback(() => {
		setIsEmailModalOpen(false);
	}, [setIsEmailModalOpen]);

	if (status === 'pending' || status === 'error') return null;

	return (
		<>
			<EmailModal
				key={String(emailTemplates.length)}
				handleClose={handleEmailModalClose}
				open={isEmailModalOpen}
			/>
			<Stack
				direction='row'
				justifyContent='end'
			>
				<Button
					onClick={() => setIsEmailModalOpen(true)}
					variant='contained'
					className='h-10'
				>
					Add A New Email
				</Button>
			</Stack>
			{emailTemplates.length <= 0 ? (
				<Typography className='my-8'>
					No emails are customized, click on “add a new email” to customize an
					email
				</Typography>
			) : (
				emailTemplates.map(template => (
					<EmailDisplay
						key={template.updated_at}
						template={template}
					/>
				))
			)}
		</>
	);
}
