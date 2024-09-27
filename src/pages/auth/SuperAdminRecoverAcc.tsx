import React from 'react';
import { Link } from 'react-router-dom';

export default function SuperAdminRecoverAcc() {
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
										<h4 className='mt3'>Recover your account</h4>
										<small className='text-secondary'>
											Enter the email address you use to sign into the Super
											Admin Credibled Console.
										</small>
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

														<div className='mt2 text-center'>
															<Link
																to='/super-admin/login'
																className='btn-plain'
															>
																Cancel
															</Link>
															<a
																href='#!'
																className='btn btn-primary'
															>
																Send recover Email
															</a>
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
		</>
	);
}
