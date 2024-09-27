import Box from '@mui/material/Box';
import { useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { removeJobHistory, getMinReference } from '../apis';
import logo from '../assets/img/credibled_logo_205x45.png';
import { useJobData, useJobHistory } from '../Common';
import Loading from './Loading';

function JobHistory() {
	const params = useParams();
	const navigate = useNavigate();
	const [,] = useState([]);
	const { refetch } = useJobData();
	const { data: jobhistory = [], isLoading } = useJobHistory();
	const removeJobHistoryMutation = useMutation({
		mutationFn: (id: string) => removeJobHistory(id),
		onSuccess: () => refetch(),
	});
	const [minReference, setMinReference] = useState(2);

	useEffect(() => {
		const currentURL = window.location.href;
		const segments = currentURL.split('/');
		const uuid = segments[segments.length - 1];
		const res = getMinReference(uuid);
		res.then(response => {
			setMinReference(response.data.min_reference);
		});
	}, []);
	console.log(minReference);
	if (isLoading || isLoading) return <Loading />;

	const formatDate = (dateString: any) => {
		if (dateString) {
			let d = new Date(dateString);
			let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
			let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
			// let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
			return month + ' ' + year;
		}
	};

	const deleteClicked = async (id: string) => {
		try {
			await removeJobHistoryMutation.mutateAsync(id);
			toast.success('Deleted referee successfully!');
		} catch (e: any) {
			toast.error(e);
		}
	};

	const reviewClicked = () => {
		if (params.name && params.id) {
			if (jobhistory.length >= minReference) {
				const emailcheck = localStorage.getItem('emailArr')!;
				const emailArray = emailcheck?.split(',');
				const hasDuplicates = (arr: any) => arr.length !== new Set(arr).size;

				if (hasDuplicates(emailArray)) {
					var x = document.getElementById('duplicateError');
					x!.style.display = 'block';
					return false;
				} else {
					setTimeout(function () {
						navigate('/job-summary/' + params.name + '/' + params.id);
					}, 10);
				}
			}
		}
	};

	const jobInfoClicked = async () => {
		if (params.name && params.id) {
			setTimeout(function () {
				navigate('/job-info/' + params.name + '/' + params.id);
			}, 10);
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
						<div className='col-sm-8 col-md-8 col-lg-8'>
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
													<span className='stepper-stepMarker'>1</span>Job
													Information
												</span>
											</div>
										</div>
										<div className='stepper-step stepper-step-isActive'>
											<div className='stepper-stepContent step_active'>
												<span className='stepper-stepMarker'>2</span>Job History
											</div>
										</div>
										<div className='stepper-step'>
											<div className='stepper-stepContent'>
												<span className='stepper-stepMarker'>3</span>Summary
											</div>
										</div>
									</div>
									{jobhistory?.length < minReference ? (
										<div className='row w-100 m-0'>
											<div className='pl3 pb2'>
												<h3 className='jh-title'>Tell Us Your Job History</h3>
												<h5 className='jh-subtitle'>
													Please, complete your work history with the following
													requirements:
												</h5>

												<ul className='cretiria1'>
													<li>
														Minimum {minReference} references &nbsp;
														<i className='fa fa-close'></i>{' '}
													</li>
												</ul>
											</div>
										</div>
									) : null}
									{jobhistory?.map(item => (
										<div
											className='row w-100 my-10 ml-0'
											key={item.uuid}
										>
											<div className='col-md-12 pl3'>
												<h3 className='jh-title-primary mb-2'>
													{item.organization}
												</h3>
												<h5 className='jh-subtitle-primary'>
													{formatDate(item.startDate)} -{' '}
													{!!item.endDate
														? formatDate(item.endDate)
														: 'Present'}
												</h5>
												<div className='remove'>
													{item.emailFlag === false ? (
														<>
															<Link
																to={
																	'/edit-job-info/' +
																	params.name +
																	'/' +
																	params.id +
																	'/' +
																	item.uuid
																}
																className='text-secondary'
															>
																<i
																	className='fa fa-pencil-square-o'
																	aria-hidden='true'
																></i>{' '}
															</Link>

															<i
																className='fa fa-times-circle-o'
																aria-hidden='true'
																style={{ cursor: 'pointer' }}
																onClick={() => deleteClicked(item.uuid)}
															></i>
														</>
													) : item.refereeResponse === 'declined' ? (
														'Request Declined'
													) : item.refereeResponse === 'Agreed' ? (
														'Request Agreed'
													) : item.refereeResponse === 'Accepted' ? (
														'Request Accepted'
													) : (
														'Request Sent'
													)}
												</div>
												<Box className='mt-2.5'>
													<i className='acc-icon material-icons'>account_box</i>{' '}
													<div className='jh-subtitle-acc overflow-wrap-anywhere'>
														{item.refereeFirstName} - {item.refereeEmail}
													</div>
												</Box>
											</div>
										</div>
									))}

									<div className='box-pad mt1 text-center'>
										<button
											type='button'
											className='btn btn-secondary-outline'
											onClick={jobInfoClicked}
										>
											Add
										</button>
										&nbsp;
										{jobhistory?.length > minReference - 1 &&
										jobhistory?.filter(item => item.emailFlag === false)
											.length > 0 ? (
											<input
												type='button'
												id='btnCredReview'
												className='btn btn-primary'
												onClick={reviewClicked}
												value='Review'
											/>
										) : null}
									</div>
									<div
										className='notes'
										id='duplicateError'
										style={{ display: `none` }}
									>
										Same email id can't be used on single reference request!!
									</div>
								</div>
							</div>
							<div className='clearfix'></div>
						</div>
					</div>
				</div>
			</div>

			{/* <!-- Modal --> */}
			<div
				className='modal fade'
				id='addjobhistory'
				tabIndex={-1}
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'
			>
				<div
					className='modal-dialog'
					role='document'
				>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5
								className='modal-title'
								id='exampleModalLabel'
							>
								Add New Job History
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
							<div className='row lrpad'>
								<div className='col-md-12'>
									<h5 className='jh-subtitle pt1'>Entry Type</h5>

									<label className='label-static'>
										Employment
										<span className='sup_char'>
											<sup>*</sup>
										</span>
									</label>
									<div className='form-group'>
										<select className='form-control select-top'>
											<option value=''>Select employment type</option>
											<option>Employment 1</option>
											<option>Employment 2</option>
											<option>Employment 3</option>
										</select>
										<span className='fa fa-fw fa-angle-down field_icon eye'></span>
									</div>
								</div>

								<div className='col-md-12'>
									<h5 className='jh-subtitle pt2'>Employed at</h5>
									<div className='form-group mt3'>
										<label className='bmd-label-floating'>
											Organization
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<input
											type='text'
											className='form-control'
											maxLength={30}
										/>
									</div>
								</div>

								<div className='col-md-6'>
									<div className='form-group mt3'>
										<label className='bmd-label-static'>
											Start Date
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<input
											type='date'
											className='form-control'
										/>
									</div>
								</div>

								<div className='col-md-6'>
									<div className='form-group mt3'>
										<label className='bmd-label-static'>
											End Date
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<input
											type='date'
											className='form-control'
										/>
									</div>
								</div>

								<div className='col-md-12 text-right'>
									<div className='form-check box-pad'>
										<label className='form-check-label'>
											<input
												className='form-check-input'
												type='checkbox'
												value=''
											/>
											Currently working here
											<span className='form-check-sign'>
												<span className='check'></span>
											</span>
										</label>
									</div>
								</div>

								<div className='col-md-12'>
									<h5 className='jh-subtitle pt2'>Referee Information</h5>
								</div>

								<div className='col-md-6'>
									<div className='form-group'>
										<label className='bmd-label-floating'>
											First Name
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<input
											type='text'
											className='form-control'
											maxLength={40}
										/>
									</div>
								</div>
								<div className='col-md-6'>
									<div className='form-group'>
										<label className='bmd-label-floating'>
											Last Name
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<input
											type='text'
											className='form-control'
											maxLength={40}
										/>
									</div>
								</div>

								<div className='col-md-6'>
									<div className='form-group'>
										<label className='bmd-label-floating'>
											Email address
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<input
											type='email'
											value=''
											readOnly
											className='form-control'
										/>
									</div>
								</div>
								<div className='col-md-2'>
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
											readOnly
											className='form-control'
										/>
									</div>
								</div>
								<div className='col-md-4'>
									<div className='form-group'>
										<input
											type='text'
											value=''
											readOnly
											className='form-control'
										/>
									</div>
								</div>

								<div className='col-md-12'>
									<div className='form-group'>
										<label className='bmd-label-floating'>
											Referee job title at the time
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<input
											type='text'
											className='form-control'
											maxLength={40}
										/>
									</div>
								</div>

								<div className='col-md-12'>
									<div className='form-group'>
										<label className='bmd-label-floating'>
											Your role at the time
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<textarea
											className='form-control'
											rows={2}
										></textarea>
									</div>
								</div>
							</div>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary-outline'
								data-dismiss='modal'
							>
								Cancel
							</button>
							<button
								type='button'
								className='btn btn-primary'
								data-dismiss='modal'
							>
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default JobHistory;
