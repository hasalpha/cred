import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { PasswordReset } from '../../apis';
import logo from '../../assets/img/credibled_logo_205x45.png';

import PasswordChecklist from 'react-password-checklist';
import { toast } from 'react-toastify';

function ResetPassword() {
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [showPass, setShowPass] = useState(false);
	const [showCPass, setShowCPass] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	//NK-EDIT
	const [isPassValid, setIsPassValid] = useState<boolean>(false);

	useEffect(() => {
		if (Cookies.get('refresh')) {
			navigate('/home');
		}
	}, [navigate]);

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		// if (password.length < 6) {
		// 	const x = document.getElementById('pwdErrorMsg');
		// 	x!.style.display = 'block';
		// 	return false;
		// }
		// if (password !== passwordConfirm) {
		// 	const w = document.getElementById('pwdNotMatch');
		// 	w!.style.display = 'block';
		// 	return false;
		// }

		if (!isPassValid) {
			toast.error(
				'Please ensure your password meets the required criteria. This is to ensure your account is secure!'
			);
		}

		// return false;

		setLoading(true);
		const params = new URLSearchParams(window.location.search);
		const valid = params.get('token_valid');
		const uidb64 = params.get('uidb64');
		const token = params.get('token');
		if (valid && uidb64 && token) {
			const result = await PasswordReset({
				password: password,
				token: token,
				uidb64: uidb64,
			});
			if (result.status === 200) {
				toast.success('Your password has been updated successfully.');
				navigate('/success', {
					state: {
						header: 'Successfully Changed Password',
						message: 'Your password has been successfully Changed.',
						message1: 'Please sign in.',
					},
					replace: true,
				});
			} else {
				navigate('/success', {
					state: {
						header: 'Link Expired',
						message:
							'Your password link is expired or you already changed your password.',
					},
				});
			}
		} else {
			navigate('/login');
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
				<div className='main-panel'>
					<div className='content'>
						<div className='container-fluid'>
							<div className='row'>
								<div className='col-md-4 offset-md-3'>
									<div className='text-center'>
										<a
											className='navbar-brand'
											href='#!'
										>
											<img
												src={logo}
												alt='Credibled Logo'
												style={{ height: '43px' }}
											/>
										</a>
										<h4>Reset Password</h4>
									</div>

									<div className='card'>
										<div className='card-body'>
											<form onSubmit={e => handleResetPassword(e)}>
												<div className='row'>
													<div className='col-md-12'>
														<div className='form-group mt3'>
															<label className='bmd-label-floating'>
																New Password
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
																		document.getElementById('pwdErrorMsg');
																	x!.style.display = 'none';
																	const y =
																		document.getElementById('pwdNotMatch');
																	y!.style.display = 'none';
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
														</div>
														<div className='form-group mt0'>
															<label className='bmd-label-floating'>
																Confirm Password
																<span className='sup_char'>
																	<sup>*</sup>
																</span>
															</label>
															<input
																type={showCPass ? 'text' : 'password'}
																value={passwordConfirm}
																onChange={evt => {
																	setPasswordConfirm(evt.target.value);
																	const x =
																		document.getElementById('pwdErrorMsg');
																	x!.style.display = 'none';
																	const y =
																		document.getElementById('pwdNotMatch');
																	y!.style.display = 'none';
																}}
																className='form-control'
															/>
															{passwordConfirm ? (
																<>
																	{showCPass ? (
																		<AiOutlineEye
																			style={{
																				position: 'absolute',
																				marginTop: '-27px',
																				marginLeft: '93%',
																			}}
																			onClick={() => setShowCPass(false)}
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
																			onClick={() => setShowCPass(true)}
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
																id='pwdNotMatch'
																style={{ display: `none` }}
															>
																Passwords do not match !
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
														</div>

														<PasswordChecklist
															className='mt-3'
															rules={[
																'minLength',
																'specialChar',
																'number',
																'capital',
																'lowercase',
																'match',
															]}
															minLength={6}
															value={password}
															valueAgain={passwordConfirm}
															onChange={isValid => {
																setIsPassValid(isValid);
															}}
														/>

														<div className='text-center'>
															<button
																className='btn btn-primary mt2'
																disabled={loading}
																type='submit'
															>
																Reset Password
															</button>
															<div className='clearfix'></div>
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
				</div>
			</div>
		</div>
	);
}

export default ResetPassword;
