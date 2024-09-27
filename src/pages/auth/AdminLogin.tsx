import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Api, CheckEmail, LoginAdmin } from '../../apis';
import logo from '../../assets/img/credibled_logo_205x45.png';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingButton } from '@mui/lab';

function AdminLogin() {
	const { setRefreshToken, setType } = useAuth()!;
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPass, setShowPass] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const EMAIL_REGEX =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	useEffect(() => {
		if (Cookies.get('refresh') && Cookies.get('type') === 'admin') {
			navigate('/admin/');
		}
	}, [navigate]);

	const signInClicked = async (e: React.FormEvent<HTMLFormElement>) => {
		delete Api.defaults.headers.common['Authorization'];
		if (loading) return;
		e.preventDefault();
		if (username === '') {
			const x = document.getElementById('emailErrorMsg')!;
			x.style.display = 'block';
			document.getElementById('email-field')!.classList.add('error-field');
			return false;
		}
		if (username) {
			if (!username.match(EMAIL_REGEX)) {
				const x = document.getElementById('emailInvalidMsg')!;
				x.style.display = 'block';
				document.getElementById('email-field')!.classList.add('error-field');
				return false;
			}
		}
		if (password.length < 6) {
			const x = document.getElementById('pwdErrorMsg')!;
			x.style.display = 'block';
			document.getElementById('password-field')!.classList.add('error-field');
			return false;
		}
		setLoading(true);
		try {
			const check = await CheckEmail(username);
			if (check.status !== 200) {
				const z = document.getElementById('loginErrorMsg')!;
				z.style.display = 'block';
				return setLoading(false);
			}
			const resp = await LoginAdmin({ email: username, password: password });
			if (resp.status === 200) {
				const data = resp.data;
				setRefreshToken(data.tokens.refresh);
				Cookies.set('refresh', data.tokens.refresh);
				Cookies.set('access', data.tokens.access);
				Cookies.set('userType', data.type);
				localStorage.setItem('email', data.email);
				setLoading(false);
				if (data.type === 'SuperAdmin') {
					setType('super-admin');
					Cookies.set('type', 'super-admin');
					return setTimeout(
						() => navigate('/super-admin/', { replace: true }),
						100
					);
				} else {
					setType('admin');
					Cookies.set('type', 'admin');
					localStorage.setItem('firstName', data.firstName);
					return setTimeout(
						() => navigate('/admin/users', { replace: true }),
						100
					);
				}
			} else if (resp.status === 401) {
				const z = document.getElementById('accessDenied')!;
				z.style.display = 'block';
				return setLoading(false);
			} else if (resp.status === 406) {
				const z = document.getElementById('accesssuspended')!;
				z.style.display = 'block';
				return setLoading(false);
			} else {
				const z = document.getElementById('loginErrorMsg')!;
				z.style.display = 'block';
				return setLoading(false);
			}
		} catch (e) {
			toast.error(e as any);
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
								<a
									className='navbar-brand'
									href='#!'
								>
									<img
										src={logo}
										alt='Credibled Logo'
										className='credibled-logo'
									/>
								</a>
								<h4>Admin Login</h4>
							</div>

							<div className='card'>
								<div className='card-body'>
									<form onSubmit={signInClicked}>
										<div className='row'>
											<div className='col-md-12'>
												<div className='form-group mt3'>
													<label className='bmd-label-floating'>
														Email address
														<span className='sup_char'>
															<sup>*</sup>
														</span>
													</label>
													<input
														id='email-field'
														type='email'
														value={username}
														onChange={evt => {
															setUsername(evt.target.value.trim());
															const x =
																document.getElementById('emailErrorMsg')!;
															x.style.display = 'none';
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
															document
																.getElementById('email-field')!
																.classList.remove('error-field');
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
																.classList.remove('error-field');
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
														Invalid login credentials
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
														id='accessDenied'
														style={{ display: `none` }}
													>
														You are not authorized to login as admin
													</div>
													<div
														className='notes'
														id='accesssuspended'
														style={{ display: `none` }}
													>
														Your account is not Active, Contact admin
													</div>
												</div>

												<div className='text-center'>
													<LoadingButton
														type='submit'
														loading={loading}
														size='large'
														variant='contained'
														color='secondary'
													>
														Sign in
													</LoadingButton>
													<div className='clearfix'></div>

													<div className='box-pad'>
														{document.location.host !== 'app.credibled.com' &&
															`Don't have an account?${' '}`}
														{document.location.host !== 'app.credibled.com' && (
															<Link
																to='/admin/register'
																className='text-nowrap'
															>
																Admin Registration
															</Link>
														)}
														<br />
														<Link to='/forgot-password'>Forgot Password?</Link>
														<br />
														<Link to='/signin'>Login as User</Link>
														{/* <br />
                              or */}
													</div>
													{/* 
                            <div className="social-buttons-demo pb2">
                              <button className="btn btn-social  btn-google">
                                <i className="fa fa-google"></i>&nbsp; Sign in
                                with Google
                              </button>
                              <br />
                              <button className="btn btn-social  btn-linkedin">
                                <i className="fa fa-linkedin"></i>&nbsp; Sign in
                                with LinkedIn
                              </button>
                            </div> */}
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

export default AdminLogin;
