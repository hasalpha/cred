import React from 'react';

export default function SuperAdminSettings() {
	return (
		<>
			<div className='content'>
				<div className='container-fluid'>
					<div className='card-plain'>
						<div className='card-body'>
							<div className='row'>
								<div className='col-md-12'>
									<div className='card-plain bb10'>
										<div className='row'>
											<div className='col-md-4'>
												<h3> Console Settings</h3>
											</div>
											<div className='col-md-8 text-right'>
												<p className='login_info'>
													{' '}
													Logged in as <strong>Super Admin</strong> on
													<span className='text-secondary'>
														06 January 2021 6.41 AM
													</span>
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='row'>
						<div className='col-md-12'>
							<h5 className='text-primary'>
								Clients Email Template
								<br />
								<div className='text-secondary'>
									<small> (Onboarding email for the other users)</small>
								</div>
							</h5>
						</div>
						<div className='col-md-6 mt1'>
							<div className='form-group'>
								<label className='bmd-label-floating'>
									subject
									<span className='sup_char'>
										<sup>*</sup>
									</span>
								</label>
								<input
									type='text'
									value=''
									className='form-control'
								/>
							</div>
						</div>
						<div className='col-md-6 mt1'>
							<label className='label-static'>
								Default user language
								<span className='sup_char'>
									<sup>*</sup>
								</span>
							</label>
							<div className='form-group'>
								<select className='form-control select-top'>
									<option>Select language</option>
									<option selected=''>English</option>
									<option>French</option>
								</select>
								<span className='fa fa-fw fa-angle-down field_icon eye'></span>
							</div>
						</div>
						<div className='col-md-12 mt1 text-right'>
							<a
								data-toggle='modal'
								data-target='#preview'
								href='#!'
								className='btn btnxs btn-secondary'
								aria-label='Close'
							>
								Preview<div className='ripple-container'></div>
							</a>
						</div>
						<div className='col-md-12'>
							<div className='form-group text-left'>
								{/* <!-- <label className="bmd-label-floating">Your comments:</label> --> */}
								<textarea
									className='form-control tarea'
									rows='11'
									spellCheck='false'
								>
									<>
										You have been requested as a delegate on [title], please
										activate your account <br />
										[delegate.firstNa me] [delegate.lastName],
										<br />
										<br /> [advisor.firstName] (advisorlastName] has submitted a
										request for you to become their delegate on [title] for
										[permission]. To accept or reject this delegation request,
										follow the instructions below:
										<br />
										<br /> Set up your own account on [title]
										<br /> To get started, download the apps here and login with
										your social accounts. <br />
										<br />
										to use the app in a browser, click{' '}
										<a
											// href="[website]?accessCode=[delegate.code]&email=[delegate.email]"
											href='#!'
										>
											here
										</a>
										<br />
										to activate your account or copy and paste this link in your
										browser -{' '}
										<a
											href='#!'
											// href="(website]?accessCode=Edelegate.codel&email= [delegate.email]' [website]?accessCode=[delegate.code)&emaik[delegate.email]"
										>
											here
										</a>
										<br />
									</>
								</textarea>
							</div>
						</div>
						<div className='col-md-12 mt3 pb2 mb3 text-center'>
							<a
								href='#!'
								className='btn-plain'
							>
								Close
							</a>
							<a
								href='#!'
								className='btn btn-primary'
							>
								Save
							</a>
						</div>
					</div>
				</div>
			</div>
			<div
				className='modal fade'
				id='preview'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'
			>
				<div
					className='modal-dialog mwzero'
					role='document'
				>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5
								className='modal-title'
								id='exampleModalLabel'
							>
								Client Email Preview
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'
							>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<div className='row'>
								<div className='col-md-12'>
									<p className='mt2'>
										A copy of this email will be sebt to the following email
										address.
									</p>

									<div className='form-group'>
										<label className='bmd-label-floating'>
											Enter Client Email
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<input
											type='email'
											value=''
											className='form-control'
										/>
									</div>
								</div>
							</div>
						</div>
						<div className='modal-footer'>
							<a
								href='#!'
								data-dismiss='modal'
								aria-label='Close'
								className='btn-plain'
							>
								Close
							</a>
							<a
								href='#!'
								data-dismiss='modal'
								aria-label='Close'
								className='btn btn-primary'
							>
								Send
							</a>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
