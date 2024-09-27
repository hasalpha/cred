import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Login, ReverifyEmail } from '../../apis';
import logo from '../../assets/img/credibled_logo_205x45.png';
import { AuthContext } from '../../contexts';
import setAuthorizationBearerToken from '../../apis/user.api';
import { LoadingButton } from '@mui/lab';

export const ERRORINPUTCLASS = 'error-field';

export function parseBackgroundCheck(option: 'true' | 'false') {
	return option.toLowerCase() === 'true' ? true : false;
}

function SignIn() {
	const { setRefreshToken, setType, setIsBackgroundCheck } =
		useContext(AuthContext)!;
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPass, setShowPass] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { state } = useLocation();
	let redirectURL: null | string = null;
	if (!!state && typeof state === 'object' && 'redirectURL' in state) {
		redirectURL = state.redirectURL as string;
	}

	const EMAIL_REGEX =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	useEffect(() => {
		if (Cookies.get('refresh')) return navigate('../home');
	}, [navigate]);

	const signInClicked = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (loading) return;
		(document.querySelectorAll('.notes') as NodeListOf<HTMLElement>).forEach(
			item => {
				item.style.display = 'none';
			}
		);
		if (navigator.onLine === false) {
			alert('Your device is offline, Please check connectivity');
		}
		if (username === '') {
			let x = document.getElementById('emailErrorMsg')!;
			document.getElementById('email-field')!.classList.add(ERRORINPUTCLASS);
			x.style.display = 'block';
			return false;
		}
		if (username) {
			if (!username.match(EMAIL_REGEX)) {
				let x = document.getElementById('emailInvalidMsg')!;
				x.style.display = 'block';
				return false;
			}
		}
		if (password.length < 6) {
			let x = document.getElementById('pwdErrorMsg')!;
			x.style.display = 'block';
			document.getElementById('password-field')!.classList.add(ERRORINPUTCLASS);
			return false;
		}
		try {
			setLoading(true);
			const resp = await Login({ email: username, password: password });
			if (resp.status === 200) {
				const data = resp.data;
				const isBackgroundCheck = parseBackgroundCheck(
					data?.is_background_check
				);
				setRefreshToken(data.tokens.refresh);
				Cookies.set('refresh', data.tokens.refresh);
				Cookies.set('access', data.tokens.access);
				Cookies.set('type', 'user');
				Cookies.set('userType', data.type);
				Cookies.set('isBackgroundCheck', '' + isBackgroundCheck);
				setType('user');
				setIsBackgroundCheck(isBackgroundCheck);
				if (window.location.protocol === 'https:')
					axios
						.get('https://geolocation-db.com/json/')
						.then(response => {
							const datas = response.data;
							localStorage.setItem('countryCode', datas.country_code);
							localStorage.setItem('cityName', datas.city);
							localStorage.setItem('countryName', datas.country_name);
						})
						.catch(error => {
							console.log(error);
						});
				localStorage.setItem('email', data.email);
				localStorage.setItem('id', data.moreId);
				localStorage.setItem('access', data.tokens.access);
				localStorage.setItem('firstName', data.firstName);
				localStorage.setItem('userName', data.username);
				localStorage.setItem('companyName', data.oraganization);
				localStorage.setItem('is_sms_allow', data.is_sms_allow);
				setLoading(false);
				setAuthorizationBearerToken();
				return redirectURL
					? navigate(redirectURL)
					: navigate('../home/add-new-request');
			} else if (resp.status === 406) {
				const z = document.getElementById('accessDenied')!;
				z.style.display = 'block';
				return setLoading(false);
			} else if (
				resp.status === 401 &&
				resp?.data?.detail?.includes('not verified')
			) {
				const z = document.getElementById('emailConfirmErrorMsg')!;
				z.style.display = 'block';
				await ReverifyEmail(username);
				navigate('../reverify-email', {
					state: {
						header: 'Email Verification',
						message:
							'We sent you a confirmation email, please check you email !',
						email: username,
					},
				});
				return false;
			} else if (resp.status === 500) {
				const z = document.getElementById('loginErrorUserNot')!;
				z.style.display = 'block';
				return setLoading(false);
			} else {
				if (resp?.data?.detail?.includes('not verified')) {
					document.getElementById('unverifiedErrorMsg')!.style.display =
						'block';
					return setLoading(false);
				}
				const z = document.getElementById('loginErrorMsg')!;
				z.style.display = 'block';
				return setLoading(false);
			}
		} catch (e) {
			console.log(e);
		}
		setLoading(false);
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
				<div className='container-fluid'>
					<div className='row justify-content-center align-items-center mt-4'>
						<div className='col-sm-6 col-md-6 col-lg-4'>
							<div className='text-center'>
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
								<h4>Sign In</h4>
							</div>
							<div className='card'>
								<div className='card-body'>
									<form onSubmit={signInClicked}>
										<div className='row'>
											<div className='col-md-12'>
												<div className='form-group mt3'>
													<label className='bmd-label-floating'>
														Email Address
														<span className='sup_char'>
															<sup>*</sup>
														</span>
													</label>
													<input
														id='email-field'
														type='email'
														value={username}
														onChange={evt => {
															if (
																/[<>{}=*&^%$#`~|';:!"]/.test(
																	evt.target.value
																) === false
															) {
																setUsername(evt.target.value.trim());
															}
															const x =
																document.getElementById('emailErrorMsg')!;
															x.style.display = 'none';
															document
																.getElementById('email-field')!
																.classList.remove(ERRORINPUTCLASS);
															const y =
																document.getElementById('emailInvalidMsg')!;
															y.style.display = 'none';
															const z =
																document.getElementById('loginErrorMsg')!;
															z.style.display = 'none';
															const u = document.getElementById(
																'emailConfirmErrorMsg'
															)!;
															u.style.display = 'none';
														}}
														className='form-control'
													/>
													<div
														className='notes'
														id='emailErrorMsg'
														style={{ display: `none` }}
													>
														Email address is required
													</div>
													<div
														className='notes'
														id='emailInvalidMsg'
														style={{ display: `none` }}
													>
														Invalid Email address
													</div>
												</div>

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
															setPassword(evt.target.value.trim());
															const x = document.getElementById('pwdErrorMsg')!;
															x.style.display = 'none';
															document
																.getElementById('password-field')!
																.classList.remove(ERRORINPUTCLASS);
															const y =
																document.getElementById('loginErrorMsg')!;
															y.style.display = 'none';
															const z = document.getElementById(
																'emailConfirmErrorMsg'
															)!;
															z.style.display = 'none';
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
																		marginLeft: '93%',
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
																		marginLeft: '93%',
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
														id='pwdErrorMsg'
														style={{ display: `none` }}
													>
														Password should be at least 6 characters !
													</div>
													<div
														className='notes'
														id='loginErrorMsg'
														style={{ display: `none` }}
													>
														Invalid Password
													</div>
													<div
														className='notes'
														id='unverifiedErrorMsg'
														style={{ display: `none` }}
													>
														Please verify your email before logging in
													</div>
													<div
														className='notes'
														id='emailConfirmErrorMsg'
														style={{ display: `none` }}
													>
														Email confirmation required to Signin
													</div>
													<div
														className='notes'
														id='loginErrorUserNot'
														style={{ display: `none` }}
													>
														User doesn't exist. Please sign Up or use another
														email address
													</div>

													<div
														className='notes'
														id='accessDenied'
														style={{ display: `none` }}
													>
														Your account is not Active, Contact admin
													</div>
												</div>

												<div className='text-center'>
													<LoadingButton
														type='submit'
														loading={loading}
														color='secondary'
														variant='contained'
														size='large'
													>
														Sign In
													</LoadingButton>
													<div className='clearfix'></div>

													<div className='box-pad'>
														<Link to='/forgot-password'>Forgot Password?</Link>
														<br />
														or
														<br />
														Login as <Link to='/admin/login'>Admin</Link>
													</div>
												</div>
											</div>
										</div>
										<div className='clearfix'></div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default SignIn;
