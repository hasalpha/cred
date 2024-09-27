import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	// CheckEmail,
	ForgetPassword,
	ReverifyEmail,
} from '../../apis';
import logo from '../../assets/img/credibled_logo_205x45.png';
function ReVerifyEmail() {
	const navigate = useNavigate();
	const props = useLocation().state;
	const [sec, setSec] = useState(30);
	const [msg, setMsg] = useState('');
	const [status, setStatus] = useState(false);

	useEffect(() => {
		if (!props?.email) navigate('/');
		const timer = setInterval(async () => {
			setSec(sec => {
				return sec > 0 ? sec - 1 : 0;
			});
		}, 1000);
		return () => {
			clearInterval(timer);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleResendEmail = async () => {
		if (status) return;
		if (sec > 0) return false;
		setStatus(true);
		if (
			props?.header?.toLowerCase()?.includes('email') ||
			props?.header?.toLowerCase()?.includes('successfully registered')
		) {
			const resp = await ReverifyEmail(props.email);
			setStatus(false);
			if (resp.status === 201) {
				setMsg('Email Sent Successfully !');
				setSec(30);
				navigate('/reverify-email', {
					state: {
						header: 'Email Verification',
						message: 'We have sent you a confirmation email.',
						message1: 'Please check your email.',
						email: props.email,
					},
				});
			}
			if (resp.status === 401) {
				navigate('/success', {
					state: {
						header: 'Already Verified',
						message:
							'Your email is already verified, please continue to Sign In.',
					},
					replace: true,
				});
			}
		} else {
			const resp = await ForgetPassword({
				email: props.email,
				redirect_url: `${import.meta.env.VITE_WEB_URL}/reset-password`,
			});
			setStatus(false);
			if (resp.status === 200) {
				navigate('/reverify-email', {
					state: {
						header: 'Reset Password',
						message: 'We have sent you a link to reset your password.',
						message1: 'Please check you email.',
						email: props.email,
					},
				});
			}
			if (resp.status === 200) {
				setMsg('Email Sent Successfully !');
				setSec(30);
			} else if (resp.status === 208) {
				navigate('/success', {
					state: {
						header: 'Already Verified',
						message:
							'Your email is already verified, please continue to Sign In.',
					},
					replace: true,
				});
			}
		}
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
									href='/'
									onClick={e => {
										e.preventDefault();
										navigate('/');
									}}
								>
									<img
										src={logo}
										alt='Credibled Logo'
										className='credibled-logo'
									/>
								</a>
								<h4>{props?.header}</h4>
							</div>
							<div className='card'>
								<div className='card-body'>
									{/* <form> */}
									<div className='row'>
										<div className='col-md-12'>
											<div className='form-group mt3'>
												<p style={{ textAlign: 'center' }}>
													{props?.message} <br />
													{props?.message1}
												</p>
											</div>
											<div className='text-center'>
												<button
													className={`btn btn-primary ${
														sec > 0 ? 'disabled' : null
													}`}
													id='resend'
													onClick={() => handleResendEmail()}
													disabled={status}
												>
													Resend
												</button>
												{msg ? (
													<div
														style={{
															color: 'blueviolet',
															fontWeight: 'bold',
															fontSize: 15,
														}}
														className='box-pad'
													>
														{msg}
													</div>
												) : null}
												{sec ? (
													<p
														style={{ color: 'blueviolet' }}
														className='box-pad'
													>
														If you haven't received the email, click on the
														Resend button in{' '}
														{`${sec} ${sec > 1 ? 'seconds' : 'second'}`}
														<br />
													</p>
												) : (
													<></>
												)}
												<div className='clearfix'></div>
											</div>
										</div>
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

export default ReVerifyEmail;
