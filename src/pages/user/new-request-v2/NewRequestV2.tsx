import Typography from '@mui/material/Typography/Typography';
import TextField from '@mui/material/TextField/TextField';
import Stack from '@mui/material/Stack/Stack';
import Paper from '@mui/material/Paper/Paper';
import Button from '@mui/material/Button/Button';
import Switch from '@mui/material/Switch/Switch';
import ReferenceSVG from './referenceSVG';
import Box from '@mui/material/Box/Box';
import { useImmer } from 'use-immer';
import { CanadaFlagSVG } from './can-flag';
import { USAFlagSVG } from './us-flag';
import clsx from 'clsx';
import { useCheckTypes } from 'hooks/useGetCheckTypes';
import { getScanTypeIcon } from '../background-check';
import { CanadianModal } from './modals/CanadianModal';
import { USModal, criminalUSAVariants } from './modals/USModal';
import { composeStore } from 'utils/composeStore';
import { ReferenceModal } from './modals/ReferenceModal';
import USCrimeCheckSVG from './US-crime-check';
import { useReferenceStore } from 'components/NewReferenceCheck';
import { useBillingInfo, usePostBackgroundCheckV2 } from './hooks/hooks';
import { newRequestV2Schema } from './schema/schema';
import { toast } from 'react-toastify';
import { createCandidate, updateLifeCycle } from 'apis/user.api';
import { detectBrowser, getDate, useIP, useQuestionnaires } from 'Common';
import IconButton from '@mui/material/IconButton/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CanCrimCheckSVG from './can-crim-check';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { ZodError } from 'zod';
import { EnhancedCrimCheckRed } from './enhanced-crim-check-red';
import Loading from 'components/Loading';
import { lazily } from 'react-lazily';
const { FuturePaymentBox } = lazily(() => import('./FuturePaymentBox'));

const criminalCanadianVariants = [
	'Canadian Criminal Record Check',
	'Enhanced Canadian Criminal Record Check',
] as const;

const regex = new RegExp('(canadian|us)', 'i');

export const useChecksStore = composeStore<{
	selectedChecks: Array<string>;
}>({
	name: 'selectedChecks',
	initialState: { selectedChecks: [] },
	storage: null,
});

export default function NewRequestV2() {
	const { data: billingData } = useBillingInfo();
	const emailRef = useRef<HTMLInputElement>(null);
	useQuestionnaires();
	const mutation = usePostBackgroundCheckV2();
	const [country, setCountry] = useImmer<'CA' | 'US'>('CA');
	const [modals, setModals] = useImmer<Map<string, boolean>>(new Map());
	const referenceStore = useReferenceStore();
	const { setStore, selectedChecks } = useChecksStore();
	const { data: allCheckTypes = [], status } = useCheckTypes();
	const { data: ipAddress } = useIP();

	useEffect(() => {
		emailRef.current?.focus();
	}, [status]);

	const caCrimCheck = useMemo(
		() =>
			allCheckTypes.filter(v =>
				criminalCanadianVariants.some(val => val.includes(v.name))
			),
		[allCheckTypes]
	);

	const usCrimCheck = useMemo(
		() =>
			allCheckTypes.filter(v =>
				criminalUSAVariants.some(val => val.includes(v.name))
			),
		[allCheckTypes]
	);

	const hasUSCrimCheck = usCrimCheck.length > 0;
	const hasCACrimCheck = caCrimCheck.length > 0;

	const canadianCriminalChecks = caCrimCheck.map(v => v.uuid);
	const usCriminalChecks = usCrimCheck.map(v => v.uuid);

	const checks = allCheckTypes.filter(v => {
		if (v.type == null) {
			return true;
		}
		if (v.type !== country) {
			return false;
		}
		if (
			country === 'US' &&
			criminalUSAVariants.some(val => val.includes(v.name))
		) {
			return false;
		}
		if (
			country === 'CA' &&
			criminalCanadianVariants.some(val => val === v.name)
		) {
			return false;
		}
		return true;
	});

	if (status === 'pending' || status === 'error') {
		return <Loading />;
	}

	const canadaUUID =
		allCheckTypes.find(v => v.name === 'Canadian Criminal Record Check')
			?.uuid ?? '';

	const openReferenceModal = !!modals.get('reference');
	const openUSModal = !!modals.get('criminal');
	const openCanadaModal = !!modals.get(canadaUUID);

	const UScriminalCheckUUID = selectedChecks.find(v =>
		usCriminalChecks.includes(v)
	);

	const selectedCAUUIDs = selectedChecks.filter(v =>
		canadianCriminalChecks.includes(v)
	);

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault();
		const obj = Object.fromEntries(new FormData(e.currentTarget).entries());
		try {
			//Filter the ContactsList UUIDS which are cc on...
			const on_cc_contactsUUID = referenceStore.contactsList
				.filter(contact => contact.isccresults)
				.map(contact => contact.uuid);

			const { email } = newRequestV2Schema.parse(obj);
			if (selectedChecks.includes('reference') && referenceStore.role) {
				const resp = await createCandidate({
					email,
					recruiter: referenceStore.recruiter,
					firstName: referenceStore.firstName.trim(),
					lastName: referenceStore.lastName.trim(),
					phone: referenceStore.phone,
					role: referenceStore.role,
					questionnaire: referenceStore.questionnaire,
					requestDate: referenceStore.requestDate,
					response: referenceStore.response,
					recruiterName: referenceStore.recruiter,
					recruiterTZ: Intl.DateTimeFormat().resolvedOptions().timeZone,
					min_reference: referenceStore.min_reference,
					is_sms_allow: referenceStore.is_sms_allow,
					cc_email: on_cc_contactsUUID,
				});

				const body = {
					uuid: resp.data.uuid,
					name: resp.data.recruiterName,
					userType: 'recruiter',
					date: getDate(),
					action: 'Sent request to Candidate',
					osBrowser: detectBrowser(),
					ipAddress: !!ipAddress ? ipAddress : null,
					locationISP: localStorage.getItem('cityName'),
					refereeUUID: resp.data.uuid,
				};
				await updateLifeCycle(body);
				referenceStore.setStore({
					recruiter: '',
					firstName: '',
					lastName: '',
					phone: '',
					role: '',
					questionnaire: '',
					requestDate: '',
					response: '',
					recruiterName: '',
					recruiterTZ: '',
					min_reference: 2,
					is_sms_allow: false,
					contactsList: [],
				});
				toast.success('Reference submitted successfully!');
			}

			if (!selectedChecks.filter(v => v !== 'reference').length) {
				setStore({ selectedChecks: [] });
				if (emailRef.current) {
					emailRef.current.value = '';
					console.log('hit?');
				}
				return;
			}

			let checkType = [...selectedChecks];
			if (canadianCriminalChecks.every(v => checkType.includes(v))) {
				checkType = checkType.filter(v => v !== canadaUUID);
			}
			await mutation.mutateAsync(
				{
					email,
					checkType: checkType.filter(v => v !== 'reference'),
				},
				{
					onSuccess: () => {
						toast.success('Background Checks submitted successfully!');
						setStore({ selectedChecks: [] });
						if (emailRef.current) {
							emailRef.current.value = '';
						}
					},
				}
			);
		} catch (e: any) {
			if (e instanceof ZodError) {
				toast.error(e.issues.map(v => v.message).join('/n'));
				return;
			}
			toast.error(e.message! ?? 'Something went wrong!');
		}
	};

	return (
		<Box>
			<form onSubmit={handleSubmit}>
				<TextField
					type='email'
					variant='outlined'
					label='Email'
					required
					fullWidth
					autoComplete='email'
					helperText="Enter the candidate's email address"
					name='email'
					inputRef={emailRef}
				/>
				<br />
				<br />
				<Stack
					component={Paper}
					justifyContent='center'
					alignItems='center'
					variant='outlined'
					className='px-8 py-8'
					rowGap={2}
				>
					<Stack
						direction='row'
						spacing={1}
						alignItems='center'
						className='mb-4'
					>
						<IconButton
							onClick={() => {
								if (country === 'CA') {
									return;
								}
								setCountry('CA');
							}}
						>
							<CanadaFlagSVG
								style={{
									...(country === 'US' && { filter: 'grayscale(100%)' }),
								}}
							/>
						</IconButton>
						<Switch
							checked={country === 'US'}
							onClick={() => {
								setCountry(prev => {
									return prev === 'US' ? 'CA' : 'US';
								});
								setStore({ selectedChecks: [] });
								referenceStore.setStore({
									recruiter: '',
									firstName: '',
									lastName: '',
									phone: '',
									role: '',
									questionnaire: '',
									requestDate: '',
									response: '',
									recruiterName: '',
									recruiterTZ: '',
									min_reference: 2,
									is_sms_allow: false,
								});
							}}
							sx={{
								'.MuiSwitch-thumb': {
									background: 'grey !important',
								},
								'.MuiSwitch-track': {
									background: 'grey !important',
								},
							}}
						/>
						<IconButton
							onClick={() => {
								if (country === 'US') {
									return;
								}
								setCountry('US');
							}}
						>
							<USAFlagSVG
								color='primary'
								style={{
									...(country === 'CA' && { filter: 'grayscale(100%)' }),
								}}
							/>
						</IconButton>
					</Stack>

					<Stack
						direction='row'
						gap={8}
						justifyContent='center'
						alignItems='center'
						flexWrap='wrap'
					>
						<Stack
							role='button'
							aria-label='reference'
							component={Paper}
							variant='outlined'
							justifyContent='center'
							alignItems='center'
							rowGap={3}
							className={clsx(
								'relative h-[200px] w-[200px] cursor-pointer rounded-[25px] hover:border-credibledOrange',
								selectedChecks.includes('reference') &&
									'border-2 border-[#ed642b]'
							)}
							onClick={() => {
								setModals(modalDraft => {
									modalDraft.set('reference', true);
								});
							}}
							sx={theme => {
								return {
									'&:hover, &:active, &:focus': {
										'& p': {
											color: `${theme.palette.primary.main} !important`,
										},
										'& path': {
											fill: '#ed642b !important',
										},
									},
									...(selectedChecks.includes('reference') && {
										'& p': {
											color: `${theme.palette.primary.main} !important`,
										},
										'& path': {
											fill: '#ed642b !important',
										},
									}),
								};
							}}
						>
							<Tooltip
								title='Digital Reference Checks: Featuring Lead Generation, Fraud Detection, and Customizable Questionnaires.'
								className='absolute right-2 top-8'
							>
								<i className='material-icons icon_info text-secondary'>info</i>
							</Tooltip>
							<ReferenceSVG />
							<Typography
								textTransform='capitalize'
								textAlign='center'
								className='text-black'
							>
								Reference
							</Typography>
						</Stack>

						{country === 'CA' && hasCACrimCheck && (
							<Stack
								role='button'
								aria-label='Canadian Criminal Check'
								component={Paper}
								variant='outlined'
								justifyContent='center'
								alignItems='center'
								rowGap={3}
								className={clsx(
									'relative h-[200px] w-[200px] cursor-pointer rounded-[25px] hover:border-credibledOrange',
									selectedCAUUIDs.length && 'border-2 border-[#ed642b]'
								)}
								onClick={() => {
									if (selectedCAUUIDs.length) {
										setStore({
											selectedChecks: selectedChecks.filter(
												v => !selectedCAUUIDs.includes(v)
											),
										});
									} else {
										setStore({
											selectedChecks: [...selectedChecks, canadaUUID],
										});
										setModals(modalDraft => {
											modalDraft.set(canadaUUID, true);
										});
									}
								}}
								sx={theme => {
									return {
										'&:hover, &:active, &:focus': {
											'& p': {
												color: `${theme.palette.primary.main} !important`,
											},
											'& path.canadian-crim-check': {
												fill: '#ed642b !important',
											},
										},
										...(selectedCAUUIDs.length && {
											'& p': {
												color: `${theme.palette.primary.main} !important`,
											},
											'& path.canadian-crim-check': {
												fill: '#ed642b !important',
											},
										}),
									};
								}}
							>
								<Tooltip
									title={caCrimCheck.at(0)?.description}
									className='absolute right-2 top-8'
								>
									<i className='material-icons icon_info text-secondary'>
										info
									</i>
								</Tooltip>
								{selectedCAUUIDs.length === 2 ? (
									<EnhancedCrimCheckRed />
								) : (
									<CanCrimCheckSVG />
								)}
								<Typography
									textTransform='capitalize'
									textAlign='center'
									className='text-black'
								>
									Criminal Check
								</Typography>
							</Stack>
						)}

						{country === 'US' && hasUSCrimCheck && (
							<Stack
								role='button'
								aria-label='reference'
								component={Paper}
								variant='outlined'
								justifyContent='center'
								alignItems='center'
								rowGap={3}
								className={clsx(
									'relative h-[200px] w-[200px] cursor-pointer rounded-[25px] hover:border-credibledOrange',
									UScriminalCheckUUID && 'border-2 border-[#ed642b]'
								)}
								onClick={() => {
									if (UScriminalCheckUUID) {
										setStore({
											selectedChecks: selectedChecks.filter(
												v => v !== UScriminalCheckUUID
											),
										});
									} else {
										setModals(modalDraft => {
											modalDraft.set('criminal', true);
										});
									}
								}}
								sx={theme => {
									return {
										'&:hover, &:active, &:focus': {
											'& p': {
												color: `${theme.palette.primary.main} !important`,
											},
											'& path': {
												fill: '#ed642b !important',
											},
										},
										...(UScriminalCheckUUID && {
											'& p': {
												color: `${theme.palette.primary.main} !important`,
											},
											'& path': {
												fill: '#ed642b !important',
											},
										}),
									};
								}}
							>
								<Tooltip
									title={usCrimCheck.at(0)?.description}
									className='absolute right-2 top-8'
								>
									<i className='material-icons icon_info text-secondary'>
										info
									</i>
								</Tooltip>
								<USCrimeCheckSVG />
								<Typography
									textTransform='capitalize'
									textAlign='center'
									className='text-black'
								>
									Criminal Check
								</Typography>
							</Stack>
						)}

						{checks.map(v => {
							const icon = getScanTypeIcon(v.name);
							const isChecked = selectedChecks.includes(v.uuid);
							const name = v.name.replace(regex, '').trim();
							const content = v.description;
							return (
								<Stack
									key={v.uuid}
									component={Paper}
									role='button'
									variant='outlined'
									justifyContent='center'
									alignItems='center'
									rowGap={3}
									className={clsx(
										'relative h-[200px] w-[200px] cursor-pointer rounded-[25px] p-2 hover:border-credibledOrange',
										isChecked && 'border-2 border-[#ed642b]'
									)}
									sx={theme => ({
										'&:hover, &:active, &:focus': {
											'& p': {
												color: `${theme.palette.primary.main} !important`,
											},
											'& path': {
												fill: '#ed642b !important',
											},
										},
										...(isChecked && {
											'& p': {
												color: `${theme.palette.primary.main} !important`,
											},
											'& path': {
												fill: '#ed642b !important',
											},
										}),
									})}
									onClick={() => {
										if (selectedChecks.includes(v.uuid)) {
											setStore({
												selectedChecks: selectedChecks.filter(
													val => val !== v.uuid
												),
											});
										} else {
											setModals(modalDraft => {
												modalDraft.set(v.uuid, true);
											});
											if (
												name === 'Base Criminal' ||
												name === 'Criminal Record Check'
											) {
												return;
											}
											setStore({ selectedChecks: [...selectedChecks, v.uuid] });
										}
									}}
								>
									<Tooltip
										title={content}
										className='absolute right-2 top-8'
									>
										<i className='material-icons icon_info text-secondary'>
											info
										</i>
									</Tooltip>
									<Box>{icon}</Box>
									<Typography
										textTransform='capitalize'
										textAlign='center'
										className='p-2 text-black'
									>
										{name}
									</Typography>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				{billingData?.data.Customer ? (
					<Box className='mx-auto my-4 text-center'>
						<Button
							type='submit'
							variant='contained'
							color='secondary'
						>
							Send Request
						</Button>
					</Box>
				) : (
					<Suspense fallback={<Loading />}>
						<FuturePaymentBox />
					</Suspense>
				)}
			</form>
			<ReferenceModal
				open={openReferenceModal}
				uuid='reference'
				handleClose={setModals}
			/>
			{openUSModal && (
				<USModal
					open={openUSModal}
					uuid='criminal'
					handleClose={setModals}
				/>
			)}
			{openCanadaModal && (
				<CanadianModal
					open={openCanadaModal}
					uuid={canadaUUID}
					handleClose={setModals}
				/>
			)}
		</Box>
	);
}
