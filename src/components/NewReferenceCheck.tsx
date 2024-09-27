import '../assets/css/customNewReferenceCheck.css';
import { CustomToolTip } from './CustomToolTip';
import { Menu, IconButton, Badge } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { contactsGetAPI } from '../apis';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import Typography from '@mui/material/Typography/Typography';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useQuestionnaires } from '../Common';
import { getUserFlags } from '../apis';
import { AlertComponent, PhoneInput, PrettoSlider } from '.';
import { Autocomplete, Button, Stack, TextField } from '@mui/material';
import { GroupHeader, GroupItems } from './Group';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useFlagStore } from 'apis/auth.api';
import { composeStore } from 'utils/composeStore';
import { useChecksStore } from 'pages/user/new-request-v2/NewRequestV2';
import GenericModal from './GenericModal';
import { useImmer } from 'use-immer';
import { toast } from 'react-toastify';

// Typescript Types...
type Contact = {
	uuid: string;
	createdAt: string;
	created_at?: string;
	name: string;
	title: string;
	email: string;
	isccresults?: boolean;
	cc_on_results?: boolean;
};
type ContactsList = Contact[];
type InitialState = {
	recruiter: string;
	firstName: string;
	lastName: string;
	phone: string;
	role: string;
	questionnaire: string;
	requestDate: string;
	response: string;
	recruiterName: string;
	recruiterTZ: string;
	min_reference: number;
	is_sms_allow: boolean;
	contactsList: ContactsList;
};

export const useReferenceStore = composeStore<InitialState>({
	name: 'reference',
	initialState: {
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
	},
});

const SPECIAL_REGEX = /[*|":<>[\]{}`\\()';@&$%!#^_+=]/;
const SPECIAL_REGEX_NAME = /[0-9^`~!@#$%^&*()+=_}{"':?><|,./;|\]\\"["]/;

export default function NewReferenceCheck({
	closeModal,
	cancel,
}: {
	closeModal: () => void;
	cancel: () => void;
}) {
	// Navigate to another page + Send data to that page | State...
	const navigate = useNavigate();

	const [open, setOpen] = useImmer<boolean>(false);
	const checksStore = useChecksStore();
	const { setStore, ...store } = useReferenceStore();
	const [firstName, setFirstName] = useState(store.firstName);
	const [lastName, setLastName] = useState(store.lastName);
	const [phone, setPhone] = useState(store.phone);
	const [role, setRole] = useState(store.role);
	const [minReference, setMinReference] = useState(store.min_reference);
	const [questionnaire, setQuestionnaire] = useState(store.questionnaire);
	const [sendRequestStatus, setSendRequestStatus] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const response = 'requested';
	const { data } = useQuestionnaires();
	const [is_flag, setIsFlag] = useState(false);
	const [is_sms_allow, setIsSmsAllow] = useState(store.is_sms_allow);
	const [clientSmsAllow, setClientSmsAllow] = useState();

	const [isContactsList, SetIsContactsList] = useState<boolean>(false);
	const [contactsList, setContactsList] = useState<ContactsList>(() => []);
	const [ccresultsEnabledCount, setCcresultsEnabledCount] = useState<number>(0);
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	useEffect(() => {
		const fetchUserFlags = async () => {
			try {
				let flags = useFlagStore.getState().flags_allowed;

				if (flags.length === 0) {
					const resp = await getUserFlags();
					const flagResp = resp.data.flags;

					useFlagStore.setState({ flags_allowed: flagResp });
					flags = useFlagStore.getState().flags_allowed;
				}

				const is_Flag_available: boolean = flags.includes('Min Reference');
				setIsFlag(is_Flag_available);
			} catch (error) {
				console.error('Error fetching or updating flags:', error);
			}
		};

		fetchUserFlags();

		let smsFlag: any = localStorage.getItem('is_sms_allow')
			? localStorage.getItem('is_sms_allow')
			: false;
		setClientSmsAllow(smsFlag);
	}, [setClientSmsAllow, clientSmsAllow]);
	const questionnaires = data?.flatMap(val => (val.is_archived ? [] : val));
	const questionnaireOptions = questionnaires
		?.map(val => ({
			id: val.uuid,
			label: val.questionnaire_title,
			category: val.is_client_created
				? 'Corporate Questionnaires'
				: 'My Questionnaires',
		}))
		.sort(v => (v.category === 'Corporate Questionnaires' ? -1 : 1));

	const handlePhoneNumberChange = (value: string) => {
		document.getElementById('phone-field')!.classList.remove('error-field');
		const currentPhoneNumberLength = value
			?.split?.(' ')
			?.slice?.(1)
			?.join('')?.length;
		if (currentPhoneNumberLength && currentPhoneNumberLength > 10) return;
		return setPhone(value);
	};

	const createRequest = async () => {
		if (isSubmitting) return;
		let text = firstName + lastName;
		const patternNum = /[0-9]/;
		let patternOthers = /[A-Za-z]/;

		let result = patternNum.test(text);
		let result2 = patternOthers.test(text);
		if (result === true) {
			const x = document.getElementById('numberError')!;
			x.style.display = 'block';
			document.getElementById('first-name-field')!.classList.add('error-field');
			return false;
		}
		if (result2 === false) {
			const x = document.getElementById('emptySpaces')!;
			x.style.display = 'block';
			document.getElementById('first-name-field')!.classList.add('error-field');
			return false;
		}

		if (questionnaire === '') {
			const x = document.getElementById('questionnaireError')!;
			x.style.display = 'block';
			document
				.getElementById('select-questionnaire')!
				.classList.add('error-field');
			return false;
		}

		if (role === '' || role.trim().length < 4) {
			const x = document.getElementById('roleError')!;
			x.style.display = 'block';
			document.getElementById('job-title-field')!.classList.add('error-field');
			return false;
		}

		if (role.trim().length <= 3) {
			const x = document.getElementById('roleError')!;
			x.style.display = 'block';
			document.getElementById('job-title-field')!.classList.add('error-field');
			return false;
		}

		if (firstName === '') {
			const x = document.getElementById('firstNameError')!;
			x.style.display = 'block';
			document.getElementById('first-name-field')!.classList.add('error-field');
			return false;
		}
		if (lastName === '') {
			const x = document.getElementById('lastNameError')!;
			x.style.display = 'block';
			document.getElementById('last-name-field')!.classList.add('error-field');
			return false;
		}
		if (phone.trim().length <= 0 && /[0-9]{4}/.test(phone) === false) {
			const x = document.getElementById('phoneError')!;
			x.style.display = 'block';
			document.getElementById('phone-field')!.classList.add('error-field');
			return false;
		}
		let PhoneNumber = phone;
		if (
			/[(][0]{3}[)][" "][0]{3}[-][0]{4}/.test(PhoneNumber) ||
			/[(][1]{3}[)][" "][1]{3}[-][1]{4}/.test(PhoneNumber) ||
			/[(][2]{3}[)][" "][2]{3}[-][2]{4}/.test(PhoneNumber) ||
			/[(][3]{3}[)][" "][3]{3}[-][3]{4}/.test(PhoneNumber) ||
			/[(][4]{3}[)][" "][4]{3}[-][4]{4}/.test(PhoneNumber) ||
			/[(][5]{3}[)][" "][5]{3}[-][5]{4}/.test(PhoneNumber) ||
			/[(][6]{3}[)][" "][6]{3}[-][6]{4}/.test(PhoneNumber) ||
			/[(][7]{3}[)][" "][7]{3}[-][7]{4}/.test(PhoneNumber) ||
			/[(][8]{3}[)][" "][8]{3}[-][8]{4}/.test(PhoneNumber) ||
			/[(][9]{3}[)][" "][9]{3}[-][9]{4}/.test(PhoneNumber)
		) {
			const x = document.getElementById('phoneErrorInvalid')!;
			x.style.display = 'block';
			document.getElementById('phone-field')!.classList.add('error-field');
			return false;
		}

		const recruiter = localStorage.getItem('creduser')!;
		const d = new Date();
		const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
		const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
		const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
		const requestDate = year + '-' + month + '-' + day;
		setIsSubmitting(true);

		setStore({
			recruiter: recruiter,
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			phone: phone,
			role: role,
			questionnaire: questionnaire,
			requestDate: requestDate,
			response: response,
			recruiterName: recruiter,
			recruiterTZ: Intl.DateTimeFormat().resolvedOptions().timeZone,
			min_reference: minReference,
			is_sms_allow: is_sms_allow,
			contactsList: contactsList,
		});
		checksStore.setStore({
			selectedChecks: [
				...new Set([...checksStore.selectedChecks, 'reference']),
			],
		});
		closeModal();
	};

	const handleChangeSMSToggle = (event: any) => {
		setIsSmsAllow(event.target.checked);
	};

	/* Share Results... */
	// Get contacts card data from apis...
	useEffect(() => {
		(async () => {
			try {
				isContactsList && SetIsContactsList(false);

				// Get Request...
				const getAPI = await contactsGetAPI();
				if (getAPI.status !== 200) {
					toast.error('Pls, Try again later API error!');
					return;
				}
				const getAPIData =
					store.contactsList.length > 0
						? store.contactsList
						: getAPI.data.results;

				// Display Contacts...
				setContactsList([]);
				if (store.contactsList.length === 0) {
					setContactsList((prevContactsList: ContactsList) => {
						const contacts = [
							...prevContactsList,
							...getAPIData.map((getAPIData: Contact) => ({
								uuid: getAPIData.uuid,
								createdAt: getAPIData.created_at,
								name: getAPIData.name,
								title: getAPIData.title,
								email: getAPIData.email,
								isccresults: getAPIData.cc_on_results,
							})),
						].sort(
							(a, b) =>
								new Date(a.createdAt).getTime() -
								new Date(b.createdAt).getTime()
						);

						// Count CC which are enabled...
						setCcresultsEnabledCount(0);
						setCcresultsEnabledCount(
							contacts.reduce((count: number, contact: Contact) => {
								return contact.isccresults ? count + 1 : count;
							}, 0)
						);
						return contacts;
					});
				} else {
					setContactsList((prevContactsList: ContactsList) => {
						const contacts = [
							...prevContactsList,
							...getAPIData.map((getAPIData: Contact) => ({
								uuid: getAPIData.uuid,
								createdAt: getAPIData.created_at,
								name: getAPIData.name,
								title: getAPIData.title,
								email: getAPIData.email,
								isccresults: getAPIData.isccresults,
							})),
						].sort(
							(a, b) =>
								new Date(a.createdAt).getTime() -
								new Date(b.createdAt).getTime()
						);

						// Count CC which are enabled...
						setCcresultsEnabledCount(0);
						setCcresultsEnabledCount(
							contacts.reduce((count: number, contact: Contact) => {
								return contact.isccresults ? count + 1 : count;
							}, 0)
						);
						return contacts;
					});
				}
				SetIsContactsList(true);
			} catch (e) {
				toast.error('Pls, Try again later API error!');
			}
		})();
	}, []);

	const shareResultsBtn = (
		close: boolean,
		e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
	): void => {
		if (!isContactsList) return;

		if (close) {
			setAnchorEl(null);
			return;
		}

		if (e && typeof e.preventDefault === 'function') {
			e.preventDefault();
			setAnchorEl(e.currentTarget);
		}
	};

	const shareResultsNoItemBtn = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	): void => {
		e.preventDefault();
		if (!isContactsList) return;
		navigate('/home/settings', { state: { isOpenAddContact: true } });
	};

	const shareResultsMenuBtn = (
		data: Contact,
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	): void => {
		if (!isContactsList) {
			toast.error('Pls, Try again later API error!');
			return;
		}

		setContactsList((prevContactsList: ContactsList) => {
			const contacts = prevContactsList.map((contact: Contact) => {
				return contact.uuid === data.uuid
					? { ...contact, isccresults: !data.isccresults }
					: contact;
			});

			// Count CC which are enabled...
			setCcresultsEnabledCount(0);
			setCcresultsEnabledCount(
				contacts.reduce((count: number, contact: Contact) => {
					return contact.isccresults ? count + 1 : count;
				}, 0)
			);

			return contacts;
		});
	};

	return (
		<>
			<AlertComponent
				{...sendRequestStatus}
				closeAlert={() => setSendRequestStatus({ openProp: false })}
			/>
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-md-12 px-0'>
						<div style={{ marginBottom: '0' }}>
							<div className='row'>
								<div className='col-md-5 card-box'>
									<div className='row'>
										<div className='col-md-12'>
											<h4>
												Job Title
												<CustomToolTip
													className=''
													content={
														'This information will be displayed on the request summary page of the candidate.'
													}
												/>{' '}
												{/* <Tooltip
													className='tooltip-mobile'
													placement='top'
													title='This information will be displayed on the request summary page of the candidate.'
												>
													<InfoIcon
														style={{
															color: '#ED642A',
															position: 'absolute',
															cursor: 'pointer',
														}}
													/>
												</Tooltip> */}
											</h4>
											<div className='form-group'>
												<label className='bmd-label-floating'>
													Job Title
													<span className='sup_char'>
														<sup>*</sup>
													</span>
												</label>
												<input
													id='job-title-field'
													tabIndex={0}
													type='text'
													value={role}
													onChange={evt => {
														if (!SPECIAL_REGEX.test(evt.target.value)) {
															setRole(evt.target.value);
															const x = document.getElementById('roleError');
															x!.style.display = 'none';
															document
																.getElementById('job-title-field')!
																.classList.remove('error-field');
														}
													}}
													className='form-control'
													maxLength={50}
												/>
												<div
													className='notes'
													id='roleError'
													style={{ display: `none` }}
												>
													Please add a job title that is at least 4 characters
													long
												</div>
											</div>

											<h4>
												Questionnaire{''}
												<CustomToolTip
													className=''
													content={
														'This is the reference template you will use. Each questionnaire has a predefined set of questions. By default, your candidate will be required to submit details of their referees to complete the questionnaire.'
													}
												/>{' '}
												{/* <Tooltip
													className='tooltip-mobile'
													placement='top'
													title='This is the reference template you will use. Each questionnaire has a predefined set of questions. By default, your candidate will be required to submit details of their referees to complete the questionnaire.'
												>
													<InfoIcon
														style={{
															color: '#ED642A',
															position: 'absolute',
															cursor: 'pointer',
														}}
													/>
												</Tooltip> */}
											</h4>
											<div className='mt-4'>
												{is_flag ? (
													<Grid
														container
														spacing={2}
													>
														<Grid
															item
															xs={8}
														>
															<Autocomplete
																onChange={(_e, newValue) => {
																	setQuestionnaire(newValue!.id);
																}}
																size='small'
																options={questionnaireOptions!}
																groupBy={questionnaireOptions =>
																	questionnaireOptions.category
																}
																value={questionnaireOptions?.find(
																	v => v.id === questionnaire
																)}
																renderInput={params => {
																	return (
																		<TextField
																			{...params}
																			label='Select Questionnaire'
																			variant='standard'
																			sx={{
																				'& ::before': {
																					borderBottom: '1px solid #d2d2d2',
																				},
																			}}
																		/>
																	);
																}}
																renderGroup={params => (
																	<li key={params.key}>
																		<GroupHeader>{params.group}</GroupHeader>
																		<GroupItems>{params.children}</GroupItems>
																	</li>
																)}
															/>
														</Grid>
														<Grid
															item
															xs={4}
															className='relative top-[-3px]'
														>
															<FormControl
																fullWidth
																variant='standard'
																sx={{
																	'& ::before': {
																		borderBottom: '1px solid #d2d2d2',
																	},
																}}
															>
																<InputLabel id='demo-simple-select-label'>
																	Min Reference
																</InputLabel>
																<Select
																	labelId='demo-simple-select-label'
																	id='demo-simple-select'
																	value={minReference}
																	label='Min References'
																	onChange={evt => {
																		setMinReference(Number(evt.target.value));
																	}}
																>
																	<MenuItem value={1}>1</MenuItem>
																	<MenuItem value={2}>2</MenuItem>
																	<MenuItem value={3}>3</MenuItem>
																	<MenuItem value={4}>4</MenuItem>
																	<MenuItem value={5}>5</MenuItem>
																	<MenuItem value={6}>6</MenuItem>
																</Select>
															</FormControl>
														</Grid>
													</Grid>
												) : (
													<Autocomplete
														onChange={(_e, newValue) => {
															setQuestionnaire(newValue!.id);
														}}
														options={questionnaireOptions!}
														groupBy={questionnaireOptions =>
															questionnaireOptions.category
														}
														renderInput={params => {
															return (
																<TextField
																	{...params}
																	label='Select Questionnaire'
																	variant='outlined'
																	sx={{
																		'& .MuiOutlinedInput-root': {
																			'& fieldset': {
																				borderColor: 'white',
																			},
																			'&:hover fieldset': {
																				borderColor: 'white',
																			},
																			'&.Mui-focused fieldset': {
																				borderColor: 'yellow',
																			},
																		},
																	}}
																/>
															);
														}}
														renderGroup={params => (
															<li key={params.key}>
																<GroupHeader>{params.group}</GroupHeader>
																<GroupItems>{params.children}</GroupItems>
															</li>
														)}
													/>
												)}

												<div className='notes'>
													{!is_flag ? 'Minimum references: 2' : ''}
													<br />
													{questionnaire && (
														<span className='txt_primary'>Questionnaire: </span>
													)}
													<Button
														onClick={e => {
															setOpen(true);
														}}
														color='info'
													>
														{
															questionnaires?.find(
																val => val.uuid === questionnaire
															)?.questionnaire_title
														}
													</Button>
												</div>
												<GenericModal
													open={open}
													handleClose={() => {
														setOpen(false);
													}}
													className='max-h-[100%] w-full overflow-y-auto rounded-none md:max-h-[80%] md:w-[50%]'
												>
													<h5>Questionnaire</h5>
													<ul id='questionnaire'>
														<div>
															<table className='quest'>
																<tbody>
																	{data
																		?.find(val => val.uuid === questionnaire)
																		?.questionList?.map((val, i) => (
																			<tr key={val.uuid}>
																				<td>{i + 1}.</td>
																				<td>
																					<Typography
																						variant='body2'
																						component='section'
																						className='question text-align-justify'
																						sx={{
																							lineHeight: '200%',
																						}}
																					>
																						{val.question}
																					</Typography>
																					{val.rateFlag && (
																						<div
																							style={{
																								marginBottom: '1rem',
																							}}
																						>
																							<div>
																								<div className='range-slider flex'>
																									<span className='range-slider__value mr-6'>
																										0
																									</span>
																									<PrettoSlider
																										valueLabelDisplay='auto'
																										aria-label='pretto slider'
																										step={1}
																										marks
																										min={0}
																										max={5}
																										value={0}
																										defaultValue={0}
																									/>
																								</div>
																							</div>
																						</div>
																					)}
																				</td>
																			</tr>
																		))}
																</tbody>
															</table>
														</div>
													</ul>
													<Box className='text-center'>
														<button
															type='button'
															className='btn btn-secondary-outline'
															data-dismiss='modal'
															onClick={() => {
																setOpen(false);
															}}
														>
															Close
														</button>
													</Box>
												</GenericModal>
												<div
													className='notes'
													id='questionnaireError'
													style={{ display: `none` }}
												>
													Questionnaire is required
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className='col-md-7 card-box'>
									<h4>
										{' '}
										Candidate Details{''}
										<CustomToolTip
											className=''
											content={
												'These details are used to communicate with the candidate so please make sure they are up to date and correct.'
											}
										/>{' '}
										{/* <Tooltip
											className='tooltip-mobile'
											placement='top'
											title='These details are used to communicate with the candidate so please make sure they are up to date and correct.'
										>
											<InfoIcon
												style={{
													color: '#ED642A',
													position: 'absolute',
													cursor: 'pointer',
												}}
											/>
										</Tooltip> */}
									</h4>
									<div className='row'>
										<div className='col-md-6'>
											<div className='form-group'>
												<label className='bmd-label-floating'>
													First Name
													<span className='sup_char'>
														<sup>*</sup>
													</span>
												</label>
												<input
													id='first-name-field'
													tabIndex={0}
													type='text'
													value={firstName}
													onChange={evt => {
														if (!SPECIAL_REGEX_NAME.test(evt.target.value)) {
															setFirstName(evt.target.value);
															const x = document.getElementById(
																'firstNameErrorInvalid'
															);
															document
																.getElementById('first-name-field')!
																.classList.remove('error-field');
															x!.style.display = 'none';
														} else {
															const x = document.getElementById(
																'firstNameErrorInvalid'
															);
															x!.style.display = 'block';
														}
													}}
													className='form-control'
													maxLength={35}
												/>
												<div
													className='notes'
													id='firstNameError'
													style={{ display: `none` }}
												>
													First Name is required
												</div>
												<div
													className='notes'
													id='firstNameErrorInvalid'
													style={{ display: `none` }}
												>
													Special characters/numbers not allowed
												</div>
												<div
													className='notes'
													id='lengthError'
													style={{ display: `none` }}
												>
													Name error
												</div>
												<div
													className='notes'
													id='numberError'
													style={{ display: `none` }}
												>
													Please dont use number in names
												</div>
												<div
													className='notes'
													id='emptySpaces'
													style={{ display: `none` }}
												>
													Please dont use empty Spaces/blanks in names
												</div>
											</div>
										</div>
										<div className='col-md-6'>
											<div className='form-group'>
												<label className='bmd-label-floating'>
													Last Name
													<span className='sup_char'>
														<sup>*</sup>
													</span>
												</label>
												<input
													id='last-name-field'
													tabIndex={0}
													type='text'
													value={lastName}
													onChange={evt => {
														if (!SPECIAL_REGEX_NAME.test(evt.target.value)) {
															setLastName(evt.target.value);
															const x = document.getElementById(
																'lastNameErrorInvalid'
															);
															document
																.getElementById('last-name-field')!
																.classList.remove('error-field');
															x!.style.display = 'none';
														} else {
															const x = document.getElementById(
																'lastNameErrorInvalid'
															);
															x!.style.display = 'block';
														}
													}}
													className='form-control'
													maxLength={35}
												/>
												<div
													className='notes'
													id='lastNameError'
													style={{ display: `none` }}
												>
													Last Name is required
												</div>
												<div
													className='notes'
													id='lastNameErrorInvalid'
													style={{ display: `none` }}
												>
													Special characters/numbers not allowed
												</div>
											</div>
										</div>
										<div className='col-md-6'>
											<div className='mt-[1.6rem]'>
												<PhoneInput
													{...{
														phoneNumber: phone,
														handlePhoneNumberChange,
														defaultCountry: 'Canada',
													}}
												/>
												<div
													className='notes'
													id='phoneError'
													style={{ display: `none` }}
												>
													Phone# is required
												</div>
												<div
													className='notes'
													id='phoneErrorInvalid'
													style={{ display: `none` }}
												>
													Phone number is invalid
												</div>
											</div>
										</div>
										<div className='col-md-6'>
											{clientSmsAllow === 'True' ? (
												<Box
													display='flex'
													alignItems='center'
													// gap={1}
													flexWrap='nowrap'
													className='relative top-4'
												>
													<div className='sendSMSSection-Row'>
														<div className='sendSMSTitle-Row'>
															<span className='shrink-1 grow'>
																Send via SMS
															</span>
															<CustomToolTip
																className=''
																content={
																	'Enable to send an SMS reference request alongside the email.'
																}
															/>{' '}
														</div>
														{/* <span className='shrink-0 grow'>Send via SMS</span> */}
														{/* <Tooltip
															className='tooltip-mobile'
															placement='top'
															title='Enable to send an SMS reference request alongside the email.'
														>
															<InfoIcon
																style={{
																	color: '#ED642A',
																	cursor: 'pointer',
																}}
															/>
														</Tooltip> */}

														<FormControlLabel
															control={
																<Switch
																	checked={is_sms_allow}
																	onChange={handleChangeSMSToggle}
																	color='primary'
																	inputProps={{ 'aria-label': 'controlled' }}
																/>
															}
															label=''
															style={{ marginLeft: 0 }}
														/>
													</div>
												</Box>
											) : null}
										</div>

										{/* Share Results */}
										<div className='ShareResults-Row'>
											<span>
												Share Results
												<CustomToolTip
													className=''
													content={
														'Contacts will allow you to include others involved in the hiring process and CC them on reference check results.'
													}
												/>{' '}
											</span>

											{/* Drop Down & Menu System | Share Results... */}
											<IconButton
												className='SRDropDownBtn'
												onClick={e => shareResultsBtn(false, e)}
											>
												<PersonIcon />
												<ArrowDropDownIcon className='SRDropDownArrow' />
												<Badge
													className='SRDropDownBage'
													badgeContent={ccresultsEnabledCount}
													color='secondary'
												/>
											</IconButton>
											<Menu
												className='SRDropDownMenu'
												anchorEl={anchorEl}
												open={Boolean(anchorEl)}
												onClose={() => shareResultsBtn(true)}
											>
												{/* Display, If no Contacts List cards... */}
												{contactsList.length !== 0 ? (
													''
												) : (
													<div className='SRDropDownNoItems-Col'>
														<span className='SRDDNoItemInfo'>
															No contacts have been created
														</span>
														<button
															className='SRDDNoItemBtn'
															onClick={e => shareResultsNoItemBtn(e)}
														>
															Add a contact
														</button>
													</div>
												)}

												{/* Display Contacts list cards... */}
												{contactsList.map((data: Contact) => (
													<MenuItem
														className='SRDropDownItems-Col'
														key={data.uuid}
													>
														<div
															className={`SRDropDownCCards${data.isccresults ? 'SRDropDownCCardsSelected' : ''}`}
															onClick={e => shareResultsMenuBtn(data, e)}
														>
															<h4>{data.name}</h4>
															<div>
																<span>{data.title}</span>
															</div>
															<div>
																<span>{data.email}</span>
															</div>
														</div>
													</MenuItem>
												))}
											</Menu>
										</div>
									</div>
								</div>
							</div>
							<Stack
								direction='row'
								alignItems='center'
								justifyContent='center'
								className='mt-8'
								columnGap={2}
							>
								<Button
									type='button'
									onClick={createRequest}
									disabled={isSubmitting}
									variant='contained'
									size='large'
									color='secondary'
								>
									Save
								</Button>
								{store.role && (
									<Button
										type='button'
										variant='text'
										size='large'
										color='error'
										onClick={() => {
											cancel();
											closeModal();
										}}
									>
										Cancel
									</Button>
								)}
							</Stack>
						</div>

						<div
							className='card-plain new_block'
							id='show-list'
							style={{ display: `none` }}
						>
							<div className='row'>
								<div className='col-md-3 info-box'>
									<div className='actions'>
										<a
											className='open-icon'
											data-toggle='modal'
											data-target='#editInfo'
											href='#!'
										>
											<i className='fa fa-pencil-square-o'></i>
										</a>
										&nbsp;
										<a
											className='open-icon'
											id='del-list'
											href='#!'
										>
											<i className='fa fa-trash'></i>
										</a>
									</div>
									<h6 className='fw3 text-primary'>
										<br />
										<span className='text-secondary font-sm'></span>
									</h6>
									<span className='font-sm'>
										<br />
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
