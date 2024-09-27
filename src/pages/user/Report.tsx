import Box from '@mui/material/Box/Box';
import Container from '@mui/material/Container/Container';
import Divider from '@mui/material/Divider/Divider';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import logo from 'assets/img/credibled_logo_205x45.png';
import { SurroundedTitle } from './SurroundedTitle';
import DenseTable from './ReportTable';

function createData(
	name: string,
	calories: string,
	fat: string,
	carbs: string,
	protein: string,
	...stuff: string[]
) {
	return { name, calories, fat, carbs, protein, postalCode: stuff[0] };
}

const residentialHistory = [
	createData('9 Fairview Avenue', 'toronto', 'ON', 'CA', 'M6P3A2', 'CURRENT'),
	createData('490 Durie Street', 'toronto', 'ON', 'CA', 'M6S3G7'),
];

const positionLocation = [createData('Toronto', 'ON', 'CA', 'MP62K9', '')];

export function Report() {
	return (
		<Container maxWidth='lg'>
			<Stack
				flexDirection='row'
				justifyContent='space-between'
				className='pt-4'
			>
				<img
					alt='Credibled Logo'
					src={logo}
					width={215}
					className='h-fit'
				/>
				<Stack
					justifyContent='start'
					alignItems='end'
					className='row-span-2'
				>
					<Typography className='rounded-full bg-reportLightGreen px-4 py-1 font-bold'>
						Completed
					</Typography>
					<Typography variant='body2'>
						Report ID:{' '}
						<Typography
							component='span'
							color='primary'
						>
							PYiD7BLN
						</Typography>
					</Typography>
					<Typography variant='body2'>
						Date Completed:{' '}
						<Typography
							component='span'
							color='primary'
						>
							09-15-24
						</Typography>
					</Typography>
					<Typography variant='body2'>
						Date Generated:{' '}
						<Typography
							component='span'
							color='primary'
						>
							09-17-24
						</Typography>
					</Typography>
				</Stack>
			</Stack>
			<Stack
				className='pb-8'
				rowGap={3}
			>
				<SurroundedTitle>APPLICANT INFORMATION</SurroundedTitle>
				<Stack
					direction='row'
					justifyContent='space-between'
				>
					<Box className='grid grid-cols-2 grid-rows-4 gap-x-12'>
						<Typography className='font-bold'>Legal First name:</Typography>
						<Typography variant='body2'>Elvine</Typography>
						<Typography className='font-bold'>Legal Middle Name:</Typography>
						<Typography variant='body2'>Brayan</Typography>
						<Typography className='font-bold'>Legal Last name:</Typography>
						<Typography variant='body2'>Assouline</Typography>
						<Typography className='font-bold'>SIN/SSN:</Typography>
						<Typography variant='body2'>SIN: XXXXX0538</Typography>
					</Box>
					<Divider
						orientation='vertical'
						flexItem
						className='bg-gray'
					/>
					<Box className='relative right-[10%] grid grid-cols-2 grid-rows-4 gap-0'>
						<Typography
							className='font-bold'
							variant='body2'
						>
							Date Of Birth:
						</Typography>
						<Typography variant='body2'>November, 2nd 1990</Typography>
						<Typography
							className='font-bold'
							variant='body2'
						>
							Email:
						</Typography>
						<Typography variant='body2'>elvine@credibled.com</Typography>
						<Typography
							className='font-bold'
							variant='body2'
						>
							Phone:
						</Typography>
						<Typography variant='body2'>+1 234 556 1071</Typography>
					</Box>
				</Stack>

				<Stack rowGap={2}>
					<SurroundedTitle>RESIDENTIAL HISTORY</SurroundedTitle>
					<DenseTable
						headers={[
							'ADDRESS',
							'CITY',
							'PROVINCE/STATE',
							'COUNTRY',
							'POSTAL CODE',
							'DETAILS',
						]}
						rows={residentialHistory}
					/>
				</Stack>

				<Stack rowGap={2}>
					<SurroundedTitle>POSITION LOCATION</SurroundedTitle>
					<DenseTable
						headers={['CITY', 'PROVINCE/STATE', 'COUNTRY', 'POSTAL CODE']}
						rows={positionLocation}
					/>
				</Stack>

				<Stack rowGap={1}>
					<SurroundedTitle>
						<Typography
							className='text-xl font-bold uppercase'
							color='secondary'
						>
							report summary&nbsp;&nbsp;
							<Typography
								component='span'
								className='rounded-full bg-reportLightGreen px-4 py-1 py-2 font-bold capitalize text-black'
								variant='h6'
							>
								Cleared
							</Typography>
						</Typography>
					</SurroundedTitle>
					<Typography
						variant='body2'
						className='text-justify text-xs'
					>
						The Report Results should not be interpreted as an expression of
						Credibled's stance, endorsement, or prediction regarding the
						applicant's financial stability, intent, integrity, or capabilities.
						Instead, these results are a compilation of data sourced by
						Credibled from various entities. Credibled holds no responsibility
						for any opinions, remarks, or decisions that might be made based on
						these Report Results. Using these results demands individual
						discernment and expertise. The Report Summary provides an overview
						of each section detailed in this report, with specific insights
						available within the individual sections. Similarly, the Scan
						Summary offers a concise review of each scan executed in this
						report.
					</Typography>
					<Typography className='border-b-solid border-b-2 border-b-black bg-gray-200 p-2 text-center text-xl font-medium uppercase'>
						Summary
					</Typography>
					<Stack
						direction='row'
						gap={2}
					>
						<Typography className='w-full rounded-md bg-gray-100 py-2 text-center font-medium'>
							Canadian Criminal Record - L1
							<Stack
								direction='row'
								justifyContent='space-evenly'
								alignItems='center'
								className='my-1.5 capitalize'
							>
								<Typography>
									Status:
									<Typography
										component='span'
										className='mx-2 rounded-md bg-reportGreen px-2.5 py-1 capitalize'
										variant='body2'
									>
										Completed
									</Typography>
								</Typography>
								<Typography>
									Result:
									<Typography
										component='span'
										className='mx-2 rounded-md bg-reportGreen px-2.5 py-1 capitalize'
										variant='body2'
									>
										Cleared
									</Typography>
								</Typography>
							</Stack>
						</Typography>
						<Typography className='w-full rounded-md bg-gray-100 p-2 text-center font-medium'>
							ID Verification
							<Stack
								direction='row'
								justifyContent='space-evenly'
								alignItems='center'
								className='my-1.5 capitalize'
							>
								<Typography>
									Status:
									<Typography
										component='span'
										className='mx-2 rounded-md bg-reportGreen px-2.5 py-1 capitalize'
										variant='body2'
									>
										Completed
									</Typography>
								</Typography>
							</Stack>
						</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Container>
	);
}
