import { Button, Stack, TextField } from '@mui/material';
import { useAddPaymentDetailsMutation } from 'apis/user.api';
import { isAxiosError } from 'axios';
import { useGetSessionContextData } from 'pages/user/consumer-police-check/context/PersonalDetailsContext';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { PaymentInputsWrapper, usePaymentInputs } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';

export const PaymentInputs = forwardRef<
	{ handleSubmit: () => void },
	{ hst: number }
>(function PaymentInputs({ hst }, ref) {
	const navigate = useNavigate();
	const submitButtonRef = useRef<HTMLButtonElement>(null);
	const {
		wrapperProps,
		getCardImageProps,
		getCardNumberProps,
		getExpiryDateProps,
		getCVCProps,
	} = usePaymentInputs();
	const mutation = useAddPaymentDetailsMutation();
	const { uuid, final_price } = useGetSessionContextData();

	const handleSubmit = useCallback(
		async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
			e.preventDefault();
			const object = Object.fromEntries(new FormData(e.currentTarget)) as any;
			object.expiry_date = object.expiry.split(' / ')[0];
			object.expiry_year = object.expiry.split(' / ')[1];
			object.amount = '' + (final_price + hst);
			delete object.expiry;
			try {
				const data = paymentSchema.parse(object);
				mutation
					.mutateAsync({
						uuid,
						state: 'PAYMENT',
						payment: data,
					})
					.then(() => {
						localStorage.removeItem('index-store');
						toast.success('Payment successful!');
						navigate('../../thank-you');
					})
					.catch(error => {
						if (isAxiosError(error)) {
							toast.error(error.message);
						}
					});
			} catch (e: any) {
				console.dir(e);
				return toast.error(e.issues);
			}
		},
		[final_price, hst, mutation, uuid, navigate]
	);

	useImperativeHandle(
		ref,
		() => ({
			handleSubmit() {
				if (submitButtonRef.current) {
					submitButtonRef.current.click();
				}
			},
		}),
		[]
	);

	return (
		<Stack
			component='form'
			className='bg-white'
			onSubmit={handleSubmit}
		>
			<br />
			<TextField
				required
				type='text'
				label='Name on card'
				name='name_on_card'
				variant='outlined'
				size='small'
			/>
			<br />
			<PaymentInputsWrapper {...wrapperProps}>
				<svg {...getCardImageProps({ images })} />
				<input
					{...getCardNumberProps()}
					name='card_number'
					required
				/>
				<input
					{...getExpiryDateProps()}
					name='expiry'
					required
				/>
				<input
					{...getCVCProps()}
					name='cvd'
					required
				/>
			</PaymentInputsWrapper>
			<br />
			<Button
				type='submit'
				className='invisible'
				ref={submitButtonRef}
			>
				Submit
			</Button>
		</Stack>
	);
});

const paymentSchema = z.object({
	name_on_card: z.string().min(2),
	card_number: z.string(),
	expiry_date: z.string(),
	expiry_year: z.string(),
	cvd: z.string(),
	amount: z.string(),
});

export type PaymentSchema = z.infer<typeof paymentSchema>;
