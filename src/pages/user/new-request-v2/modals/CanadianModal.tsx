import Button from '@mui/material/Button/Button';
import Stack from '@mui/material/Stack/Stack';
import Switch from '@mui/material/Switch/Switch';
import Typography from '@mui/material/Typography/Typography';
import GenericModal from 'components/GenericModal';
import { Updater, useImmer } from 'use-immer';
import { useAllCheckTypes } from 'hooks/useGetCheckTypes';
import { useChecksStore } from '../NewRequestV2';
import { EnhancedCrimCheckRed } from '../enhanced-crim-check-red';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import FormGroup from '@mui/material/FormGroup/FormGroup';

export type BgModalProps = {
	open: boolean;
	uuid: string;
	handleClose: Updater<Map<string, boolean>>;
};

export function CanadianModal({ open, uuid, handleClose }: BgModalProps) {
	const { selectedChecks, setStore } = useChecksStore();
	const { data } = useAllCheckTypes();
	const [enhance, setEnhance] = useImmer(false);
	return (
		<GenericModal
			className='max-h-[100%] w-full overflow-y-auto rounded-lg p-0 md:max-h-full md:w-1/2'
			open={!!open}
			handleClose={() => {
				handleClose(draft => {
					draft.set(uuid, false);
				});
			}}
		>
			<Typography
				variant='h3'
				className='bg-gray-300 p-4 text-center font-bold'
			>
				Canadian Criminal Check
			</Typography>
			<Stack
				className='p-4'
				rowGap={4}
				alignItems='center'
				justifyContent='center'
			>
				<Typography
					variant='body2'
					className='text-md'
				>
					The <strong>Basic Canadian Criminal Record Check</strong> searches the
					standard federal Canadian criminal records database. Reported results
					are based on the candidate's name and date of birth. The check
					verifies the accuracy of disclosed criminal convictions for
					indictable, hybrid and summary offences for which a pardon has not
					been granted.
					<br />
					Note that not all summary convictions are reported and therefore
					cannot always be confirmed with this check. This check includes an
					identification verification prior to fulfillment of this service.
				</Typography>
				<Stack
					direction='row'
					justifyContent='center'
					alignItems='center'
					columnGap={2}
				>
					<EnhancedCrimCheckRed />
					<Typography
						variant='h3'
						className='font-bold underline'
					>
						Enhanced Verification
					</Typography>
				</Stack>

				<Typography
					variant='body2'
					className='text-md'
				>
					This check is intended for companies that require a criminal record
					check,{' '}
					<strong>including current charges and outstanding warrants</strong>.
					<br />
					<br />
					This <strong>Level 2</strong> check also validates other court cases,
					such as conditional and unconditional releases within the applicable
					disclosure period.
				</Typography>
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								checked={enhance}
								onClick={() => {
									setEnhance(!enhance);
								}}
								defaultChecked
							/>
						}
						label={
							<Typography
								variant='h3'
								className='font-bold'
								color='black'
							>
								Add the enhanced verification
							</Typography>
						}
					/>
				</FormGroup>
				<Button
					variant='contained'
					color='secondary'
					onClick={() => {
						if (!enhance) {
							handleClose(draft => {
								draft.delete(uuid);
							});
							return;
						}
						const check = data?.find(v => v.name.includes('Enhanced'))?.uuid!;
						setStore({ selectedChecks: [...selectedChecks, check] });
						handleClose(draft => {
							draft.delete(uuid);
						});
					}}
				>
					Confirm and Continue
				</Button>
			</Stack>
		</GenericModal>
	);
}
