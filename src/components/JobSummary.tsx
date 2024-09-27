/* eslint-disable eqeqeq */
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import { getJobHistory, sendEmail, updateLifeCycle } from '../apis';
import { getRefereeDetails2 } from '../apis/user.api';
import logo from '../assets/img/credibled_logo_205x45.png';
import { detectBrowser, getDate, getGeoInfo, useIP } from '../Common';

var timeOutVar: any;

const formatDateToLocaleDateString = (date: Date): string => {
	if (typeof date === 'object' && date instanceof Date) {
		return date
			.toLocaleDateString()
			.split('/')
			.map(v => v.padStart(2, '0'))
			.join('-');
	}
	return date;
};

export default function JobSummary() {
	const [open, setOpen] = useState(false);
	const [openRating, setOpenRating] = useState(false);
	const params = useParams() as { name?: string; id: string };
	const [jobhistory, setJobHistory] = useState<any[]>([]);
	const [ratingValue] = useState(3);
	const { data: ipAddress } = useIP();
	const [jobData, setJobData] = useState<any[]>([]);
	const navigate = useNavigate();
	getGeoInfo();

	useEffect(() => {
		(async () => {
			if (params.name && params.id) {
				(document.getElementById('btnSubmit') as HTMLButtonElement).disabled =
					true;
				const resp = await getJobHistory(params.id);
				setJobData(resp);
				let isNew = false;
				resp?.forEach((item: any) => {
					if (item.emailFlag === false) {
						isNew = true;
					}
				});
				if (isNew) {
					(document.querySelector('.form-check') as HTMLElement).style.display =
						'visible';
					(document.querySelector('#btnSubmit') as HTMLElement).style.display =
						'visible';
					//  document.querySelector(".btn-secondary-outline").textContent="Add More Referees"
				} else {
					(
						document.querySelector('.form-check') as HTMLElement
					).style.visibility = 'hidden';
					(
						document.querySelector('#btnSubmit') as HTMLElement
					).style.visibility = 'hidden';
					(
						document.querySelector('.btn-secondary-outline') as HTMLElement
					).textContent = "Add Refree's";
				}
			}
		})();
	}, [params.id, params.name]);

	useEffect(() => {
		(async () => {
			if (jobData) {
				let arr: any[] = [];
				jobData.map(async item => {
					let resp2 = await getRefereeDetails2(item.refree);
					arr.push({ ...resp2.data, ...item });
					if (arr.length === jobData.length) {
						setJobHistory(arr);
					}
				});
			}
		})();
	}, [jobData]);

	const goBackClicked = () => {
		if (params.name && params.id) {
			setTimeout(function () {
				navigate('/job-history/' + params.name + '/' + params.id);
			}, 10);
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleRatingClose = () => {
		setOpenRating(false);
	};

	const submitClicked = async () => {
		await sendEmail(params.id);
		for (let i = 0; i < jobhistory.length; i++) {
			const body = {
				uuid: params.id,
				name: params.name,
				action:
					'Sent request to ' +
					jobhistory[i].refereeFirstName +
					' ' +
					jobhistory[i].refereeLastName,
				userType: 'candidate',
				date: getDate(),
				osBrowser: detectBrowser(),
				ipAddress: !!ipAddress ? ipAddress : null,
				locationISP: localStorage.getItem('cityName'),
				refereeUUID: params.id,
			};
			await updateLifeCycle(body);
		}
		setTimeout(function () {
			navigate('/job-history-complete/' + params.name + '/' + params.id);
		}, 10);
	};

	const checkBoxClicked = () => {
		if (
			(document.getElementById('checkBoxConfirm') as HTMLInputElement)
				.checked == true
		) {
			(document.getElementById('btnSubmit') as HTMLButtonElement).disabled =
				false;
		} else {
			(document.getElementById('btnSubmit') as HTMLButtonElement).disabled =
				true;
		}
	};

	const jobInfoClicked = () => {
		if (params.name && params.id) {
			setTimeout(function () {
				navigate('/job-info/' + params.name + '/' + params.id);
			}, 10);
		}
	};

	const jobHistoryClicked = () => {
		if (params.name && params.id) {
			setTimeout(function () {
				navigate('/job-history/' + params.name + '/' + params.id);
			}, 10);
		}
	};

	const jobHistories = useMemo(
		() =>
			jobhistory.map(localState => (
				<div
					className='row'
					key={localState.uuid}
				>
					<div className='col-md-12 pl3'>
						<h3 className='jh-title-primary mb-2 capitalize'>
							{localState.organization}
						</h3>
						<h5 className='jh-subtitle-primary-nb'>
							{formatDateToLocaleDateString(new Date(localState.startDate))} -{' '}
							{!!localState.endDate
								? formatDateToLocaleDateString(new Date(localState.endDate))
								: 'Present'}
						</h5>
						<h6 className='text-primary mb-2'>
							Your role at the time:{' '}
							<span className='text-primary inline-block font-bold'>
								{localState.candidateRole}
							</span>
						</h6>
						<i className='acc-icon material-icons'>account_box</i>
						<div className='jh-subtitle-acc relative bottom-1 pb-1'>
							<Typography
								className='capitalize'
								component='span'
							>
								{localState.refereeFirstName}
							</Typography>{' '}
							-
							<Typography
								className='font-bold'
								component='span'
								variant='body2'
							>
								&nbsp;{localState.refereeEmail}
							</Typography>
						</div>
						<p className='text-secondary'>{localState.refereePhone}</p>
						<hr className='seperator' />
					</div>
				</div>
			)),
		[jobhistory]
	);

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
						<div className='col-sm-10 col-md-8 col-lg-8'>
							<div className=''>
								<Link
									className='navbar-brand'
									to='/signin'
								>
									<img
										src={logo}
										alt='Credibled Logo'
										className='credibled-logo'
									/>
								</Link>
							</div>

							<div className='card-plain mt2'>
								<div className='stepper'>
									<div className='stepper-steps'>
										<div className='stepper-step stepper-step-isActive'>
											<div className='stepper-stepContent step_active_primary'>
												<span
													className='text-primary'
													onClick={jobInfoClicked}
												>
													<span className='stepper-stepMarker'> 1 </span>Job
													Information
												</span>
											</div>
										</div>
										<div className='stepper-step stepper-step-isActive'>
											<div className='stepper-stepContent step_active_primary'>
												<span
													className='text-primary'
													onClick={jobHistoryClicked}
												>
													<span className='stepper-stepMarker'> 2 </span>Job
													History
												</span>
											</div>
										</div>
										<div className='stepper-step stepper-step-isActive'>
											<div className='stepper-stepContent step_active'>
												<span className='stepper-stepMarker'> 3 </span>Summary
											</div>
										</div>
									</div>

									<div className='row'>
										<div className='col-md-12 pl3 pb2'>
											<Typography
												className='jh-title'
												variant='h5'
											>
												Summary
											</Typography>
											<div
												className='alert alert-warning alert-dismissible fade show'
												role='alert'
											>
												<strong>{jobhistory.length} Referees added.</strong>{' '}
												Review their information and submit the request.
												<button
													type='button'
													className='close'
													data-dismiss='alert'
													aria-label='Close'
												>
													<span aria-hidden='true'>&times;</span>
												</button>
											</div>
										</div>
									</div>
									{jobHistories}
									<div className='box-pad mt1 text-center'>
										<div className='form-check box-pad mb-3'>
											<label className='form-check-label'>
												<input
													id='checkBoxConfirm'
													type='checkbox'
													onChange={checkBoxClicked}
												/>
												<small>
													&nbsp;{' '}
													<strong className='txt_body'>
														I confirm the contact information of these referees
														are up-to-date and correct.
													</strong>
												</small>
											</label>
										</div>
										<br />
										<button
											onClick={goBackClicked}
											className='btn btn-secondary-outline'
										>
											Go back
										</button>
										&nbsp;
										<input
											type='button'
											data-toggle='modal'
											id='btnSubmit'
											data-target='#rate_experience'
											onClick={submitClicked}
											className='btn btn-primary'
											value='Submit'
										/>
										<Modal
											aria-labelledby='transition-modal-title'
											aria-describedby='transition-modal-description'
											open={open}
											onClose={handleClose}
											closeAfterTransition
										>
											<Fade in={open}>
												<div>
													<div className='modal-body text-center'>
														<div className='row'>
															<div className='col'>
																<h3 className='text-primary'>
																	<span className='text-secondary'>
																		Thank you
																	</span>{' '}
																	for Providing a reference.
																</h3>
																<p>
																	<span
																		onClick={() => {
																			clearTimeout(timeOutVar);
																			setOpenRating(true);
																		}}
																		className='btn btn-primary mt2'
																		data-dismiss='modal'
																		aria-label='Close'
																		data-toggle='modal'
																		data-target='#rate_experience1'
																	>
																		Rate your Experience
																	</span>
																</p>
																<p> you will be redirected in 5 seconds...</p>
															</div>
														</div>
													</div>
												</div>
											</Fade>
										</Modal>
										<Modal
											aria-labelledby='transition-modal-title'
											aria-describedby='transition-modal-description'
											open={openRating}
											onClose={handleRatingClose}
											closeAfterTransition
										>
											<Fade in={open}>
												<div>
													<div className='modal-body text-center'>
														<div className='row'>
															<div className='col'>
																<h4 className='text-primary'>
																	Out of 5 stars, how would you rate your
																	experience of providing a reference using
																	Credibled ?
																</h4>
																<p className='pt2'>
																	<Rating
																		name='pristine'
																		value={ratingValue}
																	/>{' '}
																</p>

																<div className='box-pad'>
																	<Link
																		to={
																			'/job-history-complete/' +
																			params.name +
																			'/' +
																			params.id
																		}
																		className='btn btn-primary'
																	>
																		Submit
																	</Link>
																</div>
															</div>
														</div>
													</div>
												</div>
											</Fade>
										</Modal>
									</div>
								</div>
							</div>
							<div className='clearfix'> </div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
