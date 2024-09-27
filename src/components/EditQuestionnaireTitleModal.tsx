import Stack from '@mui/material/Stack/Stack';
import GenericModal from './GenericModal';
import Typography from '@mui/material/Typography/Typography';
import TextField from '@mui/material/TextField/TextField';
import { useQuestionnaires } from 'Common';
import { FormEventHandler, useMemo } from 'react';
import { questionnaireTitleSchema } from './Questionnaires';
import { toast } from 'react-toastify';
import { updateClientAdminQuestionnaire } from 'apis/admin.api';
import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box/Box';
import { useMutation } from '@tanstack/react-query';

const useEditQuestionnaireTitleMutation = (uuid: string) => {
	return useMutation({
		mutationKey: [uuid],
		mutationFn: updateClientAdminQuestionnaire,
	});
};

export function EditQuestionnaireTitleModal({
	uuid,
	handleClose,
}: {
	uuid: string;
	handleClose: () => void;
}) {
	const mutation = useEditQuestionnaireTitleMutation(uuid);
	const { data, refetch } = useQuestionnaires();
	const title = useMemo(() => {
		return data?.find(v => v.uuid === uuid)?.questionnaire_title;
	}, [data, uuid]);

	const handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const newTitle = data.get('title');
		try {
			const title = questionnaireTitleSchema.parse(newTitle);
			await mutation.mutateAsync({
				uuid,
				is_active: true,
				questionnaire_title: title,
			});
			await refetch();
			toast.success('Questionnaire title updated successfully!');
			handleClose();
		} catch (e) {
			toast.error('Error updating title!');
		}
	};

	return (
		<GenericModal
			open={!!uuid}
			handleClose={handleClose}
			className='w-1/2 text-center'
		>
			<Stack
				component='form'
				onSubmit={handleSubmit}
				direction='column'
				spacing={2}
			>
				<Typography variant='h4'>Edit Questionnaire Title</Typography>
				<TextField
					type='text'
					label='Questionnaire Title'
					name='title'
					defaultValue={title}
					required
				/>
				<Box>
					<LoadingButton
						variant='contained'
						type='submit'
						loading={mutation.status === 'pending'}
					>
						Submit
					</LoadingButton>
				</Box>
			</Stack>
		</GenericModal>
	);
}
