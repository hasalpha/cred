import React from 'react';
import { Link } from 'react-router-dom';

export default function SuperAdminLogin() {
	return (
		<>
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
											href='#!'
										>
											<img
												src='../assets/img/credibled_logo_205x45.png'
												alt='Credibled Logo'
											/>
										</a>
										<h4 className='mt3'>Console Sign in</h4>
									</div>

									<div className='card mt3'>
										<div className='card-body'>
											<form>
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
																type='email'
																className='form-control'
															/>
														</div>

														<div className='form-group'>
															<label className='bmd-label-floating'>
																Passcode
																<span className='sup_char'>
																	<sup>*</sup>
																</span>
															</label>
															<input
																type='password'
																className='form-control'
															/>
														</div>

														<div className='text-center'>
															<a
																href='clients_mainpage.html'
																className='btn btn-primary mt2'
															>
																Sign In
															</a>
															<div className='clearfix'></div>

															<div className='box-pad'>
																<Link to={'/super-admin/recover-account'}>
																	Recover your account
																</Link>
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
				</div>
			</div>
		</>
	);
}
