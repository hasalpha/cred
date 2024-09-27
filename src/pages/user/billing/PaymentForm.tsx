import Button from '@mui/material/Button/Button';
import Paper from '@mui/material/Paper/Paper';
import Stack from '@mui/material/Stack/Stack';
import TextField from '@mui/material/TextField/TextField';
import Typography from '@mui/material/Typography/Typography';

export default function PaymentForm() {
	return (
		<>
			<Typography
				variant='h3'
				color='primary'
			>
				Complete Your Payment
			</Typography>
			<Paper
				variant='outlined'
				className='my-4 p-8 text-center'
			>
				<TextField
					variant='outlined'
					label='Card number'
					helperText='Please separate each email address with a comma, with a limit of up to 5 email addresses'
					fullWidth
					size='small'
				/>
				<br />
				<br />
				<TextField
					variant='outlined'
					label='Name of the card'
					fullWidth
					size='small'
				/>
				<br />
				<br />
				<Stack
					display='grid'
					gridTemplateColumns='1fr 1fr'
					gap={8}
				>
					<TextField
						variant='outlined'
						label='Expiry Date'
						size='small'
						placeholder='MM/YY'
					/>
					<TextField
						variant='outlined'
						label='Security Code'
						size='small'
						placeholder='CVV/CVC'
					/>
				</Stack>
				<br />
				<Typography
					variant='subtitle2'
					className='text-left'
				>
					By completing this payment we will save your credit card information
					as the default payment method for furute invoices. You can change your
					preferred payment method at any time by visiting the "Payment method"
					tab.
				</Typography>
				<br />
				<Button
					variant='contained'
					color='secondary'
				>
					Save
				</Button>
			</Paper>
		</>
	);
}
