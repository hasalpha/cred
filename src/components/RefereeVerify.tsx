/* eslint-disable eqeqeq */
import '@mui/lab';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { getJobHistorybyId, updateCandidateJobHistory } from '../apis';
import logo from '../assets/img/credibled_logo_205x45.png';
import { useCandidateName } from '../Common';
import {
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	TextField,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker/MobileDatePicker';
import { useCompanyStore } from './RefereeBegin';

function RefereeBasics() {
	const params = useParams();
	useCandidateName();
	const navigate = useNavigate();
	const [organization, setOrganization] = useState('');
	const [startDate, setStartDate] = useState<any>();
	const [endDate, setEndDate] = useState<any>();
	const [radio, setRadio] = useState(0);
	const [refereeJobTitle, setRefereeJobTitle] = useState('');
	const [candidateRole, setCandidateRole] = useState('');
	const [partStartDate, setPartStartDate] = useState<any>();
	const [partEndDate, setPartEndDate] = useState<any>();
	const [currentlyWorkingHere, setCurrentlyWorkingHere] = useState('');
	const SPECIAL_REGEX = /[0-9^`~!@#$%^&*()+=_}{"':?><|,./;|\]\\"["]/;
	const SPECIAL_REGEX_ORG = /[`~!@#$%^()+=_}{":?><|/;|\]\\"["]/;
	const store = useCompanyStore();

	useEffect(() => {
		(async () => {
			const { data } = await getJobHistorybyId(params.id);
			setCandidateRole(data.candidateRole);
			setStartDate(formatDate(data.startDate));
			setEndDate(formatDate(data.endDate));
			setCurrentlyWorkingHere(data.currentlyWorkingHere);
			setPartStartDate(data.partStartDate);
			setPartEndDate(data.partEndDate);
			const getData = () => {
				fetch(`${import.meta.env.VITE_API_URL}/api/refree/${data.refree}`)
					.then(response => response.json())
					.then(data => {
						const candidatesCompany = store[params.id!];
						setOrganization(candidatesCompany ?? data.organization);
						setRefereeJobTitle(data.refereeJobTitle);
					});
			};
			getData();
		})();
	}, [params.id, store]);

	useLayoutEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const formatDate = (dateString: any): any => {
		if (dateString) {
			let d = new Date(dateString);
			let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
			let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
			let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
			return year + '-' + month + '-' + day;
		} else {
			return null;
		}
	};

	const verifyClicked: React.FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault();
		if (validationCheck()) {
			const data = {
				organization,
				startDate,
				endDate,
				candidateRole,
				refereeJobTitle,
				partStartDate,
				partEndDate,
				currentlyWorkingHere: currentlyWorkingHere,
			};

			await updateCandidateJobHistory(params.id, data);
			navigate(
				'/referee-questionnaire/' +
					params.candidateName +
					'/' +
					params.refereeName +
					'/' +
					params.id
			);
		}
	};

	const mandateSymbol = () => {
		if (radio === 1) {
			return <sup>*</sup>;
		}
	};
	const changeRadio = (val: any) => {
		setRadio(val);
		if (val === 0) {
			const x = document.getElementById('divPartFromDate');
			x!.style.display = 'none';
			const y = document.getElementById('divPartToDate');
			y!.style.display = 'none';
		} else {
			if (val === 1 && currentlyWorkingHere == 'true' && partEndDate !== null) {
				setCurrentlyWorkingHere('false');
			}

			var x = document.getElementById('divPartFromDate');
			x!.style.display = 'block';
			const y = document.getElementById('divPartToDate');
			y!.style.display = 'block';
			setPartStartDate(startDate);
			setPartEndDate(endDate);
		}
	};

	const validationCheck = () => {
		if (
			radio === 1 &&
			currentlyWorkingHere === 'true' &&
			partEndDate !== null
		) {
			setCurrentlyWorkingHere('false');
		}
		if (organization === '') {
			const x = document.getElementById('organizationError');
			x!.style.display = 'block';
			return false;
		}
		if (startDate === '' || startDate === null) {
			const x = document.getElementById('startDateError');
			x!.style.display = 'block';
			return false;
		}
		if (
			(endDate === '' || endDate === null) &&
			(partEndDate == null || partEndDate === '')
		) {
			if (currentlyWorkingHere !== 'true') {
				const x = document.getElementById('endDateError');
				x!.style.display = 'block';
				return false;
			}
		}
		if (candidateRole === '') {
			const x = document.getElementById('candidateRoleError');
			x!.style.display = 'block';
			return false;
		}
		if (refereeJobTitle === '') {
			const x = document.getElementById('refereeJobTitleError');
			x!.style.display = 'block';
			return false;
		}
		if (radio === null) {
			// const x = document.getElementById("radioMandateMessage");
			// x.style.display = "block";
			return false;
		}
		if (radio === 1) {
			if (partStartDate === '' || partStartDate === null) {
				const x = document.getElementById('partStartDateError');
				x!.style.display = 'block';
				return false;
			}
			if (partEndDate === '' || partEndDate === null) {
				const x = document.getElementById('partEndDateError');
				x!.style.display = 'block';
				return false;
			}
		}

		return true;
	};
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
								<form
									className='col-md-9'
									onSubmit={verifyClicked}
								>
									<div className=''>
										<Link
											className='navbar-brand'
											to='/'
										>
											<img
												src={logo}
												alt='Credibled Logo'
												className='mob_logo credibled-logo'
											/>
										</Link>
									</div>

									<div className='card-plain mt2'>
										<div className='stepper'>
											<div className='stepper-steps'>
												<div className='stepper-step ss25 stepper-step-isActive'>
													<div className='stepper-stepContent step_active_primary'>
														<Link
															to={
																'/referee-accept/' +
																params.candidateName +
																'/' +
																params.refereeName +
																'/' +
																params.id
															}
															className='text-primary'
														>
															<span className='stepper-stepMarker'>1</span>
															Before we begin
														</Link>
													</div>
												</div>
												<div className='stepper-step ss25 stepper-step-isActive'>
													<div className='stepper-stepContent step_active'>
														<span className='stepper-stepMarker'>2</span>Verify
														the basics
													</div>
												</div>
												<div className='stepper-step ss25'>
													<div className='stepper-stepContent'>
														<span className='stepper-stepMarker'>3</span>
														Questionnaire
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className='row'>
										<div className='col-md-12'>
											<h3 className='text-primary pb1'>Verify the basics</h3>

											<div
												className='alert alert-warning alert-dismissible fade show'
												role='alert'
											>
												This reference applies to the time that{' '}
												<strong className='text-primary'>
													{params.candidateName}
												</strong>{' '}
												spent at{' '}
												<strong className='text-secondary'>
													{organization}
												</strong>
												. Please check and if necessary, update the information
												accordingly.
												<button
													type='button'
													className='close'
													data-dismiss='alert'
													aria-label='Close'
												>
													<span aria-hidden='true'>&times;</span>
												</button>
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
													type='text'
													value={organization}
													maxLength={50}
													onChange={evt => {
														if (!SPECIAL_REGEX_ORG.test(evt.target.value)) {
															setOrganization(evt.target.value);
															const x =
																document.getElementById('organizationError');
															x!.style.display = 'none';
															const y = document.getElementById(
																'organizationErrorInvalid'
															);
															y!.style.display = 'none';
														} else {
															const x = document.getElementById(
																'organizationErrorInvalid'
															);
															x!.style.display = 'block';
														}
													}}
													className='form-control bmd-form-group is-filled'
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
													Invalid characters not allowed
												</div>
											</div>
										</div>

										<div className='col-md-6'>
											<div className='form-group'>
												<label className='bmd-label-floating'>
													{params.candidateName}'s Start Date
													<span className='sup_char'>
														<sup>*</sup>
													</span>
												</label>
												<LocalizationProvider dateAdapter={AdapterDayjs}>
													<div id='stdtc'>
														<MobileDatePicker
															views={['year', 'month']}
															maxDate={!!endDate ? dayjs(endDate) : dayjs()}
															value={dayjs(startDate)}
															onChange={newValue => {
																if (!newValue) return;
																setStartDate(
																	dayjs(newValue.set('date', 2)).format(
																		'YYYY-MM-DD'
																	)
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
											<div className='form-group'>
												<label className='bmd-label-floating'>
													{params.candidateName}'s End Date
													{currentlyWorkingHere !== 'true' ? (
														<span className='sup_char'>
															<sup>*</sup>
														</span>
													) : null}
												</label>

												<LocalizationProvider dateAdapter={AdapterDayjs}>
													<div id='endtc'>
														{currentlyWorkingHere === 'true' ? (
															<TextField
																value='present'
																disabled
															/>
														) : (
															<MobileDatePicker
																views={['year', 'month']}
																disabled={currentlyWorkingHere === 'true'}
																minDate={dayjs(startDate)}
																maxDate={dayjs()}
																value={dayjs(endDate)}
																onChange={newValue => {
																	if (!newValue) return;
																	setEndDate(
																		newValue.set('date', 2).format('YYYY-MM-DD')
																	);
																	setCurrentlyWorkingHere('false');
																	const checkbox = document.querySelector(
																		'#checkBox_CurrentlyWorkHere'
																	) as HTMLInputElement;
																	if (checkbox) checkbox.checked = false;
																	const x =
																		document.getElementById('endDateError');
																	x!.style.display = 'none';
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
												<FormGroup>
													<FormControlLabel
														control={
															<Checkbox
																checked={currentlyWorkingHere === 'true'}
																onChange={e => {
																	setEndDate(null);
																	return e.target.checked
																		? setCurrentlyWorkingHere('true')
																		: setCurrentlyWorkingHere('false');
																}}
															/>
														}
														label='Currently working here'
													/>
												</FormGroup>
											</div>
										</div>

										<div className='col-md-6'>
											<div className='form-group bmd-form-group is-filled'>
												<label className='bmd-label-floating'>
													Candidate's role at the time
													<span className='sup_char'>
														<sup>*</sup>
													</span>
												</label>
												<input
													type='text'
													value={candidateRole}
													maxLength={50}
													onChange={evt => {
														if (!SPECIAL_REGEX.test(evt.target.value)) {
															setCandidateRole(evt.target.value);
															const x =
																document.getElementById('candidateRoleError');
															x!.style.display = 'none';
														} else {
															const x =
																document.getElementById('candidateRoleError');
															x!.style.display = 'block';
														}
													}}
													className='form-control bmd-form-group is-filled'
												/>
												<div
													className='notes'
													id='candidateRoleError'
													style={{ display: `none` }}
												>
													Candidate's Role is required
												</div>
											</div>
										</div>

										<div className='col-md-6'>
											<div className='form-group bmd-form-group is-filled'>
												<label className='bmd-label-floating'>
													Your job title at the time
													<span className='sup_char'>
														<sup>*</sup>
													</span>
												</label>
												<input
													type='text'
													value={refereeJobTitle}
													maxLength={50}
													onChange={evt => {
														if (!SPECIAL_REGEX.test(evt.target.value)) {
															setRefereeJobTitle(evt.target.value);
															const x = document.getElementById(
																'refereeJobTitleError'
															);
															x!.style.display = 'none';
														} else {
															const x = document.getElementById(
																'refereeJobTitleError'
															);
															x!.style.display = 'block';
														}
													}}
													className='form-control bmd-form-group is-filled'
												/>
												<div
													className='notes'
													id='refereeJobTitleError'
													style={{ display: `none` }}
												>
													Your Job Title is required
												</div>
											</div>
										</div>

										<div className='col-md-12'>
											<h5 className='jh-subtitle pt2'>
												Please select an option
												<span className='sup_char'>
													<sup>*</sup>
												</span>
											</h5>

											<div className='form-check form-check-radio fc_more'>
												<label className='form-check-label txt_body'>
													<input
														className='form-check-input'
														type='radio'
														name='feedbackRadio'
														checked={!radio}
														onChange={() => changeRadio(0)}
													/>
													My feedback will cover the entire time{' '}
													<b className='text-primary'>{params.candidateName}</b>{' '}
													spent at the organization.
													<span className='circle'>
														<span className='check'></span>
													</span>
												</label>
											</div>
											<div className='form-check form-check-radio fc_more'>
												<label className='form-check-label txt_body'>
													<input
														className='form-check-input'
														type='radio'
														name='feedbackRadio'
														value={radio}
														onChange={() => changeRadio(1)}
													/>
													My feedback will cover only part of the time{' '}
													<b className='text-primary'>{params.candidateName}</b>{' '}
													spent at the organization.
													<span className='circle'>
														<span className='check'></span>
													</span>
												</label>
											</div>
										</div>

										<div
											className='col-md-6 mt2'
											id='divPartFromDate'
											style={{ display: 'none' }}
										>
											<div className='form-group'>
												<label className='bmd-label mt-2'>
													From
													<span className='sup_char'>{mandateSymbol()}</span>
												</label>
												<LocalizationProvider dateAdapter={AdapterDayjs}>
													<div>
														<MobileDatePicker
															views={['year', 'month']}
															minDate={dayjs(startDate)}
															maxDate={
																partEndDate
																	? dayjs(partEndDate)
																	: endDate
																		? dayjs(endDate)
																		: dayjs()
															}
															value={
																partStartDate
																	? dayjs(partStartDate)
																	: dayjs(startDate)
															}
															onChange={newValue => {
																if (!newValue) return null;
																setPartStartDate(
																	newValue.set('date', 2).format('YYYY-MM-DD')
																);
																const x =
																	document.getElementById('partStartDateError');
																x!.style.display = 'none';
															}}
														/>
													</div>
												</LocalizationProvider>
												<div
													className='notes'
													id='partStartDateError'
													style={{ display: `none` }}
												>
													From Date is required
												</div>
											</div>
										</div>

										<div
											className='col-md-6 mt2'
											id='divPartToDate'
											style={{ display: 'none' }}
										>
											<div className='form-group'>
												<label className='bmd-label mt-2'>
													To
													<span className='sup_char'>{mandateSymbol()}</span>
												</label>
												<LocalizationProvider dateAdapter={AdapterDayjs}>
													<div>
														<MobileDatePicker
															views={['year', 'month']}
															minDate={
																startDate ? dayjs(startDate) : dayjs(startDate)
															}
															maxDate={endDate ? dayjs(endDate) : dayjs()}
															value={
																partEndDate
																	? dayjs(partEndDate)
																	: endDate
																		? dayjs(endDate)
																		: dayjs(null)
															}
															onChange={newValue => {
																if (!newValue) return;
																setPartEndDate(
																	newValue.set('date', 2).format('YYYY-MM-DD')
																);
																const x =
																	document.getElementById('partEndDateError');
																x!.style.display = 'none';
															}}
														/>
													</div>
												</LocalizationProvider>
												<div
													className='notes'
													id='partEndDateError'
													style={{ display: `none` }}
												>
													To Date is required
												</div>
											</div>
										</div>

										<div className='col-md-12'>
											<FormGroup>
												<FormControlLabel
													required
													control={<Checkbox required />}
													label={
														<strong className='text-black'>
															The information above is true and accurate.
														</strong>
													}
												/>
											</FormGroup>
										</div>
									</div>
									<Button
										color='secondary'
										variant='contained'
										type='submit'
									>
										Verify & Continue
									</Button>
								</form>
							</div>
							<div className='clearfix'></div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default RefereeBasics;
