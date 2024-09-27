import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { GreyBorderBanner } from 'components/GreyBorderBanner';
import { useConsumerPoliceStore } from './hooks/UseCBCIndexStore';
import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography/Typography';
import FormControl from '@mui/material/FormControl/FormControl';
import FormGroup from '@mui/material/FormGroup/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import { useGetSessionQuery, useStartSessionMutation } from 'apis/user.api';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';

export default function ConsumerPoliceCheck() {
	const query = useGetSessionQuery();
	const store = useConsumerPoliceStore();
	const mutation = useStartSessionMutation();
	const navigate = useNavigate();

	if (query.isLoading && query.fetchStatus === 'fetching') return;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = Object.fromEntries(new FormData(e.currentTarget));
		const newStore = await indexSchema.parseAsync(formData);
		return mutation.mutate(newStore, {
			onSuccess({ data }) {
				store.setStore({ uuid: data.uuid });
				setTimeout(() => query.refetch(), 500);
				return navigate('notice');
			},
			onError(error: any) {
				toast.error(
					error?.message ?? 'An error occurred while submitting your response!'
				);
			},
		});
	};

	return (
		<Box
			component='form'
			onSubmit={handleSubmit}
		>
			<GreyBorderBanner>
				<Typography
					variant='h2'
					className='mb-3'
				>
					Ready to start your background check?
				</Typography>
				<Typography className='mb-3'>
					You will be guided through several steps to complete your background
					check. Don’t worry! Your progress will be saved as you go. You can
					securely leave and come back until you submit your application.
				</Typography>
				<Typography className='mb-3'>
					Once you have submitted your details we will begin to process your
					background screening report. We will process your personal information
					in accordance to our Terms of Use and Privacy Policy.
				</Typography>
				<Typography className='mt-4'>
					{' '}
					Before you begin, please confirm that:
				</Typography>
				<FormControl
					required
					component='fieldset'
					sx={{ m: 3, mb: 0 }}
					variant='standard'
				>
					<FormGroup>
						{Array.from(checkboxMap, ([key, description]) => (
							<FormControlLabel
								sx={{
									'.MuiFormControlLabel-asterisk': {
										display: 'none',
									},
								}}
								key={key}
								required
								control={
									<Checkbox
										name={key}
										defaultChecked={query.data?.[key]}
									/>
								}
								slotProps={{
									typography: {
										sx: { fontWeight: '800' },
									},
								}}
								label={description}
							/>
						))}
					</FormGroup>
				</FormControl>
			</GreyBorderBanner>
			<LoadingButton
				type='submit'
				color='secondary'
				variant='contained'
				size='large'
				loading={mutation.isPending}
			>
				Next
			</LoadingButton>
		</Box>
	);
}

const checkboxMap = new Map([
	['is_over_18', 'I am over 18 years of age'],
	[
		'is_policy_accepted',
		'I have read, understand and agree to the Privacy Policy',
	],
] as const);

const indexSchema = z.object({
	is_over_18: z.literal('on').transform(Boolean),
	is_policy_accepted: z.literal('on').transform(Boolean),
	is_newsletter: z.union([z.literal('on'), z.undefined()]).transform(Boolean),
});

export type IndexSchema = z.infer<typeof indexSchema>;
