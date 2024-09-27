import { Button, Link, Stack } from '@mui/material';
import React, { useReducer } from 'react';
import { useNavigate, useParams, Link as ReactLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import CredibledLogo from '../assets/img/credibled_logo_205x45.png';
import LookingForJob from '../assets/img/look_job_sm.png';
import { default as PhoneInput } from './PhoneNumberInput';
export { CredibledLogo };

type Action =
	| {
			readonly type: 'POSITION' | 'LOCATION' | 'EMAIL';
			payload: string;
	  }
	| {
			readonly type: 'POSITION' | 'LOCATION' | 'EMAIL' | 'PHONE';
			payload: number | string;
	  };

type Lead2State = {
	position: string;
	location: string;
	phone: string;
	email: string;
};

const stateReducer = (state: Lead2State, { type, payload }: Action) =>
	type === 'POSITION' ||
	type === 'LOCATION' ||
	type === 'PHONE' ||
	type === 'EMAIL'
		? { ...state, [type.toLowerCase()]: payload }
		: state;

const initialState = {
	position: '',
	location: '',
	phone: '',
	email: '',
};

const Lead2 = () => {
	const navigate = useNavigate();
	const params = useParams() as {
		id: string;
		candidateName: string;
		refereeName: string;
	};
	const [state, dispatch] = useReducer(stateReducer, initialState);
	const { position, location, phone, email } = state;

	const handlePhoneNumberChange = (value: string) => {
		const currentPhoneNumberLength = value
			?.split?.(' ')
			?.slice?.(1)
			?.join('')?.length;
		if (currentPhoneNumberLength && currentPhoneNumberLength > 10) return;
		return dispatch({
			type: 'PHONE',
			payload: value,
		});
	};

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value, attributes } = e.target;
		const action = attributes['name' as unknown as number].value;
		if (action === 'position')
			return dispatch({ type: 'POSITION', payload: value });
		if (action === 'location')
			return dispatch({ type: 'LOCATION', payload: value });
		if (action === 'phone') return dispatch({ type: 'PHONE', payload: value });
		if (action === 'email') return dispatch({ type: 'EMAIL', payload: value });
	}

	async function handleContactClick() {
		if (position.length === 0) return toast.error('Position cannot be empty');
		if (location.length === 0) return toast.error('Location cannot be empty');
		try {
			await fetch(`${import.meta.env.VITE_API_URL}/api/leadForJob`, {
				method: 'POST',
				body: JSON.stringify({
					jobHistory_uuid: params.id,
					personalEmail: email,
					personalPhone: phone,
					position,
					location,
				}),
				headers: { 'Content-type': 'application/json; charset=UTF-8' },
			});
			navigate(
				'/referee-summary/' +
					params.candidateName +
					'/' +
					params.refereeName +
					'/' +
					params.id
			);
		} catch (e: any) {
			if (typeof e === 'object') toast.error(e?.message);
		}
	}

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
								<div className='col-md-8 offset-md-1'>
									<div className=''>
										<a
											className='navbar-brand'
											href='https://www.credibled.com/'
										>
											<img
												src={CredibledLogo}
												alt='Credibled Logo'
												width={200}
											/>
										</a>
									</div>
									<div className='card-plain mt2'>
										<h3
											id='hire-title'
											className='text-primary pt2 h3-custom'
										>
											Interested in New Opportunities?
										</h3>
										<div>
											<h3
												id='job-title'
												className='text-primary'
												style={{ display: 'none' }}
											>
												Accelerate Your Career with{' '}
												<span className='text-secondary'>Credibled</span>
											</h3>
											<br />
											<p className='highlight'>
												Unlock new career opportunities by sharing your contact
												details with the reference requestor. This connection
												ensures that you're among the first to explore exciting
												job openings tailored to your skills and interests,
												keeping you ahead in a competitive job market.
											</p>
											<div
												id='hire-card'
												className='card job-card'
											>
												<div className='flex flex-wrap items-center justify-center gap-x-4 lg:flex-nowrap xl:gap-x-24'>
													<img
														src={LookingForJob}
														alt='Looking to hire'
													/>
													<form
														onSubmit={async e => {
															e.preventDefault();
															await handleContactClick();
														}}
														className='grow'
													>
														<p className='job-txt'>
															Fill the form below to get contacted by an
															accredited Credibled partner.
														</p>
														<div className='row'>
															<div className='col-md-6'>
																<div className='form-group'>
																	<label className='bmd-label-floating'>
																		Position
																		<span className='sup_char'>
																			<sup>*</sup>
																		</span>
																	</label>
																	<input
																		required
																		name='position'
																		type='text'
																		value={position}
																		className='form-control'
																		onChange={handleChange}
																	/>
																</div>
															</div>
															<div className='col-md-6'>
																<div className='form-group'>
																	<label className='bmd-label-floating'>
																		Location
																		<span className='sup_char'>
																			<sup>*</sup>
																		</span>
																	</label>
																	<input
																		required
																		name='location'
																		type='text'
																		value={location}
																		className='form-control'
																		onChange={handleChange}
																	/>
																</div>
															</div>
														</div>

														<div className='row'>
															<div className='col-md-12'>
																<div className='form-group'>
																	<PhoneInput
																		{...{
																			isFullWidth: true,
																			phoneNumber: phone,
																			handlePhoneNumberChange,
																		}}
																	/>
																</div>
																<div className=''>
																	<div className='form-group'>
																		<label className='bmd-label-floating'>
																			Email Address
																			<span className='sup_char'>
																				<sup>*</sup>
																			</span>
																		</label>
																		<input
																			name='email'
																			type='email'
																			value={email}
																			className='form-control'
																			onChange={handleChange}
																			required
																		/>
																	</div>
																</div>
															</div>
															<Stack
																className='mt-4 w-full'
																flexDirection='row'
																justifyContent='center'
																alignItems='center'
																columnGap={4}
															>
																<Button
																	variant='contained'
																	color='secondary'
																	className='rounded-full'
																	type='submit'
																>
																	Contact Me!
																</Button>
																<Link
																	component={ReactLink}
																	underline='always'
																	color='secondary'
																	to={
																		'/referee-summary/' +
																		params.candidateName +
																		'/' +
																		params.refereeName +
																		'/' +
																		params.id
																	}
																>
																	Skip
																</Link>
															</Stack>
														</div>
													</form>
												</div>
												<div
													id='job-card'
													className='card job-card'
													style={{ display: 'none' }}
												>
													<div className='row'>
														<div className='col-md-4 jobcol'>
															<img
																src='assets/img/look_job_sm.png'
																className='jobhire'
																alt=''
															/>
														</div>

														<div
															className='col-md-8'
															style={{ paddingLeft: '5%' }}
														>
															<p className='job-txt'>
																Fill the form below to get contacted by an
																accredited Credibled partner.
															</p>

															<div className='row'>
																<div className='col-md-6'>
																	<div className='form-group'>
																		<label className='bmd-label-floating'>
																			Position
																			<span className='sup_char'>
																				<sup>*</sup>
																			</span>
																		</label>
																		<input
																			name='position'
																			type='text'
																			value={position}
																			className='form-control'
																			onChange={handleChange}
																		/>
																	</div>
																</div>
																<div className='col-md-6'>
																	<div className='form-group'>
																		<label className='bmd-label-floating'>
																			Location
																			<span className='sup_char'>
																				<sup>*</sup>
																			</span>
																		</label>
																		<input
																			name='location'
																			type='text'
																			value={location}
																			className='form-control'
																			onChange={handleChange}
																		/>
																	</div>
																</div>
															</div>

															<div className='row'>
																<div className='col-md-6'>
																	<div className='form-group'>
																		<label className='bmd-label-floating'>
																			Phone#
																			<span className='sup_char'>
																				<sup>*</sup>
																			</span>
																		</label>
																		<input
																			name='phone'
																			type='text'
																			value={phone}
																			className='form-control'
																			onChange={handleChange}
																		/>
																	</div>
																</div>
																<div className='col-md-6'>
																	<div className='form-group'>
																		<label className='bmd-label-floating'>
																			Email Address
																			<span className='sup_char'>
																				<sup>*</sup>
																			</span>
																		</label>
																		<input
																			name='email'
																			type='email'
																			value={email}
																			className='form-control'
																			onChange={handleChange}
																		/>
																	</div>
																</div>
															</div>
															<div className='mt2 clear-both'>
																<Button
																	id='lj'
																	className='btn btn-primary'
																	onClick={handleContactClick}
																>
																	Contact Me!
																</Button>
																<Button
																	className='btn btn-secondary-outline float-right'
																	onClick={() =>
																		navigate(
																			'/referee-summary/' +
																				params.candidateName +
																				'/' +
																				params.refereeName +
																				'/' +
																				params.id
																		)
																	}
																>
																	Skip &nbsp;
																	<i
																		className='fa fa-arrow-right fntsz12'
																		style={{ fontWeight: 100 }}
																	></i>
																</Button>
																<div className='ripple-container'></div>
															</div>
														</div>
													</div>
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
			</div>
		</>
	);
};

export default Lead2;
