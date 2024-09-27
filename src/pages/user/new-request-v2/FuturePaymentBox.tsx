import { ArrowRight, MailLock } from '@mui/icons-material';
import { Button } from '@mui/material';
import Box from '@mui/material/Box/Box';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import { useCardSession } from './hooks/hooks';

export function FuturePaymentBox() {
	const { data, status } = useCardSession();

	if (status === 'pending') {
		return null;
	}
	if (status === 'error') {
		return <h5>Something went wrong!</h5>;
	}

	const handleClick = () => {
		window.location.href = data.data.session_url;
	};

	return (
		<Stack
			justifyContent='center'
			alignItems='center'
			className='mx-2 my-3 text-center'
			gap={1}
		>
			<Typography
				variant='h5'
				className='text-black underline'
			>
				Before sending your request
			</Typography>
			<Typography>
				Complete these steps to start running background checks
			</Typography>
			<Stack
				component={Button}
				direction='row'
				variant='contained'
				className='max-w-[500px] rounded-xl bg-orange-200 text-black'
				gap={2}
				justifyContent='center'
				alignItems='center'
				onClick={handleClick}
			>
				<MailLock className='text-credibledOrange' />
				<Box>
					<h5 className='text-black'>Setup Payment Method</h5>
					<p className='text-justify'>
						All payments are processed by Stripe. You only get charged once a
						month for completed checks.
					</p>
				</Box>
				<ArrowRight className='text-5xl text-credibledOrange' />
			</Stack>
			<Box className='text-left'>
				<Typography>
					View Stripes{' '}
					<a
						href='https://stripe.com/en-ca/legal/consumer'
						className='text-left underline'
						rel='noopener noreferrer'
						target='_blank'
					>
						terms and privacy policies
					</a>
				</Typography>
			</Box>
		</Stack>
	);
}
