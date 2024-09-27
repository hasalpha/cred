import { Button, Typography } from '@mui/material';
import { GreyBorderBanner } from '../../../components/GreyBorderBanner';
import { useNavigate } from 'react-router-dom';

const listItems = [
	'You verify that you are at least 18 years of age',
	'You consent to the search of the RCMP National Repository of Criminal Records',
	'You understand that CREDIBLED searches for criminal records based on the personal information you provide. If a match is found, by law we cannot show criminal record details, including conviction information.',
	'You recognize that this is not a Vulnerable Sector Check.',
	'You acknowledge that CREDIBLED is a third party background check provider.',
	'You acknowledge that CREDIBLED checks may not be suitable for immigration and VISA related purposes.',
] as const;

export default function ConsumerPoliceCheckStart() {
	const navigate = useNavigate();
	return (
		<>
			<GreyBorderBanner>
				<Typography variant='h2'>
					You are about to start a criminal record check. What does this mean?
				</Typography>
				<ul className='mt-4'>
					{listItems.map(v => (
						<li
							className='mb-2'
							key={v}
						>
							{v}
						</li>
					))}
				</ul>
				<br />
				<br />
			</GreyBorderBanner>
			<Button
				variant='outlined'
				size='large'
				className='mr-2'
				onClick={() => navigate('..')}
			>
				Back
			</Button>
			<Button
				variant='contained'
				size='large'
				color='secondary'
				className='capitalize'
				onClick={() => navigate('../consent')}
			>
				start my background check
			</Button>
		</>
	);
}
