import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography/Typography';
import Invoices from './Invoices';
import TabMenu from 'components/TabMenu';
import { Tab } from '@mui/material';
import { useImmer } from 'use-immer';
import { useCustomerSession } from './hooks';

export default function Billing() {
	const { data } = useCustomerSession();
	const [tab, setTab] = useImmer<string>('bill');
	function handleTabChange(newTab: string) {
		if (newTab === 'pay') {
			if (data?.['customer url']) {
				window.open(data?.['customer url'], '_blank');
			}
			return;
		}
		setTab(newTab);
	}
	return (
		<Box>
			<TabMenu {...{ tab, handleTabChange, className: 'p-0 mb-8' }}>
				<Tab
					label='Billing Information'
					value='bill'
				/>
				<Tab
					label='Payment method'
					value='pay'
				/>
			</TabMenu>
			<Typography
				variant='h3'
				color='primary'
				className='mb-8'
			>
				Billing
			</Typography>
			<Invoices />
			<br />
		</Box>
	);
}
