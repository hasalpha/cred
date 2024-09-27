import Button from '@mui/material/Button/Button';
import Paper from '@mui/material/Paper/Paper';
import Stack from '@mui/material/Stack/Stack';
import TextField from '@mui/material/TextField/TextField';
import Typography from '@mui/material/Typography/Typography';
import { usePaymentInputs } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';
import {
	useGetClientObject,
	useGetPaymentCard,
	usePostPaymentCard,
	usePutPaymentCard,
} from './hooks';
import { useCallback } from 'react';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { cardSchema } from './schemas';
import clsx from 'clsx';
import { tokenisation } from './Invoices';

type PaymentProps =
	| { isEdit: true; setIsEdit: (edit: boolean) => void }
	| { isEdit: false; insideModal?: () => void };

export default function PaymentForm2(props: PaymentProps) {
	const { refetch: refetchClientObject } = useGetClientObject();
	const { data, refetch: refetchCard } = useGetPaymentCard();
	const postMutation = usePostPaymentCard();
	const putMutation = usePutPaymentCard();

	const {
		getCardImageProps,
		getCardNumberProps,
		getExpiryDateProps,
		getCVCProps,
		meta,
	} = usePaymentInputs();

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
		async e => {
			e.preventDefault();
			if (Object.values(meta.erroredInputs).some(Boolean)) {
				return;
			}
			const formData = new FormData(e.currentTarget);
			const obj = Object.fromEntries(formData.entries());
			[obj.expiry_month, obj.expiry_year] = (obj.expiry_date + '').split('/');
			obj.card_type = meta.cardType.type;
			const parsedObject = cardSchema.safeParse(obj);
			if (parsedObject.success) {
				const { data } = parsedObject;
				await tokenisation(
					data.card_number,
					data.expiry_month,
					data.expiry_year,
					data.cvd
				);
				if (props.isEdit) {
					putMutation.mutate(
						{ ...parsedObject.data, uuid: '' },
						{
							onError(e) {
								if (isAxiosError(e)) {
									return toast.error(`failed to add card: ${e.message}`);
								}
							},
							onSuccess() {
								toast.success('Card updated successfully!');
								if (props.isEdit) {
									props.setIsEdit(false);
								}
								refetchCard();
							},
						}
					);
				} else {
					postMutation.mutate(parsedObject.data, {
						onError(e) {
							if (isAxiosError(e)) {
								toast.error(e.message);
							}
							toast.error('failed to add card');
						},
						onSuccess() {
							toast.success('Card added successfully!');
							props.insideModal?.();
							refetchClientObject();
						},
					});
				}
			}
		},
		[
			meta?.cardType?.type,
			meta?.erroredInputs,
			postMutation,
			props,
			putMutation,
			refetchCard,
			refetchClientObject,
		]
	);

	if (props.isEdit) {
		return (
			<Paper
				variant='outlined'
				className='my-4 w-full rounded-xl p-8 text-center lg:w-1/2'
				component='form'
				onSubmit={handleSubmit}
			>
				<TextField
					variant='outlined'
					label='Name of the card'
					name='name_on_card'
					fullWidth
					size='small'
					required
					defaultValue={data?.name_on_card}
				/>
				<br />
				<br />
				<TextField
					inputProps={{ ...getCardNumberProps(), name: 'card_number' }}
					required
					InputProps={{
						startAdornment: (
							<svg
								{...getCardImageProps({ images })}
								className='mr-2'
							/>
						),
					}}
					size='small'
					helperText={
						meta.touchedInputs.cardNumber && meta.erroredInputs.cardNumber
					}
					error={meta.touchedInputs.cardNumber && meta.erroredInputs.cardNumber}
					fullWidth
				/>
				<br />
				<br />
				<Stack
					direction='row'
					columnGap={2}
					className='flex-col gap-y-4 sm:flex-row sm:gap-y-0'
				>
					<TextField
						inputProps={{ ...getExpiryDateProps(), name: 'expiry_date' }}
						required
						size='small'
						helperText={
							meta.touchedInputs.expiryDate && meta.erroredInputs.expiryDate
						}
						error={
							meta.touchedInputs.expiryDate && !!meta.erroredInputs.expiryDate
						}
						fullWidth
						defaultValue={`${data?.expiry_month}${data?.expiry_year}`}
					/>
					<TextField
						inputProps={{ ...getCVCProps(), name: 'cvd' }}
						required
						size='small'
						helperText={meta.touchedInputs.cvc && meta.erroredInputs.cvc}
						error={meta.touchedInputs.cvc && !!meta.erroredInputs.cvc}
						fullWidth
					/>
				</Stack>
				<br />
				<br />

				<Typography
					variant='subtitle2'
					className='text-left normal-case'
				>
					You won't be charged immediately. You will be charged for your
					consumption on the first day of each billing period using the payment
					method you've specified above. Credibled will keep your payment info
					securely on file.
				</Typography>
				<br />
				<LoadingButton
					variant='contained'
					color='secondary'
					type='submit'
					loading={putMutation.isPending}
				>
					Save
				</LoadingButton>
				<Button
					className='mx-4'
					variant='contained'
					color='secondary'
					onClick={() => {
						props.setIsEdit(false);
					}}
				>
					Cancel
				</Button>
			</Paper>
		);
	}

	return (
		<Paper
			variant='outlined'
			className={clsx(
				'my-4 w-full rounded-xl p-8 text-center lg:w-1/2',
				props.insideModal && 'lg:w-auto'
			)}
			component='form'
			onSubmit={handleSubmit}
		>
			<TextField
				variant='outlined'
				label='Name of the card'
				name='name_on_card'
				fullWidth
				size='small'
				required
			/>
			<br />
			<br />
			<TextField
				inputProps={{ ...getCardNumberProps(), name: 'card_number' }}
				required
				InputProps={{
					startAdornment: (
						<svg
							{...getCardImageProps({ images })}
							className='mr-2'
						/>
					),
				}}
				size='small'
				helperText={
					meta.touchedInputs.cardNumber && meta.erroredInputs.cardNumber
				}
				error={meta.touchedInputs.cardNumber && meta.erroredInputs.cardNumber}
				fullWidth
			/>
			<br />
			<br />
			<Stack
				direction='row'
				columnGap={2}
				className='flex-col gap-y-4 sm:flex-row sm:gap-y-0'
			>
				<TextField
					inputProps={{ ...getExpiryDateProps(), name: 'expiry_date' }}
					required
					size='small'
					helperText={
						meta.touchedInputs.expiryDate && meta.erroredInputs.expiryDate
					}
					error={
						meta.touchedInputs.expiryDate && !!meta.erroredInputs.expiryDate
					}
					fullWidth
				/>
				<TextField
					inputProps={{ ...getCVCProps(), name: 'cvd' }}
					required
					size='small'
					helperText={meta.touchedInputs.cvc && meta.erroredInputs.cvc}
					error={meta.touchedInputs.cvc && !!meta.erroredInputs.cvc}
					fullWidth
				/>
			</Stack>
			<br />
			<br />

			<Typography
				variant='subtitle2'
				className='text-left normal-case'
			>
				You won't be charged immediately. You will be charged for your
				consumption on the first day of each billing period using the payment
				method you've specified above. Credibled will keep your payment info
				securely on file.
			</Typography>
			<br />
			<LoadingButton
				variant='contained'
				color='secondary'
				type='submit'
				loading={postMutation.isPending}
			>
				Save
			</LoadingButton>
		</Paper>
	);
}
