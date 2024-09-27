import Box from '@mui/material/Box/Box';
import Button from '@mui/material/Button/Button';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import GenericModal from 'components/GenericModal';
import { BgModalProps } from './CanadianModal';
import { useChecksStore } from '../NewRequestV2';
import { useAllCheckTypes } from 'hooks/useGetCheckTypes';
import { useImmer } from 'use-immer';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { Tooltip } from '@mui/material';

export const criminalUSAVariants = [
	'7 Year US Base Criminal Check',
	'7 Year US Single County Criminal Check',
	'US Unlimited County Criminal Check',
] as const;

export function USModal({ open, handleClose, uuid }: BgModalProps) {
	const [check, setCheck] = useImmer<string>('');
	const { data: allCheckTypes } = useAllCheckTypes();
	const store = useChecksStore();
	const criminalChecks = allCheckTypes?.filter((v: any) =>
		criminalUSAVariants.some(val => val.includes(v.name))
	);
	console.log(criminalChecks, 'crim');
	return (
		<GenericModal
			open={open}
			handleClose={() => {
				handleClose(draft => {
					draft.delete(uuid);
				});
			}}
			className='max-h-[75%] w-full overflow-y-auto rounded-lg p-0 md:w-1/3'
		>
			<Typography
				variant='h3'
				className='bg-gray-300 p-4 text-center font-bold'
			>
				US Criminal Checks
			</Typography>
			<Stack
				rowGap={4}
				className='bg-gray-100 p-3'
			>
				{criminalChecks?.map((v: any) => (
					<Box
						role='button'
						key={v.uuid}
						className={clsx(
							'relative cursor-pointer rounded-lg border-none bg-white p-4 text-left font-bold underline',
							check === v.uuid && 'outline outline-credibledOrange'
						)}
						onClick={() => {
							setCheck(v.uuid);
						}}
					>
						<Tooltip
							title={v.description}
							className='absolute right-2 top-12'
						>
							<i className='material-icons icon_info text-secondary'>info</i>
						</Tooltip>
						{'7 Year ' + v.name}
					</Box>
				))}
				<Button
					variant='contained'
					color='secondary'
					className='m-auto w-1/2 rounded'
					onClick={() => {
						if (!check) {
							return toast.error('Please select an option');
						}
						const checks = store.selectedChecks.filter(
							v => !criminalChecks?.some((val: any) => val.uuid === v)
						);
						store.setStore({ selectedChecks: [...checks, check] });
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
