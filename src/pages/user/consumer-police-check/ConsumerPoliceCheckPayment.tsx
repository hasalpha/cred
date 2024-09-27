import Button from '@mui/material/Button/Button';
import Stack from '@mui/material/Stack/Stack';
import { PaymentDetails, getPrice } from 'apis/user.api';
import { PaymentInputs } from 'components/card-input';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetSessionContextData } from './context/PersonalDetailsContext';

export default function ConsumerPoliceCheckPayment() {
	const navigate = useNavigate();
	const { uuid, final_price } = useGetSessionContextData();
	const paymentRef = useRef<{ handleSubmit: () => void }>(null);
	const [details, setDetails] = useState<PaymentDetails>();
	useEffect(() => {
		getPrice(uuid).then(v => setDetails(v.data));
	}, [uuid]);
	const hstAmount =
		details?.hst != null ? (details?.hst * details?.price) / 100 : details?.hst;
	return (
		<>
			<div
				className='lrpad orlight border'
				style={{ paddingBottom: '3em' }}
			>
				<h2 className='text-primary pt1'>Payment</h2>
				<div className='col-md-12 pt2'>
					<div className='divTable unstyledTable'>
						<div className='divTableHeading'>
							<div className='divTableRow'>
								<div className='divTableHead'>Description</div>
								<div className='divTableHead'>Qty</div>
								<div className='divTableHead'>Rate</div>
								<div className='divTableHead'>Amount</div>
							</div>
						</div>
						<div className='divTableBody'>
							<div className='divTableRow'>
								<div className='divTableCell'>{details?.name}</div>
								<div className='divTableCell'>1</div>
								<div className='divTableCell'>${details?.price}</div>
								<div className='divTableCell'>${details?.price}</div>
							</div>
							<div className='divTableRow'>
								<div className='divTableCell'></div>
								<div className='divTableCell'></div>
								<div className='divTableCell'>Subtotal</div>
								<div className='divTableCell'>${details?.price}</div>
							</div>
							<div className='divTableRow'>
								<div className='divTableCell'></div>
								<div className='divTableCell'></div>
								<div className='divTableCell'>HST</div>
								<div className='divTableCell'>${hstAmount}</div>
							</div>
							<div className='divTableRow'>
								<div className='divTableCell'></div>
								<div className='divTableCell'></div>
								<div className='divTableCell'>
									<b>Total</b>
								</div>
								<div className='divTableCell'>
									<b>${final_price + (hstAmount ?? 0)}</b>
								</div>
							</div>
						</div>
					</div>
					<div
						className='divTable unstyledTable pt2'
						style={{ paddingTop: '3em' }}
					>
						<div className='divTableHeading'>
							<div className='divTableRow'>
								<div className='divTableHead'>Payment Method</div>
							</div>
						</div>
						<div className='divTableBody'>
							<div className='divTableRow'>
								<PaymentInputs
									ref={paymentRef}
									hst={hstAmount ?? 0}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Stack
				direction='row'
				gap={1}
			>
				<Button
					onClick={() => {
						return navigate('../preview');
					}}
					className='btn btn-secondary-outline'
				>
					Previous
				</Button>
				<Button
					className='btn btn-primary'
					type='submit'
					onClick={() => {
						paymentRef.current?.handleSubmit();
					}}
				>
					Finish
				</Button>
			</Stack>
		</>
	);
}
