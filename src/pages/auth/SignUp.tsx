import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { CheckEmail, Register } from '../../apis';
import logo from '../../assets/img/credibled_logo_205x45.png';
import stateJSON from '../../assets/json/state.json';
import PhoneInput from '../../components/PhoneNumberInput';
import { AuthContext } from '../../contexts';

function SignUp() {
	const { refreshToken } = useContext(AuthContext)!;
	const [token] = useCookies(['credtoken']);
	const [countryList, setCountryList] = useState<Array<Record<string, any>>>(
		[]
	);
	const [stateList, setStateList] = useState([]);
	const [showPass, setShowPass] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	if (refreshToken) {
		navigate('/home');
	}

	useEffect(() => {
		if (token['credtoken']) window.location.href = '/';
		setCountryList(stateJSON);
		if (document.getElementById('btnCreateAccount')) {
			(document.getElementById(
				'btnCreateAccount'
			) as HTMLInputElement)!.disabled = true;
		}
	}, [token]);

	const [isSignUpNxtView, setIsSignUpNxtView] = useState(false);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [State, setState] = useState('');
	const [Country, setCountry] = useState('');
	const [Organization, setOrganization] = useState('');
	const [PhoneNumber, setPhoneNumber] = useState('');
	const [NoOfStaff, setNoOfStaff] = useState('');
	const [Email, setEmail] = useState('');

	const EMAIL_REGEX =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const SPECIAL_REGEX_ORG = /[`~!@#$%^&()+=_}{"':?><|/;|\]\\"["]/;

	const handlePhoneNumberChange = (value: string) => {
		const currentPhoneNumberLength = value
			?.split?.(' ')
			?.slice?.(1)
			?.join('')?.length;
		if (currentPhoneNumberLength && currentPhoneNumberLength >= 14) return;
		return setPhoneNumber(value);
	};

	const checkBoxClicked = () => {
		if (
			(document.getElementById('checkBoxReview') as HTMLInputElement)!
				.checked === true
		) {
			(document.getElementById(
				'btnCreateAccount'
			) as HTMLInputElement)!.disabled = false;
		} else {
			(document.getElementById(
				'btnCreateAccount'
			) as HTMLInputElement)!.disabled = true;
		}
	};

	const signUpClicked = async () => {
		if (firstName === '') {
			const x = document.getElementById('firstNameError');
			x!.style.display = 'block';
			return false;
		}
		if (lastName === '') {
			const x = document.getElementById('lastNameError');
			x!.style.display = 'block';
			return false;
		}

		if (Country === '') {
			const x = document.getElementById('countryError');
			x!.style.display = 'block';
			return false;
		}
		if (State === '') {
			const x = document.getElementById('stateError');
			x!.style.display = 'block';
			return false;
		}
		if (Email === '') {
			const x = document.getElementById('emailError');
			x!.style.display = 'block';
			return false;
		}
		if (Email) {
			if (!Email.match(EMAIL_REGEX)) {
				const x = document.getElementById('invalidEmailError');
				x!.style.display = 'block';
				return false;
			}
		}
		try {
			const resp = await CheckEmail(Email);
			if (resp.status === 400) {
				setIsSignUpNxtView(true);
			} else {
				const x = document.getElementById('userExistsError');
				x!.style.display = 'block';
				return false;
			}
		} catch (e) {
			console.log(e);
		}
	};

	const createUser = async () => {
		if (Organization === '') {
			const x = document.getElementById('orgError');
			x!.style.display = 'block';
			return false;
		}
		if (PhoneNumber === '') {
			const x = document.getElementById('phnNumError');
			x!.style.display = 'block';
			return false;
		}
		if (password.length < 6) {
			const x = document.getElementById('pwdError');
			x!.style.display = 'block';
			return false;
		}
		setLoading(true);
		const resp = await Register({
			email: Email,
			username: username,
			password: password,
			firstName: firstName,
			lastName: lastName,
			Country: Country,
			State: State,
			Organization: Organization,
			NoOfStaff: NoOfStaff,
			PhoneNumber: PhoneNumber,
		});
		if (resp.status === 201) {
			navigate('/reverify-email', {
				state: {
					header: 'Successfully Registered',
					message:
						'We have sent you a confirmation email. Please check your email',
					email: Email,
				},
			});
		}
		setLoading(false);
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
				<div className='main-panel'>
					<div className='content'>
						<div className='container-fluid'>
							<div className='row'>
								<div className='col-md-5 offset-md-2'>
									<div className='text-center'>
										<a
											className='navbar-brand'
											href='/signin'
										>
											<img
												src={logo}
												alt='Credibled Logo'
												style={{ height: '43px' }}
												className='mob_logo'
											/>
										</a>
										<h4>Sign up</h4>
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
																		type='text'
																		value={Organization}
																		onChange={evt => {
																			if (
																				SPECIAL_REGEX_ORG.test(
																					evt.target.value
																				) === false
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
																			} else {
																				const x =
																					document.getElementById(
																						'orgErrorInvalid'
																					);
																				x!.style.display = 'block';
																			}
																		}}
																		className='form-control'
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
																		Invalid characters are not allowed
																	</div>
																</div>
															</div>
															<div className='col-md-12'>
																<div className='form-group'>
																	<label className='bmd-label-floating'>
																		Number of employees
																	</label>
																	<div className='form-group'>
																		<select
																			className='form-control select-top'
																			value={NoOfStaff}
																			onChange={evt => {
																				setNoOfStaff(evt.target.value);
																				// const x = document.getElementById(
																				//   "noOfStaffError"
																				// );
																				// x.style.display = "none";
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
																		<span className='fa fa-fw fa-angle-down field_icon eye'></span>
																	</div>
																</div>
															</div>
														</div>
														<div className='row'>
															<div className='col-md-6'>
																<div className='form-group'>
																	{/* <label className='bmd-label-floating'>
                                    Phone#
                                    <span className='sup_char'>
                                      <sup>*</sup>
                                    </span>
                                  </label> */}
																	{/* <input
                                    type="text"
                                    value={PhoneNumber}
                                    onChange={(evt) => {
                                      if (/^\d*$/.test(evt.target.value)) {
                                        setPhoneNumber(evt.target.value);
                                      }
                                      const x =
                                        document.getElementById("phnNumError");
                                      x.style.display = "none";
                                    }}
                                    className="form-control"
                                    maxlength="10"
                                  /> */}
																	{/* <NumberFormat
                                    className='form-control'
                                    format='(###) ###-####'
                                    value={PhoneNumber}
                                    onChange={evt => {
                                      setPhoneNumber(evt.target.value);

                                      const x =
                                        document.getElementById("phnNumError");
                                      x.style.display = "none";
                                    }}
                                  /> */}
																	<PhoneInput
																		{...{
																			phoneNumber: PhoneNumber,
																			handlePhoneNumberChange,
																			defaultCountry: 'Canada',
																		}}
																	/>
																	<div
																		className='notes'
																		id='phnNumError'
																		style={{ display: `none` }}
																	>
																		Phone# is required
																	</div>
																</div>
															</div>

															<div className='col-md-6'>
																<div className='form-group'>
																	<label className='bmd-label-floating'>
																		Password
																		<span className='sup_char'>
																			<sup>*</sup>
																		</span>
																	</label>
																	<input
																		type={showPass ? 'text' : 'password'}
																		value={password}
																		onChange={evt => {
																			setPassword(evt.target.value);
																			const x =
																				document.getElementById('pwdError');
																			x!.style.display = 'none';
																		}}
																		className='form-control'
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
																			onChange={checkBoxClicked}
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
																<button
																	id='btnCreateAccount'
																	className='btn btn-primary'
																	onClick={() => createUser()}
																	disabled={loading}
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
																		type='text'
																		value={firstName}
																		onChange={evt => {
																			setFirstName(evt.target.value);
																			const x =
																				document.getElementById(
																					'firstNameError'
																				);
																			x!.style.display = 'none';
																		}}
																		className='form-control'
																	/>
																	<div
																		className='notes'
																		id='firstNameError'
																		style={{ display: `none` }}
																	>
																		First Name is required
																	</div>
																</div>
															</div>
															<div className='col-md-6'>
																<div className='form-group mt3'>
																	<label className='bmd-label-floating'>
																		Last Name
																		<span className='sup_char'>
																			<sup>*</sup>
																		</span>
																	</label>
																	<input
																		type='text'
																		value={lastName}
																		onChange={evt => {
																			setLastName(evt.target.value);
																			const x =
																				document.getElementById(
																					'lastNameError'
																				);
																			x!.style.display = 'none';
																		}}
																		className='form-control'
																	/>
																	<div
																		className='notes'
																		id='lastNameError'
																		style={{ display: `none` }}
																	>
																		Last Name is required
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
																		value={Country}
																		onChange={evt => {
																			setCountry(evt.target.value);
																			renderState(evt.target.value);
																			const x =
																				document.getElementById('countryError');
																			x!.style.display = 'none';
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
																		className='form-control select-top'
																		value={State}
																		onChange={evt => {
																			setState(evt.target.value);
																			const x =
																				document.getElementById('stateError');
																			x!.style.display = 'none';
																		}}
																	>
																		<option value=''>Select State</option>
																		{stateList.map(localState => (
																			<option key={localState}>
																				{localState}
																			</option>
																		))}
																	</select>
																	<span className='fa fa-fw fa-angle-down field_icon eye'></span>
																	<div
																		className='notes'
																		id='stateError'
																		style={{ display: `none` }}
																	>
																		State is required
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
																		type='email'
																		value={Email}
																		// value={username}
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
																				document.getElementById(
																					'userExistsError'
																				);
																			z!.style.display = 'none';
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
																		User already registered
																	</div>
																</div>
															</div>
														</div>
														<div className='col-md-12 pb2 text-center'>
															<span
																className='btn btn-primary mt2'
																onClick={signUpClicked}
															>
																Sign up
															</span>
															<div className='box-pad'>
																Already have an account?{' '}
																<Link to='/signin'>Sign In!</Link>
																{/* <br />
                              or */}
															</div>
															<div className='clearfix'></div>
														</div>
													</div>
													<div className='clearfix'></div>
												</div>
											)}
										</div>
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

export default SignUp;
