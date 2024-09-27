import { Box, Button, Typography } from '@mui/material';
import Paper from '@mui/material/Paper/Paper';
import { useGetPaymentCard } from './hooks';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { ReactNode } from 'react';

export default function SavedCardSection({
	setIsEdit,
}: {
	setIsEdit: (edit: boolean) => void;
}) {
	const { data } = useGetPaymentCard();
	let imageSrc: string | ReactNode = <CreditCardIcon className='text-6xl' />;
	if (data?.card_type === 'mastercard') {
		imageSrc = 'mastercard.png';
	} else if (data?.card_type === 'amex') {
		imageSrc = 'amex.png';
	} else if (data?.card_type === 'visa') {
		imageSrc = 'visa.png';
	}
	return (
		<Paper
			variant='outlined'
			className='my-4 flex items-center justify-start gap-x-2 rounded-xl px-4 py-2'
		>
			{typeof imageSrc === 'string' ? (
				<img
					src={`/${imageSrc}`}
					alt='card'
					width={75}
					className='hidden flex-none sm:inline'
				/>
			) : (
				imageSrc
			)}
			<Box className='ml-2 flex-1'>
				<Typography className='mb-2 font-bold'>
					**** **** **** {data?.last_4_digit}
				</Typography>
				<Typography className='font-normal'>
					Expires {data?.expiry_month}/{data?.expiry_year}
				</Typography>
			</Box>
			<Box>
				<Button
					color='info'
					onClick={() => {
						setIsEdit(true);
					}}
				>
					Edit
				</Button>
			</Box>
		</Paper>
	);
}
