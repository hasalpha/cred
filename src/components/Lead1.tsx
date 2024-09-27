import { Button, Link, Stack } from '@mui/material';
import React, { useReducer } from 'react';
import { useNavigate, useParams, Link as ReactLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import CredibledLogo from '../assets/img/credibled_logo_205x45.png';
import LookingForHireImage from '../assets/img/look_hire_sm.png';
import { useRefereePreferences } from '../Common';

type Action<T> = {
	readonly type: 'POSITION' | 'LOCATION';
	readonly payload: Lead1State<T>['position'];
};

type Lead1State<T> = {
	position: T;
	location: T;
};

interface StateReducer<T = Lead1State<string>> {
	(s: T, a: Action<T extends string ? T : string>): T;
}

const stateReducer: StateReducer = (
	state: Lead1State<string>,
	{ type, payload }: Action<string>
) =>
	type === 'POSITION' || type === 'LOCATION'
		? { ...state, [(type as any).toLowerCase()]: payload }
		: state;

const initialState = {
	position: '',
	location: '',
};

const Lead1 = () => {
	const navigate = useNavigate();
	const params = useParams() as {
		id: string;
		candidateName: string;
		refereeName: string;
	};
	const { data: refereePreferences } = useRefereePreferences(params.id);
	const [state, dispatch] = useReducer(stateReducer, initialState);
	const { position, location } = state;

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value, attributes } = e.target;
		const action = attributes['name' as unknown as number].value;
		if (action === 'position') dispatch({ type: 'POSITION', payload: value });
		if (action === 'location') dispatch({ type: 'LOCATION', payload: value });
	}

	async function handleContactClick() {
		if (position.length === 0) return toast.error('Position cannot be empty');
		if (location.length === 0) return toast.error('Location cannot be empty');
		try {
			await fetch(`${import.meta.env.VITE_API_URL}/api/leadToHire`, {
				method: 'POST',
				body: JSON.stringify({
					jobHistory_uuid: params?.id,
					position,
					location,
				}),
				headers: { 'Content-type': 'application/json; charset=UTF-8' },
			});
			let nextUrl = '/lead-to-job/';
			if (refereePreferences) {
				const { is_lead_generation_job } = refereePreferences;
				if (!is_lead_generation_job) nextUrl = '/referee-summary/';
			}
			return navigate(
				`${nextUrl}${params.candidateName}/${params.refereeName}/${params.id}`
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
											/>
										</a>
									</div>
									<div className='card-plain mt2'>
										<h3
											id='hire-title'
											className='text-primary pt2 h3-custom'
										>
											Looking to Expand Your Team?
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
												Speed up your hiring process by connecting directly with
												top talent. Share your contact details with the
												recruiter who requested this reference to quickly access
												highly qualified candidates. This direct connection
												ensures that your staffing needs are met efficiently
												through strategic collaboration.
											</p>
											<div
												id='hire-card'
												className='card job-card'
											>
												<div className='flex flex-wrap items-center justify-center gap-x-2 md:flex-nowrap lg:flex-nowrap xl:flex-nowrap'>
													<div>
														<img
															src={LookingForHireImage}
															alt='Looking to hire'
															width={200}
														/>
													</div>
													<form
														onSubmit={e => {
															e.preventDefault();
															handleContactClick();
														}}
														className='sm:no-grow grow'
													>
														<p className='job-txt'>
															Fill the form below to get contacted by an
															accredited Credibled partner.
														</p>
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
														<div className='form-group'>
															<label className='bmd-label-floating'>
																Location
																<span className='sup_char'>
																	<sup>*</sup>
																</span>
															</label>
															<input
																name='location'
																required
																type='text'
																value={location}
																className='form-control'
																onChange={handleChange}
															/>
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
																to={`/lead-to-job/${params.candidateName}/${params.refereeName}/${params.id}`}
															>
																Skip
															</Link>
														</Stack>
													</form>
												</div>
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
																		type='email'
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
																		type='text'
																		value=''
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
																		onChange={handleChange}
																		type='email'
																		value=''
																		className='form-control'
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
																		'/lead-to-job/' +
																			params.candidateName +
																			'/' +
																			params.refereeName +
																			'/' +
																			params.id
																	)
																}
															>
																Skipss &nbsp;
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
		</>
	);
};

export default Lead1;
