import { Typography, Stack, Container } from '@mui/material';
import { SurroundedTitle } from './SurroundedTitle';
import DenseTable from './ReportTable';
import EastIcon from '@mui/icons-material/East';
import logo from 'assets/img/credibled_logo_205x45.png';

export function ReportPageTwo() {
	return (
		<Container maxWidth='lg'>
			<Stack spacing={2}>
				<Stack
					direction='row'
					alignItems='center'
					justifyContent='space-between'
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
						<Typography className='text-xl font-bold uppercase'>
							<Typography
								className='text-xl font-bold uppercase'
								color='primary'
								component='span'
							>
								Criminal
							</Typography>{' '}
							Record Check
						</Typography>
						<Typography className='rounded-full bg-reportLightGreen px-4 py-1 font-bold'>
							Completed
						</Typography>
					</Stack>
				</Stack>

				<SurroundedTitle>
					<Typography className='text-xl font-bold uppercase'>
						IDENTITIES
					</Typography>
				</SurroundedTitle>
				<DenseTable
					headerClass='text-xs/4'
					headers={[
						'name',
						'date of birth',
						'address',
						'address doc type',
						'document type',
						'document number',
						'issuing country',
						'issuing jurisdiction',
						'expiry date',
					]}
					rows={[
						{
							name: 'Elvine Assouline',
							'date of birth': '11-02-1992',
							address: '9 fairview ave, toronto, on, m6p3a2, ca',
							'address doc type': 'none found',
							'document type': 'DRIVING_LICENSE',
							'document number': 'A8059-22119-21102',
							'issuing country': 'CA',
							'issuing jurisdiction': 'on',
							'expiry date': '01-20-2025',
						},
					]}
				/>

				<SurroundedTitle>
					<Typography className='text-xl font-bold uppercase'>
						CANADIAN CRIMINAL RECORD CHECK
					</Typography>
				</SurroundedTitle>
				<DenseTable
					headerClass='text-xs/4'
					headers={[
						'name',
						'date of birth',
						'gender',
						'other names/aliases',
						'issued date',
					]}
					rows={[
						{
							name: 'assouline, elvine brayan',
							'date of birth': '11-02-1992',
							gender: 'm',
							'other names/aliases': '',
							'issued date': '05-15-2023',
						},
					]}
				/>
				<Stack
					justifyContent='space-between'
					direction='row'
				>
					<Typography
						color='secondary'
						className='text-lg font-bold uppercase'
					>
						basic canadian criminal record check
					</Typography>
					<Typography>
						............................................................................................
					</Typography>
					<Typography className='text-lg font-bold uppercase'>
						result: <span className='text-credibledGreen'>clear</span>
					</Typography>
				</Stack>
				<Stack
					rowGap={1}
					className='rounded-lg border-2 border-solid border-black p-2'
				>
					<Typography
						variant='body2'
						color='primary'
						className='font-bold uppercase'
					>
						Comments:
					</Typography>
					<Typography variant='body2'>
						Based solely on the name(s) and date of birth provided and the
						criminal record information declared by the applicant, a search of
						the RCMP National Repository of Criminal Records did not identify
						any records with the name(s) and date of birth of the applicant.
						Positive identification that a criminal record does or does not
						exist at the RCMP National Repository of Criminal Records can only
						be confirmed by fingerprint comparison. Delays do exist between a
						conviction being rendered in court, and the details being accessible
						on the RCMP National Repository of Criminal Records. Not all
						offenses are reported to the RCMP National Repository of Criminal
						Records.
					</Typography>
				</Stack>

				<Stack
					justifyContent='space-between'
					direction='row'
				>
					<Typography
						color='secondary'
						className='text-lg font-bold uppercase'
					>
						enhanced canadian criminal record check
					</Typography>
					<Typography>
						.......................................................................................
					</Typography>
					<Typography className='text-lg font-bold uppercase'>
						result:{' '}
						<Typography
							component='span'
							color='primary'
							className='text-lg font-bold'
						>
							REVIEW
						</Typography>
					</Typography>
				</Stack>
				<Stack
					rowGap={1}
					className='rounded-lg border-2 border-solid border-black p-2'
				>
					<Typography
						variant='body2'
						color='primary'
						className='font-bold uppercase'
					>
						Comments:
					</Typography>
					<Typography variant='body2'>
						No information was revealed that can be disclosed in accordance with
						federal laws and RCMP policies.
					</Typography>
				</Stack>

				<SurroundedTitle>
					<Typography className='text-xl font-bold uppercase'>
						DISCLOSED CONVICTIONS
					</Typography>
				</SurroundedTitle>

				<DenseTable
					headerClass='text-xs/4'
					headers={[
						'offense',
						'court location',
						'date of sentence',
						'description',
					]}
					rows={[
						{
							offense: '249',
							'court location': 'toronto',
							'date of sentence': '08-18-2023',
							description: 'dangerous operation of motor vehicle',
						},
					]}
				/>

				<SurroundedTitle>
					<Typography className='text-xl font-bold uppercase'>
						ADDITIONAL DOCUMENTS
					</Typography>
				</SurroundedTitle>
				<Stack
					direction='row'
					gap={4}
					justifyContent='start'
					alignItems='center'
				>
					<Stack
						direction='row'
						alignItems='center'
						gap={1}
					>
						<EastIcon />
						<Typography
							color='primary'
							className='font-bold uppercase'
						>
							Proof of Criminal Record Check
						</Typography>
					</Stack>
					<Stack
						direction='row'
						alignItems='center'
						gap={1}
					>
						<EastIcon />
						<Typography
							color='primary'
							className='font-bold uppercase'
						>
							Understanding your results
						</Typography>
					</Stack>
				</Stack>

				<SurroundedTitle>
					<Typography className='text-xl font-bold uppercase'>NOTES</Typography>
				</SurroundedTitle>
			</Stack>
		</Container>
	);
}
