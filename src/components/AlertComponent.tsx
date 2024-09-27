import { Alert, AlertTitle, Box, Collapse, IconButton } from '@mui/material';
import * as React from 'react';
export default function AlertComponent({
	closeAlert = () => {},
	openProp = false,
	severity = 'error',
	title = 'Error',
	message = 'Something went wrong! Please try again.',
}: any) {
	return (
		<Box sx={{ width: '100%' }}>
			<Collapse in={openProp}>
				<Alert
					severity={severity}
					action={
						<IconButton
							aria-label='close'
							color='inherit'
							size='small'
							onClick={closeAlert}
						>
							<i className='fa fa-close'></i>
						</IconButton>
					}
					sx={{ mb: 2 }}
				>
					<AlertTitle>{title}</AlertTitle>
					{message}
				</Alert>
			</Collapse>
		</Box>
	);
}
