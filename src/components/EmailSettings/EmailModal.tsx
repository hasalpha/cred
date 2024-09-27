import GenericModal from '../GenericModal';
import Box from '@mui/material/Box/Box';
import { MenuItem, Stack, TextField } from '@mui/material';
import { useImmer } from 'use-immer';
import EmailInput from './EmailInput';
import { SavedEmailTemplate, useEmailTypes, useGetEmails } from '../../Common';
import { toast } from 'react-toastify';
import { InstructionsButton } from '../InstructionsButton';

export default function EmailModal({
	open,
	handleClose,
	template,
}: {
	handleClose: () => void;
	open: boolean;
	template?: SavedEmailTemplate;
}) {
	return (
		<GenericModal
			handleClose={handleClose}
			open={open}
			className='min-h-[93%] w-4/5'
		>
			{template ? <EditEmail template={template} /> : <NewEmail />}
		</GenericModal>
	);
}

function EditEmail({ template }: { template: SavedEmailTemplate }) {
	const { data: emailTypes } = useEmailTypes();
	return (
		<Box>
			<h3>
				{emailTypes?.find(v => v.uuid === template.emailSendFunction)?.name}
			</h3>
			<EmailInput
				uuid={template.emailSendFunction}
				template={template}
			/>
		</Box>
	);
}

function NewEmail() {
	const { data: emailTemplates } = useGetEmails();
	const {
		data: emailTypes,
		error,
		isLoading,
		isError,
		isPending,
	} = useEmailTypes();
	const [uuid, setUUID] = useImmer<string>('');
	if (isLoading || emailTemplates == null || isPending) return null;
	if (isError) {
		toast.error((error as any).message ?? 'Error!');
		return null;
	}
	const createdEmailTemplateUUIDS = emailTemplates.map(
		v => v.emailSendFunction
	);
	return (
		<>
			<h2
				id='modal-title'
				className='text-center font-bold underline decoration-credibledOrange'
			>
				Custom Email
			</h2>
			<p
				id='modal-description'
				className='mb-4'
			>
				Select an email to customize:
			</p>

			<TextField
				id='outlined-select-currency'
				select
				label='Select'
				defaultValue='EUR'
				helperText='Please select an email type'
				fullWidth
				value={uuid}
				onChange={e => setUUID(e.target.value)}
			>
				{emailTypes
					.filter(v => !createdEmailTemplateUUIDS.includes(v.uuid))
					.map(v => (
						<MenuItem
							key={v.uuid}
							value={v.uuid}
						>
							{v.name}
						</MenuItem>
					))}
			</TextField>
			{uuid && (
				<>
					<Box>
						<Stack
							direction='row'
							justifyContent='space-between'
							alignItems='center'
						>
							<h3>{emailTypes.find(v => v.uuid === uuid)?.name}</h3>
							<InstructionsButton />
						</Stack>
						<EmailInput uuid={uuid} />
					</Box>
				</>
			)}
		</>
	);
}
