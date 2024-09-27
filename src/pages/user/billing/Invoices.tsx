import Button from '@mui/material/Button/Button';
import DownloadIcon from '@mui/icons-material/Download';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import Box from '@mui/material/Box/Box';
import TableContainer from '@mui/material/TableContainer/TableContainer';
import Table from '@mui/material/Table/Table';
import TableHead from '@mui/material/TableHead/TableHead';
import TableRow from '@mui/material/TableRow/TableRow';
import TableCell from '@mui/material/TableCell/TableCell';
import TableBody from '@mui/material/TableBody/TableBody';
import { useGetInvoices } from './hooks';
import dayjs from 'dayjs';
import PaidIcon from '@mui/icons-material/Paid';
import BillingInformation from './BillingInformation';

const usd = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

export default function Invoices() {
	const { data: invoices } = useGetInvoices();
	const latestUnpaidInvoice = invoices?.find(v => !v.status);
	return (
		<>
			{latestUnpaidInvoice && (
				<Stack
					direction='row'
					justifyContent='space-between'
					alignItems='center'
					rowGap={2}
					className='m-auto flex-row flex-wrap items-start bg-gray-100 px-4 py-2 sm:w-auto sm:flex-row sm:items-center sm:px-8'
				>
					<Typography className='text-xl font-bold'>
						{dayjs(latestUnpaidInvoice.invoice_due_date).format('MMMM')}
					</Typography>
					<Typography className='text-xl font-bold'>
						Invoice #: {latestUnpaidInvoice.invoice_number}
					</Typography>
					<Typography className='text-xl font-bold'>
						Amount: {usd.format(latestUnpaidInvoice.amount / 100)}
					</Typography>
					<Typography className='text-xl font-bold'>
						Status: Not Paid
					</Typography>
					<Button
						variant='contained'
						className='rounded-full'
						onClick={() => {
							window.open(latestUnpaidInvoice.invoice_pay_url, '_blank');
						}}
					>
						Pay by Credit Card
					</Button>
				</Stack>
			)}
			<Box
				component='section'
				className='mt-4'
			>
				<BillingInformation />
			</Box>
			<h5 className='px-1 font-bold'>Past Invoices</h5>
			<Box className='mt-8 rounded-2xl border-1 border-solid border-gray-400 p-3 px-4 pb-4'>
				<TableContainer>
					<Table
						aria-label='simple table'
						padding='normal'
						size='small'
						stickyHeader
					>
						<TableHead>
							<TableRow
								className='text-xl font-bold uppercase'
								sx={{ '& *': { border: 0 }, padding: '10px' }}
							>
								<TableCell>Month</TableCell>
								<TableCell align='center'>Invoice #</TableCell>
								<TableCell align='center'>Amount</TableCell>
								<TableCell align='center'>Status</TableCell>
								<TableCell align='center'>Action</TableCell>
								<TableCell align='center'>Download Invoice</TableCell>
								<TableCell align='center'>Download Usage</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{invoices?.length ? (
								invoices?.map(invoice => (
									<TableRow
										key={invoice.invoice_id}
										sx={{ '& td, & th': { border: 0, paddingTop: 3 } }}
									>
										<TableCell
											component='th'
											scope='row'
											className='capitalize'
										>
											{dayjs(invoice.invoice_due_date).format('MMMM')}
										</TableCell>
										<TableCell align='center'>
											{invoice.invoice_number}
										</TableCell>
										<TableCell align='center'>
											{usd.format(invoice.amount / 100)}
										</TableCell>
										<TableCell
											align='center'
											className='capitalize'
										>
											{!!invoice.status ? 'Paid' : 'Not Paid'}
										</TableCell>
										<TableCell align='center'>
											<Button
												variant='contained'
												color='primary'
												disabled={!!invoice.status}
												startIcon={<PaidIcon />}
												onClick={async () => {
													window.open(invoice.invoice_pay_url, '_blank');
												}}
											>
												Pay
											</Button>
										</TableCell>
										<TableCell align='center'>
											<Button
												variant='contained'
												color='secondary'
												startIcon={<DownloadIcon />}
												onClick={async () => {
													window.open(invoice.invoice_url, '_blank');
												}}
											>
												Download
											</Button>
										</TableCell>
										<TableCell align='center'>
											<Button
												variant='contained'
												color='secondary'
												disabled={!invoice.details_csv}
												startIcon={<DownloadIcon />}
												onClick={async () => {
													window.open(invoice.csv_url, '_blank');
												}}
											>
												Usage
											</Button>
										</TableCell>
									</TableRow>
								))
							) : (
								<p className='m-3'>
									No past invoices available. Future invoices will appear here
									once issued.
								</p>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</>
	);
}

export function downloadPDF(pdf: string, fileName: string) {
	let blob = new Blob([pdf], { type: 'application/pdf' });
	let blobUrl = URL.createObjectURL(blob);
	// Create a link element dynamically
	const link = document.createElement('a');

	// Set the link's href to the Blob URL
	link.href = blobUrl;

	// Set the desired filename for the download
	link.download = fileName;

	// Simulate a click on the link to initiate the download
	link.click();
}

type TokenizationResponse = {};

const bamboraBaseUrl = 'https://api.na.bambora.com/';

export async function tokenisation(
	cardNumber: string,
	expiryMonth: string,
	expiryYear: string,
	cvd: string
) {
	const url = `${bamboraBaseUrl}scripts/tokenization/tokens`;

	const payload = {
		number: cardNumber,
		expiry_month: expiryMonth,
		expiry_year: expiryYear,
		cvd,
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const data = await response.json();
			return data; // More specific error message
		}

		const data: TokenizationResponse = await response.json();
		return data;
	} catch (error) {
		console.error('Error:', error);
	}
}
