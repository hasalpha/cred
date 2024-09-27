import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider as LocalizaitonProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { addJobHistory } from '../apis';
import logo from '../assets/img/credibled_logo_205x45.png';
import { useIP, useJobData, useJobHistory } from '../Common';
import PhoneInput from './PhoneNumberInput';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker/MobileDatePicker';

export const EMAIL_REGEX =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const SPECIAL_REGEX_NAME = /[0-9^`~!@#$%^&*()+=_}{"':?><|,./;|\]\\"["]/;
export const SPECIAL_REGEX_ORG = /[`~!@#$%^()+=_}{":?><|/;|\]\\"["]/;
export const SPECIAL_REGEX_JOB = /[`~!@#$%^=_}{"':?><|;|\]\\"["]/;

function JobInformation() {
	const navigate = useNavigate();
	const params = useParams() as { name: string; id: string };
	const alreadyUsedEmailRef = useRef<HTMLDivElement | null>(null);
	const [employmentType, setEmploymentType] = useState('');
	const [organization, setOrganization] = useState('');
	const [startDate, setStartDate] = useState<any>('');
	const [endDate, setEndDate] = useState<any>('');
	const [currentlyWorkingHere, setCurrentlyWorkingHere] = useState('false');
	const [refereeFirstName, setRefereeFirstName] = useState('');
	const [refereeLastName, setRefereeLastName] = useState('');
	const [refereeEmail, setRefereeEmail] = useState('');
	const [refereePhone, setRefereePhone] = useState('');
	const [refereeJobTitle, setRefereeJobTitle] = useState('');
	const [candidateRole, setCandidateRole] = useState('');
	const { data: ipAddress } = useIP();
	const { refetch } = useJobData();
	const { data: jobhistory = [] } = useJobHistory();
	const refereeEmails = jobhistory?.map(val => val.refereeEmail);

	const handlePhoneNumberChange = (value: string) => {
		document.getElementById('phone-field')?.classList.remove('error-field');
		const currentPhoneNumberLength = value
			?.split?.(' ')
			?.slice?.(1)
			?.join('')?.length;
		if (currentPhoneNumberLength && currentPhoneNumberLength > 10) return;
		return setRefereePhone(value);
	};

	const checkBoxChange = () => {
		if (
			(document.getElementById(
				'checkBox_CurrentlyWorkHere'
			) as HTMLInputElement)!.checked === true
		) {
			setEndDate('');
			setCurrentlyWorkingHere('true');
			const y = document.getElementById('endDateError')!;
			y.style.display = 'none';
		} else {
			setCurrentlyWorkingHere('false');
		}
	};

	const saveClicked = async () => {
		if (employmentType === '') {
			const x = document.getElementById('employmentTypeError')!;
			x.style.display = 'block';
			x.focus();
			document
				.getElementById('select-employment')
				?.classList.add('error-field');
			return false;
		}
		if (organization === '' || organization.length < 2) {
			const x = document.getElementById('organizationError')!;
			x.style.display = 'block';
			x.focus();
			document
				.getElementById('organization-field')
				?.classList.add('error-field');
			return false;
		}
		if (startDate === '' || startDate === null) {
			const x = document.getElementById('startDateError')!;
			x.style.display = 'block';
			return false;
		}
		if (
			(endDate === '' || endDate === null) &&
			currentlyWorkingHere === 'false'
		) {
			const x = document.getElementById('endDateError')!;
			x.style.display = 'block';
			return false;
		}
		if (refereeFirstName === '') {
			const x = document.getElementById('refereeFirstNameError')!;
			document.getElementById('first-name-field')?.classList.add('error-field');
			x.style.display = 'block';
			return false;
		}
		if (refereeLastName === '') {
			const x = document.getElementById('refereeLastNameError')!;
			document.getElementById('last-name-field')?.classList.add('error-field');
			x.style.display = 'block';
			return false;
		}
		if (refereeEmail === '') {
			const x = document.getElementById('refereeEmailError')!;
			document.getElementById('email-field')?.classList.add('error-field');
			x.style.display = 'block';
			return false;
		}
		if (refereeEmail) {
			if (!refereeEmail.match(EMAIL_REGEX)) {
				const x = document.getElementById('invalidEmailError')!;
				x.style.display = 'block';
				document.getElementById('email-field')?.classList.add('error-field');
				return false;
			}
		}
		if (employmentType === '') {
			const x = document.getElementById('employmentTypeError')!;
			x.style.display = 'block';
			document
				.getElementById('select-employment')
				?.classList.add('error-field');
			return false;
		}
		if (refereePhone === '') {
			const x = document.getElementById('refereePhoneError')!;
			x.style.display = 'block';
			document.getElementById('phone-field')?.classList.add('error-field');
			return false;
		}
		if (refereePhone !== '' && /[0-9]{4}/.test(refereePhone) === false) {
			const x = document.getElementById('refereePhoneError')!;
			x.style.display = 'block';
			document.getElementById('phone-field')?.classList.add('error-field');
			return false;
		}
		if (refereeJobTitle === '') {
			const x = document.getElementById('refereeJobTitleError')!;
			x.style.display = 'block';
			document
				.getElementById('referee-job-title')
				?.classList.add('error-field');
			return false;
		}
		if (candidateRole === '') {
			const x = document.getElementById('candidateRoleError')!;
			x.style.display = 'block';
			document.getElementById('your-role-field')?.classList.add('error-field');
			return false;
		}
		let PhoneNumber = refereePhone;
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
			const x = document.getElementById('refereePhoneErrorInvalid')!;
			x.style.display = 'block';
			document.getElementById('phone-field')?.classList.add('error-field');
			return false;
		}

		await addJobHistory({
			candidate_uuid: params.id,
			employmentType,
			ipAddress: ipAddress,
			organization,
			startDate,
			endDate: currentlyWorkingHere === 'false' ? endDate : null,
			refereeFirstName: refereeFirstName.trim(),
			refereeLastName: refereeLastName.trim(),
			refereeEmail,
			refereePhone,
			refereeJobTitle,
			candidateRole,
			currentlyWorkingHere,
		});
		refetch();
		navigate('/job-history/' + params.name + '/' + params.id);
	};

	const goBackClicked = () => {
		if (jobhistory.length > 0) {
			setTimeout(function () {
				navigate('/job-history/' + params.name + '/' + params.id);
			}, 10);
		} else {
			setTimeout(function () {
				navigate('/candidate-job-history/' + params.name + '/' + params.id);
			}, 10);
		}
	};

	const checkForSameRefereeEmail = () => {
		alreadyUsedEmailRef.current!.style.display = refereeEmails?.includes(
			refereeEmail
		)
			? 'block'
			: 'none';
	};

	const isSaveButtonDisabled = refereeEmails?.includes(refereeEmail);

	return (
		<>
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-6 bg-primary text-left'>&nbsp;</div>
					<div className='col-6 bg-secondary text-right'>&nbsp;</div>
				</div>
			</div>
			<div className='wrapper'>
				<div className='container-fluid'>
					<div className='row justify-content-center align-items-center mt-4'>
						<div className='col-sm-10 col-md-8 col-lg-8'>
							<div className=''>
								<Link
									className='navbar-brand'
									to='/signin'
								>
									<img
										src={logo}
										alt='Credibled Logo'
										style={{ height: '43px' }}
									/>
								</Link>
							</div>
							<div className='card-plain mt2'>
								<div className='stepper'>
									<div className='stepper-steps'>
										<div className='stepper-step stepper-step-isActive'>
											<div className='stepper-stepContent step_active'>
												<span className='stepper-stepMarker'>1</span>Job
												Information
											</div>
										</div>
										<div className='stepper-step'>
											<div className='stepper-stepContent'>
												<span className='stepper-stepMarker'>2</span>Job History
											</div>
										</div>
										<div className='stepper-step'>
											<div className='stepper-stepContent'>
												<span className='stepper-stepMarker'>3</span>Summary
											</div>
										</div>
									</div>

									<div className='row'>
										<div className='col-md-12'>
											<h5 className='jh-subtitle pt1'>Employment Type</h5>

											<label className='label-static'>
												Employment
												<span className='sup_char'>
													<sup>*</sup>
												</span>
											</label>
											<div className='form-group'>
												<select
													id='select-employment'
													className='form-control select-top'
													value={employmentType}
													onChange={evt => {
														setEmploymentType(evt.target.value);
														const x = document.getElementById(
															'employmentTypeError'
														);
														document
															.getElementById('select-employment')!
															.classList.remove('error-field');
														x!.style.display = 'none';
													}}
												>
													<option value=''>Select Employment Type</option>
													<option>Full-Time Employee</option>
													<option>Part-Time Employee</option>
													<option>Temporary/Contract Employee</option>
												</select>
												<span className='fa fa-fw fa-angle-down field_icon eye'></span>
												<div
													className='notes'
													id='employmentTypeError'
													style={{ display: `none` }}
													tabIndex={0}
												>
													Employment Type is required
												</div>
											</div>
										</div>

										<div className='col-md-12'>
											<h5 className='jh-subtitle pt2'>Employed at</h5>
											<div className='form-group mt3'>
												<label className='bmd-label-floating'>
													Organization
													<span className='sup_char'>
														<sup>*</sup>
													</span>
												</label>
												<input
													id='organization-field'
													type='text'
													className='form-control'
													value={organization}
													onChange={evt => {
														if (
															SPECIAL_REGEX_ORG.test(evt.target.value) === false
														) {
															setOrganization(evt.target.value);
															const x =
																document.getElementById('organizationError')!;
															x.focus();
															x.style.display = 'none';
															const y = document.getElementById(
																'organizationErrorInvalid'
															)!;
															y.style.display = 'none';
															document
																.getElementById('organization-field')!
																.classList.remove('error-field');
														} else {
															const x = document.getElementById(
																'organizationErrorInvalid'
															);
															x!.style.display = 'block';
														}
													}}
													maxLength={40}
												/>
												<div
													className='notes'
													id='organizationError'
													tabIndex={0}
													style={{ display: `none` }}
												>
													Organization is required
												</div>
												<div
													className='notes'
													id='organizationErrorInvalid'
													style={{ display: `none` }}
												>
													Special Characters not allowed
												</div>
											</div>
										</div>

										<div className='col-md-6'>
											<div className='form-group mt3'>
												<label className='bmd-label-static'>
													Start Date
													<span className='sup_char'>
														<sup>*</sup>
													</span>
												</label>
												<LocalizaitonProvider dateAdapter={AdapterDayjs}>
													<div id='stdtc'>
														<MobileDatePicker
															slotProps={{
																textField: { placeholder: 'Month Year' },
															}}
															onOpen={() => {
																setTimeout(() => {
																	const yearCalendarView =
																		document.querySelector(
																			'.MuiYearCalendar-root'
																		);
																	if (yearCalendarView)
																		yearCalendarView.scrollTo(
																			0,
																			yearCalendarView.scrollHeight
																		);
																});
															}}
															views={['year', 'month']}
															maxDate={!!endDate ? dayjs(endDate) : dayjs()}
															value={!!startDate ? dayjs(startDate) : null}
															onChange={newValue => {
																if (newValue) {
																	setStartDate(
																		newValue.set('date', 2).format('YYYY-MM-DD')
																	);
																	const x =
																		document.getElementById('startDateError');
																	x!.style.display = 'none';
																}
															}}
															label='Month Year'
														/>
													</div>
												</LocalizaitonProvider>
												<div
													className='notes'
													id='startDateError'
													style={{ display: `none` }}
												>
													Start Date is required
												</div>
											</div>
										</div>

										<div className='col-md-6'>
											<div>
												<div className='form-group mt3'>
													<label className='bmd-label-static'>
														End Date
														<span className='sup_char'>
															<sup>*</sup>
														</span>
													</label>

													<LocalizaitonProvider dateAdapter={AdapterDayjs}>
														<div id='endtc'>
															{currentlyWorkingHere === 'true' ? (
																<TextField
																	value='Present'
																	disabled
																/>
															) : (
																<MobileDatePicker
																	slotProps={{
																		textField: { placeholder: 'Month Year' },
																	}}
																	views={['year', 'month']}
																	disabled={currentlyWorkingHere === 'true'}
																	minDate={dayjs(startDate)}
																	maxDate={dayjs()}
																	value={
																		dayjs(endDate).isValid()
																			? dayjs(endDate)
																			: null
																	}
																	onChange={newValue => {
																		if (newValue == null) return;
																		setEndDate(
																			newValue
																				.set('date', 2)
																				.format('YYYY-MM-DD')
																		);
																		setCurrentlyWorkingHere('false');
																		(document.querySelector(
																			'#checkBox_CurrentlyWorkHere'
																		) as HTMLInputElement)!.checked = false;
																		const x =
																			document.getElementById('endDateError');
																		x!.style.display = 'none';
																	}}
																	label='Month Year'
																/>
															)}
														</div>
													</LocalizaitonProvider>
													<div
														className='notes'
														id='endDateError'
														style={{ display: `none` }}
													>
														End Date is required
													</div>
												</div>
											</div>

											<div className=''>
												<div className='form-check box-pad'>
													<label className='form-check-label'>
														<input
															className='form-check-input'
															type='checkbox'
															id='checkBox_CurrentlyWorkHere'
															value={currentlyWorkingHere}
															onChange={checkBoxChange}
														/>
														Currently working here
														<span
															className='form-check-sign'
															tabIndex={1}
														>
															<span
																className='check'
																style={{ margin: 0 }}
															></span>
														</span>
													</label>
												</div>
											</div>
										</div>

										<div className='col-md-12'>
											<h5 className='jh-subtitle pt2'>Referee's Information</h5>
										</div>

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
													type='text'
													className='form-control ref-first-name'
													value={refereeFirstName}
													maxLength={35}
													onChange={evt => {
														if (!SPECIAL_REGEX_NAME.test(evt.target.value)) {
															document
																.getElementById('first-name-field')
																?.classList.remove('error-field');
															setRefereeFirstName(evt.target.value);
															const x = document.getElementById(
																'refereeFirstNameError'
															);
															x!.style.display = 'none';
															const y = document.getElementById(
																'refereeFirstNameErrorInvalid'
															);
															y!.style.display = 'none';
															if (
																evt.target.value.length ===
																(document.querySelector(
																	'.ref-first-name'
																) as HTMLInputElement)!.maxLength
															) {
																const x = document.getElementById(
																	'refereeFirstNameErrorMaxlength'
																);
																x!.style.display = 'block';
															} else {
																const x = document.getElementById(
																	'refereeFirstNameErrorMaxlength'
																);
																x!.style.display = 'none';
															}
														} else {
															const x = document.getElementById(
																'refereeFirstNameErrorInvalid'
															);
															x!.style.display = 'block';
															document
																.getElementById('first-name-field')
																?.classList.add('error-field');
														}
													}}
												/>
												<div
													className='notes'
													id='refereeFirstNameError'
													style={{ display: `none` }}
												>
													First Name is required
												</div>
												<div
													className='notes'
													id='refereeFirstNameErrorMaxlength'
													style={{ display: `none` }}
												>
													First name must be 35 characters or less.
												</div>
												<div
													className='notes'
													id='refereeFirstNameErrorInvalid'
													style={{ display: `none` }}
												>
													Numbers/special Characters are not allowed
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
													type='text'
													className='form-control ref-last-name'
													value={refereeLastName}
													maxLength={35}
													onChange={evt => {
														if (!SPECIAL_REGEX_NAME.test(evt.target.value)) {
															document
																.getElementById('last-name-field')
																?.classList.remove('error-field');
															setRefereeLastName(evt.target.value);
															const x = document.getElementById(
																'refereeLastNameError'
															)!;
															x!.style.display = 'none';
															const y = document.getElementById(
																'refereeLastNameErrorInvalid'
															)!;
															y.style.display = 'none';
															if (
																evt.target.value.length ===
																(
																	document.querySelector(
																		'.ref-last-name'
																	)! as HTMLInputElement
																).maxLength
															) {
																const x = document.getElementById(
																	'refereeLastNameErrorMaxlength'
																);
																x!.style.display = 'block';
															} else {
																const x = document.getElementById(
																	'refereeLastNameErrorMaxlength'
																);
																x!.style.display = 'none';
															}
														} else {
															const x = document.getElementById(
																'refereeLastNameErrorInvalid'
															);
															x!.style.display = 'block';
															document
																.getElementById('last-name-field')
																?.classList.add('error-field');
														}
													}}
												/>
												<div
													className='notes'
													id='refereeLastNameError'
													style={{ display: `none` }}
												>
													Last Name is required
												</div>
												<div
													className='notes'
													id='refereeLastNameErrorMaxlength'
													style={{ display: `none` }}
												>
													Last name must be 35 characters or less.
												</div>
												<div
													className='notes'
													id='refereeLastNameErrorInvalid'
													style={{ display: `none` }}
												>
													Numbers/special Characters are not allowed
												</div>
											</div>
										</div>

										<div className='col-md-12'>
											<div className='form-group'>
												<label className='bmd-label-floating'>
													Email address
													<span className='sup_char'>
														<sup>*</sup>
													</span>
												</label>
												<input
													id='email-field'
													type='email'
													value={refereeEmail}
													onChange={evt => {
														// eslint-disable-next-line eqeqeq
														if (/[<>].*/.test(evt.target.value) == false) {
															document
																.getElementById('email-field')
																?.classList.remove('error-field');
															setRefereeEmail(evt.target.value);
															const x =
																document.getElementById('refereeEmailError');
															x!.style.display = 'none';
															const z =
																document.getElementById('invalidEmailError');
															z!.style.display = 'none';
															const y = document.getElementById(
																'refereeEmailErrorAdded'
															);
															y!.style.display = 'none';
														}
													}}
													className='form-control'
													onBlur={checkForSameRefereeEmail}
												/>
												<div
													className='notes'
													id='refereeEmailError'
													style={{ display: `none` }}
												>
													Email address is required
												</div>
												<div
													className='notes'
													id='invalidEmailError'
													style={{ display: `none` }}
												>
													Email address is invalid
												</div>
												<div
													className='notes'
													style={{ display: `none` }}
													ref={alreadyUsedEmailRef}
												>
													Email address is already used
												</div>
												<div
													className='notes'
													id='refereeEmailErrorAdded'
													style={{ display: `none` }}
												>
													Email address is already added
												</div>
											</div>
										</div>
										<div className='col-md-12'>
											<div className='form-group'>
												<PhoneInput
													{...{
														phoneNumber: refereePhone,
														handlePhoneNumberChange,
														defaultCountry: 'Canada',
													}}
												/>
												<div
													className='notes'
													id='refereePhoneError'
													style={{ display: `none` }}
												>
													Phone# is required
												</div>
												<div
													className='notes'
													id='refereePhoneErrorInvalid'
													style={{ display: `none` }}
												>
													Phone Number is not valid
												</div>
											</div>
										</div>

										<div className='col-md-12'>
											<div className='form-group'>
												<label className='bmd-label-floating'>
													Referee job title at the time
													<span className='sup_char'>
														<sup>*</sup>
													</span>
												</label>
												<input
													id='referee-job-title'
													type='text'
													className='form-control'
													maxLength={50}
													value={refereeJobTitle}
													onChange={evt => {
														if (
															SPECIAL_REGEX_JOB.test(evt.target.value) === false
														) {
															document
																.getElementById('referee-job-title')
																?.classList.remove('error-field');
															setRefereeJobTitle(evt.target.value);
															const x = document.getElementById(
																'refereeJobTitleError'
															)!;
															x!.style.display = 'none';
															const y = document.getElementById(
																'refereeJobTitleErrorInvalid'
															)!;
															y!.style.display = 'none';
														} else {
															const x = document.getElementById(
																'refereeJobTitleErrorInvalid'
															);
															x!.style.display = 'block';
															document
																.getElementById('referee-job-title')
																?.classList.add('error-field');
														}
													}}
												/>
												<div
													className='notes'
													id='refereeJobTitleError'
													style={{ display: `none` }}
												>
													Job Title is required
												</div>
												<div
													className='notes'
													id='refereeJobTitleErrorInvalid'
													style={{ display: `none` }}
												>
													Invalid characters/symbols entered
												</div>
											</div>
										</div>

										<div className='col-md-12'>
											<div className='form-group'>
												<label className='bmd-label-floating'>
													<span>Your role at the time</span>
													<span className='sup_char'>
														<sup>*</sup>
													</span>
												</label>
												<input
													id='your-role-field'
													type='text'
													className='form-control'
													value={candidateRole}
													maxLength={50}
													onChange={evt => {
														if (
															SPECIAL_REGEX_JOB.test(evt.target.value) === false
														) {
															document
																.getElementById('your-role-field')
																?.classList.remove('error-field');
															setCandidateRole(evt.target.value);
															const x =
																document.getElementById('candidateRoleError')!;
															x.style.display = 'none';
															const y = document.getElementById(
																'candidateRoleErrorInvalid'
															)!;
															y.style.display = 'none';
														} else {
															const x = document.getElementById(
																'candidateRoleErrorInvalid'
															)!;
															x.style.display = 'block';
															document
																.getElementById('your-role-field')
																?.classList.add('error-field');
														}
													}}
												></input>
												<div
													className='notes'
													id='candidateRoleError'
													style={{ display: `none` }}
												>
													Role is required
												</div>
												<div
													className='notes'
													id='candidateRoleErrorInvalid'
													style={{ display: `none` }}
												>
													Invalid characters/symbols entered
												</div>
											</div>
										</div>
									</div>

									<div className='box-pad mt1 text-center'>
										<button
											className='btn btn-secondary-outline'
											onClick={goBackClicked}
										>
											Go back
										</button>
										&nbsp;
										<button
											onClick={saveClicked}
											className='btn btn-primary'
											disabled={isSaveButtonDisabled}
										>
											Save
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default JobInformation;
