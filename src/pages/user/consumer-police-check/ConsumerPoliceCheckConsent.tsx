import Box from '@mui/material/Box/Box';
import { GreyBorderBanner } from '../../../components/GreyBorderBanner';
import Typography from '@mui/material/Typography/Typography';
import FormControl from '@mui/material/FormControl/FormControl';
import FormGroup from '@mui/material/FormGroup/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useBiometricConsentMutation, useGetSessionQuery } from 'apis/user.api';
import { PoliceCheckStates } from './types';
import { toast } from 'react-toastify';

export default function ConsumerPoliceCheck() {
	const { data: store, status, refetch } = useGetSessionQuery();
	const mutation = useBiometricConsentMutation();
	const navigate = useNavigate();

	if (status === 'pending' || status === 'error') return;

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = Object.fromEntries(new FormData(e.currentTarget));
		const data = await consentSchema.parseAsync(formData);
		if (store?.is_biometric_consent) {
			return navigate('../start/personal-information');
		}
		mutation.mutate(
			{ state: PoliceCheckStates.BIOMETRIC, ...data },
			{
				onSuccess() {
					refetch();
					return navigate('../start/personal-information');
				},
				onError(e: any) {
					return toast.error(
						e?.message ?? 'An error occurred while submitting your response!'
					);
				},
			}
		);
	}

	return (
		<Box
			component='form'
			onSubmit={handleSubmit}
		>
			<GreyBorderBanner>
				<Typography
					variant='h2'
					className='mb-4 mt-3 capitalize'
				>
					biometrics consent
				</Typography>
				<Typography variant='h5'>
					Please help us verify your identity so we can continue with your
					background check
				</Typography>
				<Box className='mx-auto mb-8 mt-4 w-11/12'>
					<Typography className='mb-3 max-h-[150px] overflow-y-auto p-1'>
						We need your consent to use a biometric facial scan to verify your
						identity. The biometric facial scan helps us determine that you are
						a real person and that no one else is pretending to be you.
						<br />
						<br />
						CREDIBLED uses a secure biometric software to verify your identity.
						This software uses a real-time photo of you to create a digital map
						of your face that is instantly compared to the image of your
						identity document. We will not store the biometric digital map
						resulting from your facial scan.
						<br />
						<br />
						If you reside in a location that is different from our storage and
						our processor’s locations, CREDIBLED may transfer your Personal
						Information across jurisdictions, in accordance with our Privacy
						Policy and the applicable privacy laws.
						<br />
						<br />
						You can request more information about the nature and scope of data
						processing, ask for correction, deletion, or a copy of the
						information we hold about you by contacting Credibled’s Privacy
						Officer at privacy@credibled.com.
						<br />
						<br />
						If you choose not to consent, we may not be able to process your
						application or provide verification results for your background
						check.
					</Typography>
					<FormControl
						required
						component='fieldset'
						variant='standard'
					>
						<FormGroup>
							{Array.from(checkboxMap.entries(), ([key, description]) => (
								<FormControlLabel
									key={key}
									sx={{
										'.MuiFormControlLabel-asterisk': {
											display: 'none',
										},
									}}
									control={
										<Checkbox
											name={key}
											required
											defaultChecked={store?.[key]}
										/>
									}
									slotProps={{
										typography: {
											fontWeight: '800',
										},
									}}
									label={description}
								/>
							))}
						</FormGroup>
					</FormControl>
					<Typography
						variant='caption'
						component='p'
						color='primary'
					>
						By clicking “Yes, I agree”, you confirm to have read, understood and
						agree to the processing of your biometric data in line with the
						above disclosure and our Privacy Policy.
					</Typography>
				</Box>
			</GreyBorderBanner>
			<Box className='ml-3'>
				<Button
					type='button'
					variant='outlined'
					color='primary'
					className='mr-2'
					onClick={() => navigate('../notice')}
					size='large'
				>
					Back
				</Button>
				<Button
					type='submit'
					variant='contained'
					color='secondary'
					size='large'
				>
					Next
				</Button>
			</Box>
		</Box>
	);
}

const checkboxMap = new Map([
	['is_biometric_consent', 'Yes, I agree'],
] as const);
const consentSchema = z.object({
	is_biometric_consent: z.literal('on').transform(Boolean),
});

export type ConsentSchema = z.infer<typeof consentSchema>;
