import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckEmail, ForgetPassword } from '../../apis';
import logo from '../../assets/img/credibled_logo_205x45.png';

function ForgotPassword() {
	const [username, setUsername] = useState('');
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const EMAIL_REGEX =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const resetPassword = async (e: React.FormEvent) => {
		if (loading) return;
		e.preventDefault();
		if (username === '') {
			const x = document.getElementById('emailErrorMsg');
			x!.style.display = 'block';
			return false;
		}

		if (username) {
			if (!username.match(EMAIL_REGEX)) {
				const x = document.getElementById('emailInvalidMsg');
				x!.style.display = 'block';
				return false;
			}
		}
		setLoading(true);
		try {
			const check = await CheckEmail(username);
			if (check.status === 400) {
				const x = document.getElementById('emailErrorMsgUser');
				x!.style.display = 'block';
				return setLoading(false);
			}
			if (check.status !== 200) {
				const x = document.getElementById('emailInvalidMsg');
				x!.style.display = 'block';
				return setLoading(false);
			}
			const resp = await ForgetPassword({
				email: username,
				redirect_url: `${import.meta.env.VITE_WEB_URL}/reset-password`,
			});
			if (resp.status === 200) {
				navigate('/reverify-email', {
					state: {
						header: 'Reset Password',
						message: 'We have sent you a link to reset your password.',
						message1: 'Please check you email.',
						email: username,
					},
				});
			}
		} catch (e) {
			setLoading(false);
		}
		setLoading(false);
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
					<div className='row justify-content-center align-item-center mt-4'>
						<div className='col-sm-6 col-md-6 col-lg-4'>
							<div className='text-center'>
								<a
									className='navbar-brand'
									href='/'
								>
									<img
										src={logo}
										alt='Credibled Logo'
										style={{ height: '43px' }}
									/>
								</a>
								<h4>Forgot Password</h4>
							</div>

							<div className='card'>
								<div className='card-body'>
									<div className='row'>
										<div className='col-md-12'>
											<form onSubmit={resetPassword}>
												<div className='form-group mt3'>
													<label className='bmd-label-floating'>
														Email address
														<span className='sup_char'>
															<sup>*</sup>
														</span>
													</label>
													<input
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
																document.getElementById('emailErrorMsg');
															const y =
																document.getElementById('emailInvalidMsg');
															const z =
																document.getElementById('emailErrorMsgUser');
															z!.style.display = 'none';
															x!.style.display = 'none';
															y!.style.display = 'none';
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
													<div
														className='notes'
														id='emailErrorMsgUser'
														style={{ display: `none` }}
													>
														User doesn't exist with this email address
													</div>
												</div>

												<div className='text-center'>
													<button
														type='submit'
														disabled={loading}
														className='btn btn-primary mt2'
													>
														Reset Password Link
													</button>
													<div className='clearfix'></div>
													<div className='box-pad'>
														<Link
															to='/signin'
															replace
														>
															Back To Login
														</Link>
														<br />
													</div>
												</div>
											</form>
										</div>
									</div>
									<div className='clearfix'></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ForgotPassword;
