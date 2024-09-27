import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import Stack from '@mui/material/Stack/Stack';

export default function Loading() {
	return (
		<Stack
			alignItems='center'
			justifyContent='center'
			sx={{ height: '75vh' }}
		>
			<CircularProgress sx={{ color: '#2a2872' }} />
		</Stack>
	);
}
