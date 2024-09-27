import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography/Typography';
import GenericModal from 'components/GenericModal';
import { BgModalProps } from './CanadianModal';
import NewReferenceCheck, {
	useReferenceStore,
} from 'components/NewReferenceCheck';
import { useChecksStore } from '../NewRequestV2';

export function ReferenceModal({ open, uuid, handleClose }: BgModalProps) {
	const { setStore, selectedChecks } = useChecksStore();
	const refStore = useReferenceStore();
	return (
		<GenericModal
			open={open}
			handleClose={() => {
				handleClose(draft => {
					draft.set(uuid, false);
				});
			}}
			className='max-h-[100%] w-full overflow-y-auto rounded-lg p-0 lg:max-h-full lg:w-3/4'
		>
			<Typography
				variant='h3'
				className='bg-gray-300 p-4 text-center font-bold'
			>
				Reference Checks
			</Typography>
			<Box className='mx-8 my-4'>
				<NewReferenceCheck
					closeModal={() => {
						handleClose(draft => {
							draft.delete('reference');
						});
					}}
					cancel={() => {
						setStore({
							selectedChecks: selectedChecks.filter(v => v !== 'reference'),
						});
						refStore.setStore({
							recruiter: '',
							firstName: '',
							lastName: '',
							phone: '',
							role: '',
							questionnaire: '',
							requestDate: '',
							response: '',
							recruiterName: '',
							recruiterTZ: '',
							min_reference: 2,
							is_sms_allow: false,
						});
					}}
				/>
			</Box>
		</GenericModal>
	);
}
