import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/img/credibled_logo_205x45.png';

function AuthMessage() {
	const navigate = useNavigate();
	const props = useLocation().state;
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
											/>
										</a>
										<h4>{props?.header}</h4>
									</div>

									<div className='card'>
										<div className='card-body'>
											{/* <form> */}
											<div className='row'>
												<div className='col-md-12'>
													<div
														className='form-group mt3'
														style={{ width: '70%', margin: 'auto' }}
													>
														<p
															style={{
																padding: 20,
																border: 3,
																borderStyle: 'solid',
																borderColor: '#00D100',
																textAlign: 'center',
															}}
														>
															{props?.message} <br />
															{props?.message1}
														</p>
													</div>
													<div className='text-center'>
														<span
															className='btn btn-primary mt2'
															onClick={() => navigate('/signin')}
														>
															Sign in
														</span>
														<div className='clearfix'></div>
													</div>
												</div>
											</div>
											<div className='clearfix'></div>
											{/* </form> */}
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

export default AuthMessage;
