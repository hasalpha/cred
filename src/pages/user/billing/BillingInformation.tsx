import Paper from '@mui/material/Paper/Paper';
import Stack from '@mui/material/Stack/Stack';
import TextField from '@mui/material/TextField/TextField';
import Typography from '@mui/material/Typography/Typography';
import { useCallback, useState } from 'react';
import { billingSchema } from './schemas';
import { toast } from 'react-toastify';
import {
	useGetBillingInformation,
	useGetClientObject,
	usePostBillingInformation,
	usePutBillingInformation,
} from './hooks';
import { isAxiosError } from 'axios';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import listOfCountries from 'assets/json/state.json';
import FormControl from '@mui/material/FormControl/FormControl';
import Select from '@mui/material/Select/Select';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import InputLabel from '@mui/material/InputLabel/InputLabel';

export default function BillingInformation() {
	const [country, setCountry] = useState('');
	const postMutation = usePostBillingInformation();
	const { data: clientData, refetch: refetchClient } = useGetClientObject();
	const {
		data: billingData,
		status,
		isLoading,
		refetch: refetchBilling,
	} = useGetBillingInformation();
	const putMutation = usePutBillingInformation();

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
		e => {
			e.preventDefault();
			const reg = new RegExp(/[^A-Za-z0-9.@]/, 'gi');
			const obj = Object.fromEntries(new FormData(e.currentTarget).entries());
			const accountEmailsString = obj.account_emails
				.toString()
				.replaceAll(reg, ' ');
			const accountEmailsList = accountEmailsString.split(' ').filter(Boolean);
			obj.account_emails = accountEmailsList as any;
			obj.company_name = clientData?.organization!;
			const result = billingSchema.safeParse(obj);
			if (!result.success) {
				return toast.error(result.error.cause + '');
			}
			const { data } = result;
			if (billingData?.uuid) {
				putMutation.mutate(
					{ uuid: billingData.uuid, ...data },
					{
						async onSettled(_data, error) {
							if (error) {
								if (isAxiosError(error)) {
									const { Error: errorMessage } = error.response?.data;
									return toast.error(errorMessage);
								}
								return toast.error(error.message);
							}
							await refetchBilling();
							return toast.success('Billing information updated successfully!');
						},
					}
				);
				return;
			}
			postMutation.mutate(data, {
				async onSettled(_data, error) {
					if (error) {
						if (isAxiosError(error)) {
							const { Error: errorMessage } = error.response?.data;
							return toast.error(errorMessage);
						}
						return toast.error(error.message);
					}
					await refetchClient();
					await refetchBilling();
					return toast.success('Billing information saved successfully!');
				},
			});
		},
		[
			billingData?.uuid,
			clientData?.organization,
			postMutation,
			putMutation,
			refetchBilling,
			refetchClient,
		]
	);

	if (status === 'pending' && isLoading) {
		return;
	}

	return (
		<>
			<Typography
				variant='h3'
				color='primary'
			>
				Billing Information
			</Typography>
			<Paper
				component='form'
				variant='outlined'
				className='my-4 rounded-xl p-8 text-center'
				onSubmit={handleSubmit}
			>
				<Stack
					direction='row'
					columnGap={8}
					sx={{
						'@media (max-width: 780px)': {
							flexDirection: 'column',
							rowGap: 2,
						},
					}}
				>
					<TextField
						variant='outlined'
						label='Accounting Email'
						fullWidth
						size='small'
						name='account_emails'
						defaultValue={billingData?.account_emails.join(', ')}
					/>
				</Stack>
				<br />
				<Stack
					direction='row'
					columnGap={8}
					sx={{
						'@media (max-width: 780px)': {
							flexDirection: 'column',
							rowGap: 2,
						},
					}}
				>
					<TextField
						variant='outlined'
						label='Street Address'
						fullWidth
						size='small'
						name='street_address'
						defaultValue={billingData?.street_address}
					/>
					<TextField
						variant='outlined'
						label='City'
						fullWidth
						size='small'
						name='city'
						defaultValue={billingData?.city}
					/>
				</Stack>
				<br />

				<FormControl
					fullWidth
					className='text-left'
				>
					<InputLabel>Country</InputLabel>
					<Select
						size='small'
						label='Country'
						name='country'
						defaultValue={billingData?.country}
						onChange={e => {
							setCountry(e.target.value);
						}}
					>
						{listOfCountries.map(v => (
							<MenuItem
								key={v.country}
								value={v.country}
							>
								{v.country}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<br />
				<br />

				<Stack
					direction='row'
					columnGap={8}
					sx={{
						'@media (max-width: 780px)': {
							flexDirection: 'column',
							rowGap: 2,
						},
					}}
				>
					<TextField
						variant='outlined'
						label='Postal Code/Zip Code'
						size='small'
						fullWidth
						name='zip_code'
						defaultValue={billingData?.zip_code}
					/>

					<FormControl
						fullWidth
						className='text-left'
					>
						<InputLabel>State/Province</InputLabel>
						<Select
							size='small'
							label='State/Province'
							defaultValue={billingData?.state}
							name='state'
						>
							{listOfCountries
								.find(v => v.country === (country || billingData?.country))
								?.states.map(v => (
									<MenuItem
										key={v}
										value={v}
									>
										{v}
									</MenuItem>
								))}
						</Select>
					</FormControl>
				</Stack>
				<br />
				<LoadingButton
					variant='contained'
					color='secondary'
					type='submit'
					loading={postMutation.isPending || putMutation.isPending}
				>
					Save
				</LoadingButton>
			</Paper>
		</>
	);
}
