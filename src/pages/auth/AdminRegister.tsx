import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { CheckEmail, RegisterClient } from '../../apis';
import logo from '../../assets/img/credibled_logo_205x45.png';
import stateJSON from '../../assets/json/state.json';
import { AcceptedCountries } from '../../Common';
import PhoneInput from '../../components/PhoneNumberInput';

function AdminRegister() {
	const patternNum = /[0-9]/;
	let patternOthers = /[A-Za-z]/;
	const [token] = useCookies(['credtoken']);
	const [countryList, setCountryList] = useState<any[]>([]);
	const [stateList, setStateList] = useState([]);
	const [showPass, setShowPass] = useState(false);
	const navigate = useNavigate();
	const [status, setStatus] = useState(false);
	const [isSignUpNxtView, setIsSignUpNxtView] = useState(false);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [State, setState] = useState('');
	const [country, setCountry] = useState<AcceptedCountries | ''>('');
	const [Organization, setOrganization] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [NoOfStaff, setNoOfStaff] = useState('');
	const [Email, setEmail] = useState('');
	const [isChecked, setIsChecked] = useState(false);

	const handlePhoneNumberChange = (value: string) => {
		document.getElementById('phone-field')!.classList.remove('error-field');
		const currentPhoneNumberLength = value
			?.split?.(' ')
			?.slice?.(1)
			?.join('')?.length;
		if (currentPhoneNumberLength && currentPhoneNumberLength > 14) return;
		return setPhoneNumber(value);
	};

	const EMAIL_REGEX =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const SPECIAL_REGEX = /[0-9^`~!@#$%^&*()+=_}{"':?><|,./;|\]\\"["]/;
	const SPECIAL_REGEX_ORG = /[`~!@#$%^&()+=_}{"':?><|/;|\]\\"["]/;
	useEffect(() => {
		if (token['credtoken']) window.location.href = '/';
		setCountryList(() => {
			const usaCanada: (typeof stateJSON)[number][] = [];
			const countries = stateJSON.filter(val => {
				if (val.country === 'United States' || val.country === 'Canada') {
					usaCanada.push(val);
					return false;
				}
				return true;
			});
			return [...usaCanada, ...countries];
		});
		if (document.getElementById('btnCreateAccount')) {
			(
				document.getElementById('btnCreateAccount') as HTMLButtonElement
			).disabled = true;
		}
	}, [token]);

	const signUpClicked = async () => {
		let text = firstName + lastName;

		let result = patternNum.test(text);
		let result2 = patternOthers.test(text);
		if (firstName === '') {
			const x = document.getElementById('firstNameError')!;
			x.style.display = 'block';
			document.getElementById('first-name')!.classList.add('error-field');
			return false;
		}
		if (lastName === '') {
			const x = document.getElementById('lastNameError')!;
			x.style.display = 'block';
			document.getElementById('last-name')!.classList.add('error-field');
			return false;
		}
		if (firstName.length < 2 && lastName.length < 2 && result === false) {
			const x = document.getElementById('lengthError')!;
			x.style.display = 'block';
			document.getElementById('first-name')!.classList.add('error-field');
			document.getElementById('last-name')!.classList.add('error-field');
			return false;
		}

		if (result === true) {
			const x = document.getElementById('numberError')!;
			x.style.display = 'block';
			document.getElementById('first-name')!.classList.add('error-field');
			return false;
		}
		if (result2 === false) {
			const x = document.getElementById('numberError')!;
			x.style.display = 'block';
			return false;
		}

		if (country.length === 0) {
			const x = document.getElementById('countryError');
			x!.style.display = 'block';
			document.getElementById('selectCountry')!.classList.add('error-field');
			return false;
		}
		if (State === '') {
			const x = document.getElementById('stateError');
			x!.style.display = 'block';
			document.getElementById('selectState')!.classList.add('error-field');
			return false;
		}
		if (Email === '') {
			const x = document.getElementById('emailError');
			x!.style.display = 'block';
			document.getElementById('email-field')!.classList.add('error-field');
			return false;
		}
		if (Email) {
			if (!Email.match(EMAIL_REGEX)) {
				const x = document.getElementById('invalidEmailError');
				x!.style.display = 'block';
				document.getElementById('email-field')!.classList.add('error-field');
				return false;
			}
		}
		setStatus(true);
		try {
			const resp = await CheckEmail(Email);
			setStatus(false);
			if (resp.status === 400) {
				setIsSignUpNxtView(true);
			} else {
				const x = document.getElementById('userExistsError');
				x!.style.display = 'block';
				return false;
			}
		} catch (e) {
			setStatus(false);
		}
	};

	const createUser = async () => {
		if (status) return;
		if (Organization === '' || Organization.length < 2) {
			const x = document.getElementById('orgError');
			document
				.getElementById('organization-field')!
				.classList.add('error-field');
			x!.style.display = 'block';
			return false;
		}

		if (NoOfStaff === '') {
			const x = document.getElementById('noOfStaffError');
			x!.style.display = 'block';
			document.getElementById('select-number')!.classList.add('error-field');
			return false;
		}
		if (/[0-9]{4}/.test(phoneNumber) !== true) {
			const x = document.getElementById('phnNumError');
			x!.style.display = 'block';
			document.getElementById('phone-field')!.classList.add('error-field');
			return false;
		}

		if (
			/[(][0]{3}[)][" "][0]{3}[-][0]{4}/.test(phoneNumber) ||
			/[(][1]{3}[)][" "][1]{3}[-][1]{4}/.test(phoneNumber) ||
			/[(][2]{3}[)][" "][2]{3}[-][2]{4}/.test(phoneNumber) ||
			/[(][3]{3}[)][" "][3]{3}[-][3]{4}/.test(phoneNumber) ||
			/[(][4]{3}[)][" "][4]{3}[-][4]{4}/.test(phoneNumber) ||
			/[(][5]{3}[)][" "][5]{3}[-][5]{4}/.test(phoneNumber) ||
			/[(][6]{3}[)][" "][6]{3}[-][6]{4}/.test(phoneNumber) ||
			/[(][7]{3}[)][" "][7]{3}[-][7]{4}/.test(phoneNumber) ||
			/[(][8]{3}[)][" "][8]{3}[-][8]{4}/.test(phoneNumber) ||
			/[(][9]{3}[)][" "][9]{3}[-][9]{4}/.test(phoneNumber)
		) {
			const x = document.getElementById('phnNumErrorInvalid');
			x!.style.display = 'block';
			document.getElementById('phone-field')!.classList.add('error-field');
			return false;
		}

		if (password.length < 6) {
			const x = document.getElementById('pwdError');
			x!.style.display = 'block';
			document
				.getElementById('password-field')!
				.classList.remove('error-field');
			return false;
		}
		try {
			setStatus(true);
			const resp = await RegisterClient({
				email: Email,
				username: username,
				password: password,
				firstName: firstName,
				lastName: lastName,
				country: country,
				state: State,
				organization: Organization,
				noOfStaff: NoOfStaff,
				phoneNumber: phoneNumber,
				phoneCode: phoneNumber?.split?.(' ')?.[0],
			});

			setStatus(false);
			if (resp.status === 201) {
				navigate('/reverify-email', {
					state: {
						header: 'Successfully Registered',
						message: 'We have sent you a confirmation email.',
						message1: 'Please check your email.',
						email: Email,
					},
				});
			}
		} catch (e) {
			setStatus(false);
		}
	};

	const renderState = (country: string) => {
		for (let i = 0; i < countryList.length; i++) {
			if (countryList[i].country === country) {
				setStateList(countryList[i].states);
			}
		}
		setState('');
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
				<div className='container-fluid'>
					<div className='row justify-content-center align-items-center mt-4'>
						<div className='col-sm-6 col-md-6 col-lg-4'>
							<div className='text-center'>
								<a
									className='navbar-brand'
									href='/signin'
								>
									<img
										src={logo}
										alt='Credibled Logo'
										style={{ height: '43px' }}
									/>
								</a>
								<h4>Admin Registration</h4>
							</div>

							<div className='card'>
								<div className='card-body box-pad'>
									{isSignUpNxtView ? (
										<div className='row'>
											<div className='col-md-12'>
												<h5>A few final details</h5>
												<div className='row'>
													<div className='col-md-12'>
														<div className='form-group'>
															<label className='bmd-label-floating'>
																Organization
																<span className='sup_char'>
																	<sup>*</sup>
																</span>
															</label>
															<input
																id='organization-field'
																autoComplete='new-password'
																type='text'
																value={Organization}
																onChange={evt => {
																	if (
																		SPECIAL_REGEX_ORG.test(evt.target.value) ===
																		false
																	) {
																		setOrganization(evt.target.value);
																		const x =
																			document.getElementById('orgError');
																		x!.style.display = 'none';
																		const y =
																			document.getElementById(
																				'orgErrorInvalid'
																			);
																		y!.style.display = 'none';
																		document
																			.getElementById('organization-field')!
																			.classList.remove('error-field');
																	} else {
																		const x =
																			document.getElementById(
																				'orgErrorInvalid'
																			);
																		x!.style.display = 'block';
																	}
																}}
																className='form-control'
																maxLength={50}
															/>
															<div
																className='notes'
																id='orgError'
																style={{ display: `none` }}
															>
																Organization is required
															</div>
															<div
																className='notes'
																id='orgErrorInvalid'
																style={{ display: `none` }}
															>
																Special characters/numbers not allowed in
																company name
															</div>
														</div>
													</div>
													<div className='col-md-12'>
														<div className='form-group'>
															<label className='bmd-label-floating'>
																Number of employees
																<span className='sup_char'>
																	<sup>*</sup>
																</span>
															</label>
															<div className='form-group'>
																<select
																	id='select-number'
																	className='form-control select-top'
																	value={NoOfStaff}
																	onChange={evt => {
																		setNoOfStaff(evt.target.value);
																		const x =
																			document.getElementById('noOfStaffError');
																		x!.style.display = 'none';
																		document
																			.getElementById('select-number')!
																			.classList.remove('error-field');
																	}}
																>
																	<option value=''>Select</option>
																	<option>1-20</option>
																	<option>21-100</option>
																	<option>101-500</option>
																	<option>501-1000</option>
																	<option>1001-5000</option>
																	<option>5001-10000</option>
																	<option>10000+</option>
																</select>
																<div
																	className='notes'
																	id='noOfStaffError'
																	style={{ display: `none` }}
																>
																	Please enter the staff number
																</div>
																<span className='fa fa-fw fa-angle-down field_icon eye'></span>
															</div>
														</div>
													</div>
												</div>

												<div className='row'>
													<div className='col-md-12'>
														<div className='form-group'>
															<PhoneInput
																{...{
																	phoneNumber,
																	handlePhoneNumberChange,
																	defaultCountry: country as AcceptedCountries,
																}}
															/>
															<div
																className='notes'
																id='phnNumError'
																style={{ display: `none` }}
															>
																Phone number is required
															</div>
															<div
																className='notes'
																id='phnNumErrorInvalid'
																style={{ display: `none` }}
															>
																Phone number is Invalid
															</div>
														</div>
													</div>

													<div className='col-md-12'>
														<div className='form-group'>
															<label className='bmd-label-floating'>
																Password
																<span className='sup_char'>
																	<sup>*</sup>
																</span>
															</label>
															<input
																id='password-field'
																type={showPass ? 'text' : 'password'}
																value={password}
																onChange={evt => {
																	setPassword(evt.target.value);
																	const x = document.getElementById('pwdError');
																	x!.style.display = 'none';
																	document
																		.getElementById('password-field')!
																		.classList.remove('error-field');
																}}
																className='form-control'
																maxLength={30}
																autoComplete='new-password'
															/>
															{password ? (
																<>
																	{showPass ? (
																		<AiOutlineEye
																			style={{
																				position: 'absolute',
																				marginTop: '-27px',
																				marginLeft: '90%',
																			}}
																			onClick={() => setShowPass(false)}
																			size={20}
																			color='black'
																		/>
																	) : (
																		<AiOutlineEyeInvisible
																			style={{
																				position: 'absolute',
																				marginTop: '-27px',
																				marginLeft: '90%',
																			}}
																			onClick={() => setShowPass(true)}
																			size={20}
																			color='black'
																		/>
																	)}
																</>
															) : null}
															<div
																className='notes'
																id='pwdError'
																style={{ display: `none` }}
															>
																Password should be at least 6 characters !
															</div>
														</div>
													</div>

													<div className='col-md-12 pb2 text-center'>
														<div className='form-check box-pad'>
															<label className=''>
																<input
																	id='checkBoxReview'
																	type='checkbox'
																	onChange={e => {
																		setIsChecked(e?.target?.checked);
																	}}
																	checked={isChecked}
																/>
																&nbsp; I have reviewed and agree to the{' '}
																<a
																	href='/terms-and-conditions'
																	target='_new'
																>
																	Terms and Conditions
																</a>
															</label>
														</div>

														<br />
														<div
															className='notes'
															id='checkboxError'
															style={{ display: `none` }}
														>
															Please accept the terms
														</div>

														<button
															id='btnCreateAccount'
															className='btn btn-primary'
															onClick={createUser}
														>
															Create Account
														</button>
														<br />
														<a
															href='#!'
															onClick={() => setIsSignUpNxtView(false)}
														>
															Previous
														</a>
													</div>
												</div>
											</div>
											<div className='clearfix'></div>
										</div>
									) : (
										<div className='row'>
											<div className='col-md-12'>
												<div className='row'>
													<div className='col-md-6'>
														<div className='form-group mt3'>
															<label className='bmd-label-floating'>
																First Name
																<span className='sup_char'>
																	<sup>*</sup>
																</span>
															</label>
															<input
																id='first-name'
																autoComplete='new-password'
																type='text'
																value={firstName}
																onChange={evt => {
																	if (
																		SPECIAL_REGEX.test(evt.target.value) ===
																		false
																	) {
																		setFirstName(evt.target.value);
																		const x =
																			document.getElementById('numberError');
																		x!.style.display = 'none';
																		const y =
																			document.getElementById('firstNameError');
																		y!.style.display = 'none';
																		// lengthError
																		const z =
																			document.getElementById('lengthError');
																		z!.style.display = 'none';
																		document
																			.getElementById('first-name')!
																			.classList.remove('error-field');
																	} else {
																		const x =
																			document.getElementById('numberError');
																		x!.style.display = 'block';
																	}
																}}
																className='form-control'
																maxLength={40}
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
																id='lengthError'
																style={{ display: `none` }}
															>
																Please enter full name
															</div>
															<div
																className='notes'
																id='numberError'
																style={{ display: `none` }}
															>
																Special chars/numbers not allowed
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
														<div
															className='form-group mt3'
															autoCorrect='new-password'
														>
															<label className='bmd-label-floating'>
																Last Name
																<span className='sup_char'>
																	<sup>*</sup>
																</span>
															</label>
															<input
																id='last-name'
																type='text'
																value={lastName}
																onChange={evt => {
																	if (
																		SPECIAL_REGEX.test(evt.target.value) ===
																		false
																	) {
																		setLastName(evt.target.value);
																		const x = document.getElementById(
																			'lastNameErrorInvalid'
																		);
																		x!.style.display = 'none';
																		const y =
																			document.getElementById('lastNameError');
																		y!.style.display = 'none';
																		document
																			.getElementById('last-name')!
																			.classList.remove('error-field');
																	} else {
																		const x = document.getElementById(
																			'lastNameErrorInvalid'
																		);
																		x!.style.display = 'block';
																	}
																}}
																className='form-control'
																maxLength={40}
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
																special chars/numbers not allowed
															</div>
														</div>
													</div>
												</div>

												<div className='row'>
													<div className='col-md-6'>
														<label className='label-static'>
															Country
															<span className='sup_char'>
																<sup>*</sup>
															</span>
														</label>
														<div className='form-group'>
															<select
																className='form-control select-top'
																id='selectCountry'
																name='selectCountry'
																value={country}
																onChange={evt => {
																	setCountry(
																		evt.target.value as AcceptedCountries
																	);
																	renderState(evt.target.value);
																	const x =
																		document.getElementById('countryError');
																	x!.style.display = 'none';
																	document
																		.getElementById('selectCountry')!
																		.classList.remove('error-field');
																}}
															>
																<option value=''>Select Country</option>
																{countryList.map(localState => (
																	<option key={localState.country}>
																		{localState.country}
																	</option>
																))}
															</select>

															<span className='fa fa-fw fa-angle-down field_icon eye'></span>
															<div
																className='notes'
																id='countryError'
																style={{ display: `none` }}
															>
																Country is required
															</div>
														</div>
													</div>

													<div className='col-md-6'>
														<label className='label-static'>
															State/Province
															<span className='sup_char'>
																<sup>*</sup>
															</span>
														</label>
														<div className='form-group'>
															<select
																id='selectState'
																className='form-control select-top'
																value={State}
																onChange={evt => {
																	setState(evt.target.value);
																	const x =
																		document.getElementById('stateError');
																	x!.style.display = 'none';
																	document
																		.getElementById('selectState')!
																		.classList.remove('error-field');
																}}
															>
																<option value=''>Select State/Province</option>
																{stateList.map(localState => (
																	<option key={localState}>{localState}</option>
																))}
															</select>
															<span className='fa fa-fw fa-angle-down field_icon eye'></span>
															<div
																className='notes'
																id='stateError'
																style={{ display: `none` }}
															>
																State/Province is required
															</div>
														</div>
													</div>
												</div>
												<div className='row'>
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
																autoComplete='new-password'
																type='email'
																value={Email}
																onChange={evt => {
																	setEmail(evt.target.value);
																	setUsername(evt.target.value);
																	const x =
																		document.getElementById('emailError');
																	x!.style.display = 'none';
																	const y =
																		document.getElementById(
																			'invalidEmailError'
																		);
																	y!.style.display = 'none';
																	const z =
																		document.getElementById('userExistsError');
																	z!.style.display = 'none';
																	document
																		.getElementById('email-field')!
																		.classList.remove('error-field');
																}}
																className='form-control'
															/>
															<div
																className='notes'
																id='emailError'
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
																id='userExistsError'
																style={{ display: `none` }}
															>
																User already registered. Please use another
																email address
															</div>
														</div>
													</div>
												</div>
												<div className='col-md-12 pb2 text-center'>
													<button
														className='btn btn-primary mt2 outline-focus'
														onClick={signUpClicked}
														disabled={status}
													>
														Save {`&`} Next
													</button>
													<div className='box-pad'>
														Already Registered ?{'  '}
														<Link
															to='/admin/login'
															className='text-nowrap'
														>
															Admin Login
														</Link>
														<br />
														or
														<br />
														<Link to='/signin'>Login as User</Link>
													</div>
													<div className='clearfix'></div>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminRegister;
