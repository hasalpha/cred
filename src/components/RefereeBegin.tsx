import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';
import { getJobHistorybyId, updateCandidateJobHistory } from '../apis';
import logo from '../assets/img/credibled_logo_205x45.png';
import PhoneInput from './PhoneNumberInput';
import {
	EMAIL_REGEX,
	SPECIAL_REGEX_JOB,
	SPECIAL_REGEX_NAME,
	SPECIAL_REGEX_ORG,
} from './JobInformation';
import Button from '@mui/material/Button/Button';
import FormGroup from '@mui/material/FormGroup/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import { composeStore } from 'utils/composeStore';
export const useCompanyStore = composeStore<Record<string, string | undefined>>(
	{
		name: 'company',
		initialState: {},
		storage: localStorage,
	}
);

function RefereeBegin() {
	const {
		setStore,
		resetStore: _resetStore,
		...companyMap
	} = useCompanyStore();
	const navigate = useNavigate();
	const params = useParams() as { id: string } & Record<string, string>;
	const [refereeFirstName, setRefereeFirstName] = useState('');
	const [refereeLastName, setRefereeLastName] = useState('');
	const [refereeTitle, setRefereeTitle] = useState('');
	const [refereeCurrentCompany, setRefereeCurrentCompany] = useState('');
	const [refereeEmail, setRefereeEmail] = useState('');
	const [refereePhone, setRefereePhone] = useState('');
	const [, setUpdateButton] = useState(true);

	useEffect(() => {
		(async () => {
			const { data } = await getJobHistorybyId(params.id);
			const getData = () => {
				fetch(`${import.meta.env.VITE_API_URL}/api/refree/${data.refree}`)
					.then(response => response.json())
					.then((val: RefereeInfo) => {
						setRefereeFirstName(val.refereeFirstName);
						setRefereeLastName(val.refereeLastName);
						setRefereeTitle(val.refereeJobTitle);

						setRefereeCurrentCompany(val.organization);
						if (!companyMap[params.id]) {
							companyMap[params.id] = val.organization;
							setStore(companyMap);
						}
						setRefereeEmail(val.refereeEmail);
						setRefereePhone(val.refereePhone);
					});
			};
			getData();
		})();
	}, [params.id, setStore]);

	const enableDisableButton = () => {
		const clicks = fromEvent(
			document.querySelectorAll('input.form-control'),
			'input'
		);
		const result = clicks.pipe(
			debounceTime(1000),
			distinctUntilChanged((prev, curr) => prev === curr)
		);
		result.subscribe(() => setUpdateButton(false));
	};

	useEffect(() => {
		enableDisableButton();
	}, []);

	const acceptClicked: React.FormEventHandler<HTMLFormElement> = e => {
		e.preventDefault();
		return navigate(
			'/referee-verify/' +
				params.candidateName +
				'/' +
				params.refereeName +
				'/' +
				params.id
		);
	};

	const handleUpdateClick = async () => {
		if (refereeFirstName === '' || /[0-9]/.test(refereeFirstName) === true) {
			var x = document.getElementById('refereeFirstNameError');
			x!.style.display = 'block';
			return false;
		}
		if (refereeLastName === '' || /[0-9]/.test(refereeLastName) === true) {
			const x = document.getElementById('refereeLastNameError');
			x!.style.display = 'block';
			return false;
		}
		if (refereeTitle === '') {
			const x = document.getElementById('refereeTitleError');
			x!.style.display = 'block';
			return false;
		}
		if (refereeCurrentCompany === '') {
			const x = document.getElementById('refereeCurrentCompanyError');
			x!.style.display = 'block';
			return false;
		}
		if (refereePhone.length === 0 || /[0-9]{4}/.test(refereePhone) === false) {
			const x = document.getElementById('refereePhoneError');
			x!.style.display = 'block';
			return false;
		}
		if (refereeEmail === '') {
			const x = document.getElementById('refereeEmailError');
			x!.style.display = 'block';
			return false;
		}
		if (refereeEmail) {
			if (!refereeEmail.match(EMAIL_REGEX)) {
				const x = document.getElementById('refereeEmailInvalid');
				x!.style.display = 'block';
				return false;
			}
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

		const data = {
			refereeFirstName: refereeFirstName.trim(),
			refereeLastName: refereeLastName.trim(),
			refereeJobTitle: refereeTitle,
			organization: refereeCurrentCompany,
			refereePhone: refereePhone,
			refereeEmail: refereeEmail,
		};

		const resp = await updateCandidateJobHistory(params.id, data);
		if (resp.status === 200) {
			document.querySelectorAll('.notes').forEach((item: any) => {
				item!.style.display = 'none';
			});
			var z = document.getElementById('updateMessage');
			z!.style.display = 'block';
		}
	};

	const handlePhoneNumberChange = (value: any) => {
		const currentPhoneNumberLength = value
			?.split(' ')
			?.slice(1)
			?.join('')?.length;
		if (currentPhoneNumberLength && currentPhoneNumberLength > 10) return;
		return setRefereePhone(value);
	};

	return (
		<div>
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
											to='/'
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
												<div className='stepper-step ss25 stepper-step-isActive'>
													<div className='stepper-stepContent step_active'>
														<span className='stepper-stepMarker'>1</span>Before
														we begin
													</div>
												</div>
												<div className='stepper-step ss25'>
													<div className='stepper-stepContent'>
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
										<div className='col-md-12 pl3'>
											<h3 className='text-primary pb1'>Before we begin</h3>

											<div className='text-primary pt1 fw400'>
												{refereeFirstName} {refereeLastName} &nbsp;
											</div>
											<p className='text-secondary'>
												{!!refereePhone ? refereePhone : ''}
											</p>
										</div>
									</div>

									<div className='lrpad border'>
										<div className='row pt1'>
											<div className='col-md-6'>
												<div className='form-group bmd-form-group is-filled'>
													<label className='bmd-label-floating'>
														First Name
														<span className='sup_char'>
															<sup>*</sup>
														</span>
													</label>
													<input
														type='text'
														value={refereeFirstName}
														className='form-control bmd-form-group is-filled'
														maxLength={35}
														onChange={evt => {
															if (
																SPECIAL_REGEX_NAME.test(evt.target.value) ===
																false
															) {
																setRefereeFirstName(evt.target.value);
																const y = document.getElementById(
																	'refereeFirstNameError'
																);
																y!.style.display = 'none';
																var z =
																	document.getElementById('updateMessage');
																z!.style.display = 'none';
																const x = document.getElementById(
																	'refereeFirstNameErrorInvalid'
																);
																x!.style.display = 'none';
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
														Invalid Characters not allowed
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
														type='text'
														value={refereeLastName}
														className='form-control bmd-form-group is-filled'
														maxLength={35}
														onChange={evt => {
															if (
																SPECIAL_REGEX_NAME.test(evt.target.value) ===
																false
															) {
																setRefereeLastName(evt.target.value);
																const x = document.getElementById(
																	'refereeLastNameError'
																);
																x!.style.display = 'none';
																const z =
																	document.getElementById('updateMessage');
																z!.style.display = 'none';
																const y = document.getElementById(
																	'refereeLastNameErrorInvalid'
																);
																y!.style.display = 'none';
															} else {
																//  setRefereeLastName(evt.target.value);
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
														Invalid characters not allowed
													</div>
												</div>
											</div>
											<div className='col-md-6'>
												<div className='form-group bmd-form-group is-filled'>
													<label className='bmd-label-floating'>
														Current Title
														<span className='sup_char'>
															<sup>*</sup>
														</span>
													</label>
													<input
														type='text'
														value={refereeTitle}
														className='form-control bmd-form-group is-filled'
														maxLength={35}
														onChange={evt => {
															if (
																SPECIAL_REGEX_JOB.test(evt.target.value) ===
																false
															) {
																setRefereeTitle(evt.target.value);
																const x =
																	document.getElementById('refereeTitleError');
																x!.style.display = 'none';
																const z =
																	document.getElementById('updateMessage');
																z!.style.display = 'none';
																const y = document.getElementById(
																	'refereeTitleErrorInvalid'
																);
																y!.style.display = 'none';
															} else {
																const x = document.getElementById(
																	'refereeTitleErrorInvalid'
																);
																x!.style.display = 'block';
															}
														}}
													/>
													<div
														className='notes'
														id='refereeTitleError'
														style={{ display: `none` }}
													>
														Current Title is required
													</div>
													<div
														className='notes'
														id='refereeTitleErrorInvalid'
														style={{ display: `none` }}
													>
														Invalid characters not allowed
													</div>
												</div>
											</div>
											<div className='col-md-6'>
												<div className='form-group bmd-form-group is-filled'>
													<label className='bmd-label-floating'>
														Current Company
														<span className='sup_char'>
															<sup>*</sup>
														</span>
													</label>
													<input
														type='text'
														value={refereeCurrentCompany}
														className='form-control bmd-form-group is-filled'
														maxLength={40}
														onChange={evt => {
															if (
																SPECIAL_REGEX_ORG.test(evt.target.value) ===
																false
															) {
																setRefereeCurrentCompany(evt.target.value);
																const x = document.getElementById(
																	'refereeCurrentCompanyError'
																);
																x!.style.display = 'none';
																var z =
																	document.getElementById('updateMessage');
																z!.style.display = 'none';
																const y = document.getElementById(
																	'refereeCurrentCompanyErrorInvalid'
																);
																y!.style.display = 'none';
															} else {
																const x = document.getElementById(
																	'refereeCurrentCompanyErrorInvalid'
																);
																x!.style.display = 'block';
															}
														}}
													/>
													<div
														className='notes'
														id='refereeCurrentCompanyError'
														style={{ display: `none` }}
													>
														Current Company is required
													</div>
													<div
														className='notes'
														id='refereeCurrentCompanyErrorInvalid'
														style={{ display: `none` }}
													>
														Invalid characters not allowed
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
														Phone Number is not valid
													</div>
												</div>
											</div>
											<div className='col-md-6'>
												<div className='form-group bmd-form-group is-filled'>
													<label className='bmd-label-floating'>
														Email
														<span className='sup_char'>
															<sup>*</sup>
														</span>
													</label>
													<input
														type='text'
														value={refereeEmail}
														className='form-control bmd-form-group is-filled'
														onChange={evt => {
															if (/[<>]/.test(evt.target.value) === false) {
																setRefereeEmail(evt.target.value);
																var x =
																	document.getElementById('refereeEmailError');
																x!.style.display = 'none';
																var y = document.getElementById(
																	'refereeEmailInvalid'
																);
																y!.style.display = 'none';
																var z =
																	document.getElementById('updateMessage');
																z!.style.display = 'none';
															}
														}}
													/>
													<div
														className='notes'
														id='refereeEmailError'
														style={{ display: `none` }}
													>
														Email is required
													</div>
													<div
														className='notes'
														id='refereeEmailInvalid'
														style={{ display: `none` }}
													>
														Email is Invalid
													</div>
												</div>
											</div>
										</div>

										<div className='modal-footer pt1'>
											<div
												className='notes'
												id='updateMessage'
												style={{ display: `none`, paddingBottom: '15px' }}
											>
												Updated Successfully!
											</div>
											{
												<Button
													onClick={handleUpdateClick}
													variant='contained'
													color='secondary'
													size='large'
												>
													Update
												</Button>
											}
										</div>
									</div>

									<div className='gray-box-text text-justify'>
										<p style={{ fontSize: '.9rem' }}>
											If you feel that you do not have the ability to provide a
											suitable reference, please decline. <br />
											<br />
											Provision of the information requested by Credibled is
											voluntary. We will use your information for the following
											purpose(s):
											<br />
											<br />
											<li>
												The information is being collected to provide
												clarification, confirmation and additional information
												on the candidate who has selected you as a reference. It
												assists the Employer in their hiring process.
											</li>
											<br />
											References to an Employer also include references to a
											recruitment agent where a recruiter has requested the
											reference on behalf of an Employer.
											<br />
											<br />
											Authority to collect information contained on this form
											the purposes described above is provided under the
											authority of the Employment and Social Development Canada
											Act. Your personal information is administered under the
											federal
											<i>
												<a
													href='https://laws-lois.justice.gc.ca/eng/acts/P-21/index.html'
													target='_new'
												>
													{' '}
													Privacy Act
												</a>
											</i>
											, which states that you have the right to access your
											personal information and request changes to incorrect
											information. If you wish to avail yourself of this right
											or require clarification about this Statement, contact our
											Privacy Coordinator by calling 855-583-7873, or write to:
											<br />
											<br />
											<strong>Privacy Coordinator</strong>
											<br />
											<strong>Credibled</strong>
											<br />
											391 Keele Street <br /> Toronto, ON <br />
											M6P 2K9
											<br />
											<br />
											The information collected by Credibled will be retained
											indefinitely. <br />
											<br />
											Credibled protects the personal information it has control
											over by making reasonable security arrangements to prevent
											unauthorised access, collection, use, disclosure, copying,
											modification, disposal or similar risks. <br />
											<br />
											Your personal information may be accessed by the
											candidate’s potential Employer who requested the reference
											and/or our service providers (as the case may be), and/or
											stored at, a destination outside the country in which you
											are located, whose data protection laws may be different
											than those in your country. The Employer’s processing of
											such personal information will be subject to the privacy
											policy of the Employer. We take our responsibility to
											safeguard your personal information, as required by the
											<i>Privacy Act</i>, very seriously.
										</p>
									</div>
									<form onSubmit={acceptClicked}>
										<FormGroup>
											<FormControlLabel
												required
												control={<Checkbox required />}
												label={
													<strong className='text-black'>
														My details are correct and I agree to the Credibled
														collection statement.
													</strong>
												}
											/>
										</FormGroup>
										<br />
										<Button
											type='submit'
											variant='contained'
											color='secondary'
											size='large'
										>
											Accept & Continue
										</Button>
									</form>
								</div>
							</div>
							<div className='clearfix'></div>
						</div>
					</div>
				</div>
			</div>

			<div
				className='modal fade'
				id='rate_experience1'
				tabIndex={-1}
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'
			>
				<div
					className='modal-dialog'
					role='document'
				>
					<div className='modal-content'>
						<div className='modal-header border-none'>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'
							>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body text-center'>
							<div className='row'>
								<div className='col'>
									<h4 className='text-primary'>
										Out of 5 stars, how would you rate your experience of
										providing a reference using Credibled?
									</h4>

									<p className='pt2'>
										<i className='text-secondary fs2em material-icons'>star</i>
										<i className='text-secondary fs2em material-icons'>star</i>
										<i className='text-secondary fs2em material-icons'>star</i>
										<i className='text-secondary fs2em material-icons'>
											star_outline
										</i>
										<i className='text-secondary fs2em material-icons'>
											star_outline
										</i>
									</p>

									<div className='box-pad'>
										<a
											href='credibled_candidate_job_history5.html'
											className='btn btn-primary'
										>
											Submit
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RefereeBegin;

const response = {
	uuid: '68f0c2a7-d829-4a7d-9a54-bd245cd9f4eb',
	created_at: '2023-04-14T23:01:07.372869Z',
	updated_at: '2023-04-14T23:02:29.049023Z',
	organization: 'google',
	refereeFirstName: 'h',
	refereeLastName: 'a',
	refereeEmail: 'mohamed+h@credibled.com',
	refereePhoneCode: null,
	refereePhone: '+1 232 323 2322',
	refereeJobTitle: 'manager',
};

export type RefereeInfo = typeof response;
