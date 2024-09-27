/* eslint-disable eqeqeq */
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { getJobHistorybyId, updateCandidateJobHistory } from '../apis';
import logo from '../assets/img/credibled_logo_205x45.png';
import { useJobData, useJobHistory } from '../Common';
import PhoneInput from './PhoneNumberInput';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker/MobileDatePicker';

const SPECIAL_REGEX_ORG = /[`~!@#$%^()+=_}{":?><|/;|\]\\"["]/;
const SPECIAL_REGEX_JOB = /[`~!@#$%^=_}{"':?><|;|\]\\"["]/;

function EditJobInformation() {
	const alreadyUsedEmailRef = useRef<null | HTMLDivElement>(null);
	const params = useParams() as {
		name: string;
		id: string;
		candidateHash: string;
	};
	const [employmentType, setEmploymentType] = useState('');
	const [organization, setOrganization] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [currentlyWorkingHere, setCurrentlyWorkingHere] = useState('');
	const [refereeFirstName, setRefereeFirstName] = useState('');
	const [refereeLastName, setRefereeLastName] = useState('');
	const [refereeEmail, setRefereeEmail] = useState('');
	const [refereePhone, setRefereePhone] = useState('');
	const [refereeJobTitle, setRefereeJobTitle] = useState('');
	const [candidateRole, setCandidateRole] = useState('');
	const navigate = useNavigate();
	const { refetch: refetchJobData } = useJobData();
	const { data: jobHistory = [], refetch: refetchJobHistory } = useJobHistory();
	const refereeEmails = jobHistory?.flatMap(val =>
		val.uuid === params.candidateHash ? [] : [val.refereeEmail]
	);

	const handlePhoneNumberChange = (value: string) => {
		document.getElementById('phone-field')!.classList.remove('error-field');
		const currentPhoneNumberLength = value
			?.split?.(' ')
			?.slice?.(1)
			?.join('')?.length;
		if (currentPhoneNumberLength && currentPhoneNumberLength >= 14) return;
		return setRefereePhone(value);
	};

	useEffect(() => {
		(async () => {
			const { data } = await getJobHistorybyId(params?.candidateHash);
			setCandidateRole(data.candidateRole);
			setStartDate(formatDate(data.startDate));
			setEndDate(formatDate(data.endDate));
			fetch(`${import.meta.env.VITE_API_URL}/api/refree/${data.refree}`)
				.then(response => response.json())
				.then(data => {
					setOrganization(data.organization);
					setRefereeJobTitle(data.refereeJobTitle);
					setRefereeFirstName(data.refereeFirstName);
					setRefereeLastName(data.refereeLastName);
					setRefereeEmail(data.refereeEmail);
					setRefereePhone(data.refereePhone);
				});
			setEmploymentType(data.employmentType);
			setCurrentlyWorkingHere(data.currentlyWorkingHere);
			if (data.currentlyWorkingHere == 'true')
				(document.getElementById(
					'checkBox_CurrentlyWorkHere'
				) as HTMLInputElement)!.checked = true;
		})();
	}, [params?.candidateHash]);

	var EMAIL_REGEX =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const SPECIAL_REGEX_NAME = /[0-9^`~!@#$%^&*()+=_}{"':?><|,./;|\]\\"["]/;

	const checkBoxChange = () => {
		if (
			(document.getElementById(
				'checkBox_CurrentlyWorkHere'
			) as HTMLInputElement)!.checked === true
		) {
			setEndDate('');
			setCurrentlyWorkingHere('true');
			const x = document.getElementById('endDateError')!;
			x.style.display = 'none';
		} else {
			setCurrentlyWorkingHere('false');
		}
	};

	const handleUpdate = async () => {
		if (employmentType == '') {
			const x = document.getElementById('employmentTypeError')!;
			x.focus();
			x!.style.display = 'block';
			return false;
		}
		if (organization == '') {
			const x = document.getElementById('organizationError');
			x!.style.display = 'block';
			return false;
		}
		if (startDate == '' || startDate == null) {
			const x = document.getElementById('startDateError');
			x!.style.display = 'block';
			return false;
		}
		if ((endDate == '' || endDate == null) && currentlyWorkingHere == 'false') {
			const x = document.getElementById('endDateError');
			x!.style.display = 'block';
			return false;
		}
		if (refereeFirstName == '') {
			const x = document.getElementById('refereeFirstNameError');
			x!.style.display = 'block';
			return false;
		}
		if (refereeLastName == '') {
			const x = document.getElementById('refereeLastNameError');
			x!.style.display = 'block';
			return false;
		}
		if (refereeEmail == '') {
			const x = document.getElementById('refereeEmailError');
			x!.style.display = 'block';
			return false;
		}
		if (refereeEmail) {
			if (!refereeEmail.match(EMAIL_REGEX)) {
				const x = document.getElementById('invalidEmailError');
				x!.style.display = 'block';
				return false;
			}
		}
		if (employmentType == '') {
			const x = document.getElementById('employmentTypeError');
			x!.focus();
			x!.style.display = 'block';
			return false;
		}

		if (refereePhone !== '' && /[0-9]{4}/.test(refereePhone) == false) {
			const x = document.getElementById('refereePhoneError');
			x!.style.display = 'block';
			return false;
		}
		if (refereeJobTitle == '') {
			const x = document.getElementById('refereeJobTitleError');
			x!.style.display = 'block';
			return false;
		}
		if (candidateRole == '') {
			const x = document.getElementById('candidateRoleError');
			x!.style.display = 'block';
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
			const x = document.getElementById('refereePhoneErrorInvalid');
			x!.style.display = 'block';
			return false;
		}
		await updateCandidateJobHistory(params.candidateHash, {
			candidate_uuid: params.candidateHash,
			employmentType,
			organization,
			startDate,
			endDate: !!endDate ? endDate : null,
			refereeFirstName: refereeFirstName.trim(),
			refereeLastName: refereeLastName.trim(),
			refereeEmail,
			refereePhone,
			refereeJobTitle,
			candidateRole,
			currentlyWorkingHere: currentlyWorkingHere,
		});
		await refetchJobData();
		await refetchJobHistory();
		navigate('/job-history/' + params.name + '/' + params.id);
	};

	const formatDate = (dateString: string | number | Date | null) => {
		if (dateString) {
			let d = new Date(dateString);
			let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
			let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
			let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
			return year + '-' + month + '-' + day;
		} else {
			return '';
		}
	};

	const goBackClicked = () => {
		if (params.name && params.id) {
			navigate('/job-history/' + params.name + '/' + params.id);
		}
	};

	const checkForSameRefereeEmail = () => {
		alreadyUsedEmailRef.current!.style.display = refereeEmails?.includes(
			refereeEmail
		)
			? 'block'
			: 'none';
	};

	const isUpdateButtonDisabled = refereeEmails?.includes(refereeEmail);
	return (
		<>
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-6 bg-primary text-left'>&nbsp;</div>
					<div className='col-6 bg-secondary text-right'>&nbsp;</div>
				</div>
			</div>
			<div className='wrapper'>
				<div className='main-panel w-100 float-none'>
					<div className='content'>
						<div className='container-fluid'>
							<div className='row justify-content-center align-items-center mt-4'>
								<div className='col-md-9'>
									<div className=''>
										<Link
											className='navbar-brand'
											to='/signin'
										>
											<img
												src={logo}
												alt='Credibled Logo'
												className='credibled-logo'
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
														<span className='stepper-stepMarker'>2</span>Job
														History
													</div>
												</div>
												<div className='stepper-step'>
													<div className='stepper-stepContent'>
														<span className='stepper-stepMarker'>3</span>Summary
													</div>
												</div>
											</div>

											<div className='row'>
												<div className='col-md-12 bg-amberlight1'>
													<h5 className='jh-subtitle pt1'>Employment Type</h5>

													<label className='label-static'>
														Employment
														<span className='sup_char'>
															<sup>*</sup>
														</span>
													</label>
													<div className='form-group'>
														<select
															id='employment-field'
															className='form-control select-top'
															value={employmentType}
															onChange={evt => {
																setEmploymentType(evt.target.value);
																var x = document.getElementById(
																	'employmentTypeError'
																);
																x!.focus();
																x!.style.display = 'none';
																document
																	.getElementById('employment-field')!
																	.classList.remove('error-field');
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
													<div className='form-group mt3 bmd-form-group is-filled'>
														<label className='bmd-label-floating'>
															Organization
															<span className='sup_char'>
																<sup>*</sup>
															</span>
														</label>
														<input
															id='organization-field'
															type='text'
															className='form-control bmd-form-group is-filled'
															value={organization}
															maxLength={40}
															onChange={evt => {
																if (
																	SPECIAL_REGEX_ORG.test(evt.target.value) ===
																	false
																) {
																	setOrganization(evt.target.value);
																	const x =
																		document.getElementById(
																			'organizationError'
																		);
																	x!.style.display = 'none';
																	const y = document.getElementById(
																		'organizationErrorInvalid'
																	);
																	y!.style.display = 'none';
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
														/>
														<div
															className='notes'
															id='organizationError'
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
														<LocalizationProvider dateAdapter={AdapterDayjs}>
															<div>
																<MobileDatePicker
																	slotProps={{
																		textField: { placeholder: 'Month Year' },
																	}}
																	label='Month Year'
																	views={['year', 'month']}
																	maxDate={endDate ? dayjs(endDate) : dayjs()}
																	value={
																		dayjs(startDate).isValid()
																			? dayjs(startDate)
																			: null
																	}
																	onChange={newValue => {
																		if (newValue == null) return;
																		newValue.add(1, 'day');
																		setStartDate(
																			newValue
																				.set('date', 2)
																				.format('YYYY-MM-DD')!
																		);
																		const x =
																			document.getElementById('startDateError');
																		x!.style.display = 'none';
																	}}
																/>
															</div>
														</LocalizationProvider>
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
													<div className='form-group mt3'>
														<label className='bmd-label-static'>
															End Date
															<span className='sup_char'>
																<sup>*</sup>
															</span>
														</label>
														<LocalizationProvider dateAdapter={AdapterDayjs}>
															<div>
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
																		minDate={dayjs(startDate)}
																		maxDate={dayjs()}
																		value={
																			dayjs(endDate).isValid()
																				? dayjs(endDate)
																				: null
																		}
																		onChange={newValue => {
																			if (newValue == null) return;
																			newValue.add(1, 'day');
																			setEndDate(
																				newValue
																					.set('date', 2)
																					.format('YYYY-MM-DD')
																			);
																			setCurrentlyWorkingHere('false');
																			(document.querySelector(
																				'#checkBox_CurrentlyWorkHere'
																			) as HTMLInputElement)!.checked = false;
																			setCurrentlyWorkingHere('false');
																			var x =
																				document.getElementById(
																					'endDateError'
																				)!;
																			x.style.display = 'none';
																		}}
																	/>
																)}
															</div>
														</LocalizationProvider>
														<div
															className='notes'
															id='endDateError'
															style={{ display: `none` }}
														>
															End Date is required
														</div>
													</div>
												</div>

												<div className='col-md-6'>
													<div className='form-check box-pad'>
														<label className='form-check-label'>
															<input
																className='form-check-input'
																type='checkbox'
																id='checkBox_CurrentlyWorkHere'
																onChange={checkBoxChange}
															/>
															Currently working here
															<span className='form-check-sign'>
																<span className='check'></span>
															</span>
														</label>
													</div>
												</div>

												<div className='col-md-12'>
													<h5 className='jh-subtitle pt2'>
														Referee Information
													</h5>
												</div>

												<div className='col-md-6'>
													<div className='form-group bmd-form-group is-filled'>
														<label className='bmd-label-floating'>
															First Name
															<span className='sup_char'>
																<sup>*</sup>
															</span>
														</label>
														<input
															id='first-name-field'
															type='text'
															className='form-control bmd-form-group is-filled ref-last-name'
															maxLength={35}
															value={refereeFirstName}
															onChange={evt => {
																if (
																	!SPECIAL_REGEX_NAME.test(evt.target.value)
																) {
																	document
																		.getElementById('first-name-field')!
																		.classList.remove('error-field');
																	setRefereeFirstName(evt.target.value);
																	const x = document.getElementById(
																		'refereeFirstNameError'
																	)!;
																	x.style.display = 'none';
																	const y = document.getElementById(
																		'refereeFirstNameErrorInvalid'
																	);
																	y!.style.display = 'none';
																	if (
																		evt.target.value.length ===
																		(document.querySelector(
																			'.ref-last-name'
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
															id='refereeFirstNameErrorInvalid'
															style={{ display: `none` }}
														>
															Special Characters not allowed
														</div>
														<div
															className='notes'
															id='refereeFirstNameErrorMaxlength'
															style={{ display: `none` }}
														>
															First name must be 35 characters or less.
														</div>
													</div>
												</div>
												<div className='col-md-6'>
													<div className='form-group bmd-form-group is-filled'>
														<label className='bmd-label-floating'>
															Last Name
															<span className='sup_char'>
																<sup>*</sup>
															</span>
														</label>
														<input
															id='last-name-field'
															type='text'
															className='form-control bmd-form-group is-filled ref-last-name'
															maxLength={35}
															value={refereeLastName}
															onChange={evt => {
																if (
																	!SPECIAL_REGEX_NAME.test(evt.target.value)
																) {
																	document
																		.getElementById('last-name-field')!
																		.classList.remove('error-field');
																	setRefereeLastName(evt.target.value);
																	const x = document.getElementById(
																		'refereeLastNameError'
																	);
																	x!.style.display = 'none';
																	const y = document.getElementById(
																		'refereeLastNameErrorInvalid'
																	);
																	y!.style.display = 'none';
																	if (
																		evt.target.value.length ===
																		(
																			document.querySelector(
																				'.ref-last-name'
																			) as HTMLInputElement
																		).maxLength
																	) {
																		const x = document.getElementById(
																			'refereeLastNameErrorMaxlength'
																		)!;
																		x.style.display = 'block';
																	} else {
																		const x = document.getElementById(
																			'refereeLastNameErrorMaxlength'
																		)!;
																		x.style.display = 'none';
																	}
																} else {
																	const x = document.getElementById(
																		'refereeLastNameErrorInvalid'
																	);
																	x!.style.display = 'block';
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
															id='refereeLastNameErrorInvalid'
															style={{ display: `none` }}
														>
															Special/Invalid characters not allowed
														</div>
														<div
															className='notes'
															id='refereeLastNameErrorMaxlength'
															style={{ display: `none` }}
														>
															Last name must be 35 characters or less.
														</div>
													</div>
												</div>

												<div className='col-md-6'>
													<div className='form-group bmd-form-group is-filled'>
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
															maxLength={40}
															onChange={evt => {
																document
																	.getElementById('email-field')!
																	.classList.remove('error-field');
																setRefereeEmail(evt.target.value);
																const x =
																	document.getElementById('refereeEmailError');
																x!.style.display = 'none';
																const y =
																	document.getElementById('invalidEmailError');
																y!.style.display = 'none';
															}}
															onBlur={checkForSameRefereeEmail}
															className='form-control bmd-form-group is-filled'
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
													</div>
												</div>
												<div className='col-md-6'>
													<div className='form-group bmd-form-group is-filled'>
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
															Entered Phone number is Invalid
														</div>
													</div>
												</div>
												<div className='col-md-12'>
													<div className='form-group bmd-form-group is-filled'>
														<label className='bmd-label-floating'>
															Referee job title at the time
															<span className='sup_char'>
																<sup>*</sup>
															</span>
														</label>
														<input
															id='job-field'
															type='text'
															className='form-control bmd-form-group is-filled'
															maxLength={50}
															value={refereeJobTitle}
															onChange={evt => {
																if (
																	SPECIAL_REGEX_JOB.test(evt.target.value) ===
																	false
																) {
																	document
																		.getElementById('job-field')!
																		.classList.remove('error-field');
																	setRefereeJobTitle(evt.target.value);
																	const x = document.getElementById(
																		'refereeJobTitleError'
																	);
																	x!.style.display = 'none';
																	const y = document.getElementById(
																		'refereeJobTitleErrorInvalid'
																	);
																	y!.style.display = 'none';
																} else {
																	const x = document.getElementById(
																		'refereeJobTitleErrorInvalid'
																	);
																	x!.style.display = 'block';
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
															Special/Invalid Characters not allowed
														</div>
													</div>
												</div>

												<div className='col-md-12'>
													<div className='form-group bmd-form-group is-filled'>
														<label className='bmd-label-floating'>
															<span>Your role at the time</span>
															<span className='sup_char'>
																<sup>*</sup>
															</span>
														</label>
														<input
															id='role-field'
															className='form-control bmd-form-group is-filled'
															maxLength={40}
															value={candidateRole}
															onChange={evt => {
																if (
																	SPECIAL_REGEX_JOB.test(evt.target.value) ===
																	false
																) {
																	document
																		.getElementById('role-field')!
																		.classList.remove('error-field');
																	setCandidateRole(evt.target.value);
																	const x =
																		document.getElementById(
																			'candidateRoleError'
																		);
																	x!.style.display = 'none';
																	const y = document.getElementById(
																		'candidateRoleErrorInvalid'
																	);
																	y!.style.display = 'none';
																} else {
																	const x = document.getElementById(
																		'candidateRoleErrorInvalid'
																	);
																	x!.style.display = 'block';
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
															Special Characters not allowed
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
													onClick={handleUpdate}
													className='btn btn-primary'
													disabled={isUpdateButtonDisabled}
												>
													Update
												</button>
											</div>
										</div>
									</div>
									<div className='clearfix'></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default EditJobInformation;
