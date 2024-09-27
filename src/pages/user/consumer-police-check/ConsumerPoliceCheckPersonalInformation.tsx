import Box from '@mui/material/Box/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField/TextField';
import { CustomToolTip } from 'components';
import { GreyBorderBanner } from 'components/GreyBorderBanner';
import PhoneNumberInput from 'components/PhoneNumberInput';
import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import FormControl from '@mui/material/FormControl/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Button from '@mui/material/Button/Button';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import {
	useAddPersonalDetailsMutation,
	useEditPersonalDetailsMutation,
	useGetPersonalDetails,
	useGetSessionQuery,
} from 'apis/user.api';
import { PoliceCheckStates } from './types';
import { toast } from 'react-toastify';
import { useImmer } from 'use-immer';
import { LoadingButton } from '@mui/lab';
import countries from 'assets/json/state.json';
import { isAxiosError } from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker/DatePicker';

export function getYYYYMMDD(yourDate: Date) {
	const offset = yourDate.getTimezoneOffset();
	yourDate = new Date(yourDate.getTime() - offset * 60 * 1000);
	return yourDate.toISOString().split('T')[0];
}

export default function ConsumerPoliceCheckPersonalInformation() {
	const confirmEmailRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();
	const { refetch: refetchSession } = useGetSessionQuery();
	const { data: store, isLoading } = useGetPersonalDetails();

	const mutation = useAddPersonalDetailsMutation();
	const editMutation = useEditPersonalDetailsMutation();
	const [phone, setPhone] = useImmer<string>(store?.phone ?? '');

	useEffect(() => {
		if (store?.phone && !phone) {
			setPhone(store.phone);
		}
	}, [phone, setPhone, store?.phone]);
	useEffect(() => {
		function eventListener(this: HTMLInputElement, _e: Event) {
			if (this.validationMessage) {
				return this.setCustomValidity('');
			}
		}
		const { current: element } = confirmEmailRef;
		element?.addEventListener('input', eventListener);
		return () => {
			element?.removeEventListener('input', eventListener);
		};
	}, []);

	if (isLoading && store == null) {
		return;
	}

	const handlePhoneNumberChange = (value: string) => {
		document.getElementById('phone-field')?.classList.remove('error-field');
		const currentPhoneNumberLength = value
			?.split?.(' ')
			?.slice?.(1)
			?.join('')?.length;
		if (currentPhoneNumberLength && currentPhoneNumberLength > 10) return;
		return setPhone(value);
	};

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formInput = Object.fromEntries(new FormData(e.currentTarget));
		try {
			const data = schema.parse(formInput);
			data.dob = getYYYYMMDD(new Date(data.dob));
			const phoneNumberLength = data.phone
				?.split?.(' ')
				?.slice?.(1)
				?.join('')?.length;

			if (phoneNumberLength < 10) {
				return toast.error('Phone number is less than 10 digits');
			}

			if (data.email !== data.confirmEmail) {
				return confirmEmailRef.current?.setCustomValidity(
					`Confirm email does not match email`
				);
			}

			if (store?.uuid) {
				editMutation.mutate(
					{ uuid: store.uuid, ...data },
					{
						onSuccess() {
							toast.success('Personal info edited successfully!');
							refetchSession();
							navigate('../address');
						},
						onError(error) {
							if (isAxiosError(error)) {
								toast.error(error.response?.data?.Error ?? error.message);
							}
						},
					}
				);
			} else {
				mutation.mutate(
					{ state: PoliceCheckStates.PERSONAL, personal: data },
					{
						async onSuccess() {
							toast.success('Personal info added successfully!');
							refetchSession();
							navigate('../address');
						},
						onError(error) {
							if (isAxiosError(error)) {
								toast.error(error.response?.data?.Error ?? error.message);
							}
						},
					}
				);
			}
		} catch (e: any) {
			console.log({ error: e });
			toast.error(e?.message ?? 'Something went wrong!');
		}
	}

	return (
		<Box
			component='form'
			onSubmit={handleSubmit}
		>
			<GreyBorderBanner>
				<h2 className='text-primary pt1'>Personal Information</h2>
				<div className='row'>
					<div className='col-md-4'>
						<div className='form-group bmd-form-group'>
							<CustomToolTip content='Please enter your last name. This can also be referred to as Family Name or Surname. Enter your legal last name only, as it appears on your government issued ID. ' />
						</div>
						<TextField
							required
							name='first_name'
							variant='standard'
							placeholder='First Name*'
							fullWidth
							color='secondary'
							defaultValue={store?.first_name}
						/>
					</div>
					<div className='col-md-4'>
						<div className='form-group bmd-form-group'>
							<CustomToolTip content='Please enter your middle name which is optional.' />
						</div>
						<TextField
							name='middle_name'
							variant='standard'
							placeholder='Middle Name(s)'
							fullWidth
							color='secondary'
							defaultValue={store?.middle_name}
						/>
					</div>
					<div className='col-md-4'>
						<div className='form-group bmd-form-group'>
							<CustomToolTip content='Please enter your last name. This can also be referred to as Family Name or Surname. Enter your legal last name only, as it appears on your government issued ID. ' />
						</div>
						<TextField
							required
							name='last_name'
							variant='standard'
							placeholder='Last Name*'
							fullWidth
							color='secondary'
							defaultValue={store?.last_name}
						/>
					</div>

					<div className='col-md-6'>
						<div className='form-group bmd-form-group'>
							<CustomToolTip content='Please enter your last name at birth ONLY if it differs from your current last name entered above. Your last name can also be referred to as your family name or surname at birth. This would be applicable to individuals who have legally changed their last name since birth.' />
							<TextField
								name='birth_last_name'
								variant='standard'
								placeholder='Last Name at Birth'
								fullWidth
								color='secondary'
								defaultValue={store?.birth_last_name}
							/>
						</div>
					</div>

					<div className='col-md-6'>
						<div className='form-group bmd-form-group'>
							<CustomToolTip content='Maiden Name is the last name/surname a married individual used from birth, prior to it being legally changed at marriage. If you have a maiden name, please enter it in this section. If you do not have a maiden name, please do not fill in this field. ' />
							<TextField
								name='other_name'
								variant='standard'
								placeholder='Maiden Name(s) or Alias (Other Names)'
								fullWidth
								color='secondary'
								defaultValue={store?.other_name}
							/>
						</div>
					</div>

					<div className='col-md-6'>
						<div className='form-group bmd-form-group'>
							<TextField
								required
								name='email'
								variant='standard'
								placeholder='Email*'
								fullWidth
								color='secondary'
								defaultValue={store?.email}
							/>
						</div>
					</div>
					<div className='col-md-6'>
						<div className='form-group bmd-form-group'>
							<TextField
								inputRef={confirmEmailRef}
								required
								name='confirmEmail'
								variant='standard'
								placeholder='Confirm Email*'
								fullWidth
								color='secondary'
								defaultValue={store?.email}
							/>
						</div>
					</div>
					<FormControl
						component='fieldset'
						variant='standard'
						className='mx-4 my-2 block'
					>
						<FormControlLabel
							control={
								<Checkbox
									required
									name='is_email_allowed'
									defaultChecked={store?.is_email_allowed}
								/>
							}
							label={`I agree that my results will be emailed to me at the email
							address I entered. I also understand that my personal
						information and confidential results will be exposed to this
						email address.`}
						/>
					</FormControl>
					<div className='col-md-6'>
						<div className='form-group bmd-form-group'>
							<TextField
								name='city'
								variant='standard'
								placeholder='City (Place of Birth)'
								fullWidth
								color='secondary'
								defaultValue={store?.city}
							/>
						</div>
					</div>
					<div className='col-md-6 mt-[-5px]'>
						<label className='label-static'>
							Country{' '}
							<span className='sup_char'>
								<sup>*</sup>
							</span>
						</label>
						<div className='form-group'>
							<select
								required
								name='country'
								className='form-control select-top mb-2'
								defaultValue={store?.country}
							>
								<option value=''>Select Country</option>
								{countries.map(v => (
									<option
										key={v.country}
										value={v.country}
									>
										{v.country}
									</option>
								))}
							</select>
							<span className='fa fa-fw fa-angle-down field_icon eye'></span>
						</div>
					</div>
					<div className='col-md-4 pt1'>
						<label className='label-static'>
							Sex{' '}
							<span className='sup_char'>
								<sup>*</sup>
							</span>
						</label>
						<div className='form-group'>
							<select
								name='sex'
								className='form-control select-top'
								required
								defaultValue={store?.sex}
							>
								<option value=''>Select Sex</option>
								<option value='MALE'>Male</option>
								<option value='FEMALE'>Female</option>
							</select>
							<span className='fa fa-fw fa-angle-down field_icon eye'></span>
						</div>
					</div>

					<div className='col-md-4'>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								className='mt-8'
								slotProps={{
									textField: {
										variant: 'standard',
										fullWidth: true,
										name: 'dob',
									},
								}}
								maxDate={dayjs()}
								label='Date of Birth'
								defaultValue={store?.dob ? dayjs(store.dob) : null}
							/>
						</LocalizationProvider>
					</div>

					<div className='col-md-4'>
						<div className='form-group mt3 bmd-form-group'>
							<PhoneNumberInput
								phoneNumber={phone}
								handlePhoneNumberChange={handlePhoneNumberChange}
							/>
						</div>
					</div>
				</div>
			</GreyBorderBanner>
			<Button
				variant='outlined'
				size='large'
				onClick={() => {
					navigate('../../consent');
				}}
			>
				Back
			</Button>
			<LoadingButton
				className='ml-2'
				variant='contained'
				color='secondary'
				type='submit'
				size='large'
				loading={mutation.isPending || editMutation.isPending}
			>
				{store?.uuid ? 'Update & Continue' : 'Accept & Continue'}
			</LoadingButton>
		</Box>
	);
}

const schema = z.object({
	first_name: z.string().min(1),
	middle_name: z.string().default(''),
	last_name: z.string(),
	email: z.string().email(),
	city: z.string().default(''),
	country: z.string(),
	confirmEmail: z.string().email(),
	birth_last_name: z.string().default(''),
	other_name: z.string().default(''),
	sex: z.string().toUpperCase(),
	dob: z.string(),
	phone: z.string(),
	is_email_allowed: z.literal('on').transform(Boolean),
});

export type PersonalInformationSchema = z.infer<typeof schema>;
