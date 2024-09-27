import { useEffect, useRef, useState } from 'react';
import {
	filterByAdminReport,
	getAdminReport,
	getAdminSummary,
	getAllUserAdmin,
} from '../../apis/user.api';
import classes from './Requests.module.css';
const getPastDate = (x = 0) => {
	let date = new Date();
	date.setDate(date.getDate() - x);
	return date;
};

const labelStyle = { cursor: 'pointer' };

/* eslint-disable jsx-a11y/anchor-is-valid */
const Requests = props => {
	let currentTab = useRef('requested');
	const [admin, setAdmin] = useState({});
	const [summary, setSummary] = useState({
		archived: 0,
		completed: 0,
		inprogress: 0,
		requested: 0,
	});
	const [requested, setRequested] = useState(() => []);
	const [request, setRequest] = useState(() => []);
	const [inProgress, setInProgress] = useState(() => []);
	const [completed, setCompleted] = useState(() => []);
	const [archived, setArchived] = useState(() => []);
	const [startDate, setStartDate] = useState(getPastDate(30));
	const [endDate, setEndDate] = useState(getPastDate());
	const [requestedBy, setRequestedBy] = useState('all');
	useEffect(() => {
		const getList = async () => {
			const promises = [];
			promises.push(getAdminReport('requested'));
			promises.push(getAdminReport('in_progress'));
			promises.push(getAdminReport('completed'));
			promises.push(getAdminReport('archived'));
			promises.push(getAdminSummary());
			const result = await Promise.all(promises);
			result.forEach((val, i) => {
				switch (i) {
					case 0: {
						setRequest(val);
						setRequested(val);
						break;
					}
					case 1: {
						setInProgress(val);
						break;
					}
					case 2: {
						setCompleted(val);
						break;
					}
					case 3: {
						setArchived(val);
						break;
					}
					case 4: {
						setSummary(val);
						break;
					}
					default:
						break;
				}
			});
		};
		getList();
	}, []);

	useEffect(() => {
		const getAdminDetails = async () => {
			const admins = await getAllUserAdmin();
			const firstName = localStorage.getItem('firstName');
			const lastName = localStorage.getItem('lastName');
			const admin = admins
				.filter(
					admin =>
						admin?.firstName === firstName && admin?.lastName === lastName
				)
				.at(0);
			setAdmin(admin);
		};
		getAdminDetails();
	}, []);

	const loggedInTime = new Date(
		localStorage.getItem('loginTime')
	).toLocaleString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	});
	const handleDateChange = e => {
		switch (e?.target?.name) {
			case 'startDate':
				setStartDate(val => new Date(e?.target?.value));
				break;
			case 'endDate':
				setEndDate(val => new Date(e?.target?.value));
				break;
			default:
				break;
		}
	};

	const handleSummaryClick = async summaryType => {
		const index = ['requested', 'in_progress', 'completed', 'archived'].indexOf(
			summaryType
		);
		if (index !== -1) {
			switch (index) {
				case 0: {
					setRequested(request);
					currentTab.current = 'requested';
					break;
				}
				case 1: {
					setRequested(inProgress);
					currentTab.current = 'in progress';
					break;
				}
				case 2: {
					setRequested(completed);
					currentTab.current = 'completed';
					break;
				}
				case 3: {
					setRequested(archived);
					currentTab.current = 'archived';
					break;
				}
				default:
			}
		}
	};

	const getCurrentTab = () => {
		let details = [];
		switch (currentTab.current) {
			case 'requested': {
				details = [].concat(request);
				break;
			}
			case 'in progress': {
				details = [].concat(inProgress);
				break;
			}
			case 'completed': {
				details = [].concat(completed);
				break;
			}
			case 'archived': {
				details = [].concat(archived);
				break;
			}
			default: {
				break;
			}
		}
		return details;
	};

	const handleSearchClick = async () => {
		let result;
		if (['admin', 'all'].includes(requestedBy.toLowerCase())) {
			result = await filterByAdminReport(currentTab.current, admin.id);
		}
		if (result.length > 0) {
			//Filter result based on start date and end date
			const newRequested = result.filter(val => {
				const date = new Date(val.requestDate);
				return date >= startDate && date <= endDate;
			});
			setRequested(newRequested);
			return;
		}
		const newRequested = getCurrentTab().filter(val => {
			const date = new Date(val.requestDate);
			return date >= startDate && date <= endDate;
		});
		setRequested(newRequested);
	};

	const containsSearchValue = (role, firstName, lastName, email, value) => {
		return (
			role.toLowerCase().includes(value) ||
			firstName.toLowerCase().includes(value) ||
			lastName.toLowerCase().includes(value) ||
			email.toLowerCase().includes(value) ||
			`${firstName.toLowerCase()} ${lastName.toLowerCase()}`.includes(value)
		);
	};

	const handleSearch = value => {
		const newRequest = getCurrentTab().filter(val => {
			const { role, candidateInfo } = val;
			const { firstName, lastName, email } = candidateInfo;
			return containsSearchValue(role, firstName, lastName, email, value);
		});
		setRequested(newRequest);
	};

	const handleFilterByClick = e => {
		const { textContent: filterOption } = e?.target;
		if (filterOption) {
			switch (filterOption.toLowerCase()) {
				case 'filter by':
				case 'last 15 days': {
					setRequested(filterBy(getPastDate(15)));
					break;
				}
				case 'last 1 month': {
					setRequested(filterBy(getPastDate(30)));
					break;
				}
				case 'last 3 months': {
					setRequested(filterBy(getPastDate(90)));
					break;
				}
				default: {
					break;
				}
			}
		}
	};

	const filterBy = filterDate => {
		const currentDate = new Date();
		return getCurrentTab().filter(val => {
			const date = new Date(val.requestDate);
			return filterDate <= date && date <= currentDate;
		});
	};

	return (
		<>
			<div className='card-plain'>
				<div className='card-body'>
					<div className='row'>
						<div className='col-md-12'>
							<div className='card-plain bb10'>
								<div className='row'>
									<div className='col-md-4'>
										<h3>Requests</h3>
									</div>
									<div className='col-md-8 text-right'>
										<p className='login_info'>
											{' '}
											Logged in as <strong>Admin</strong> on{' '}
											<span className='text-secondary'>{loggedInTime}</span>
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
					<div className='search-box1'>
						<div className='row'>
							<div className='col-md-3'>
								<div className='form-group bmd-form-group is-filled'>
									<label
										htmlFor='startDate'
										className='bmd-label-floating'
									>
										Start Date
									</label>
									<input
										id='startDate'
										name='startDate'
										type='date'
										value={startDate.toISOString().split('T')[0]}
										onChange={handleDateChange}
										className='form-control'
									/>
								</div>
							</div>

							<div className='col-md-3'>
								<div className='form-group bmd-form-group is-filled'>
									<label
										htmlFor='endDate'
										className='bmd-label-floating'
									>
										End Date
									</label>
									<input
										id='endDate'
										name='endDate'
										type='date'
										value={endDate.toISOString().split('T')[0]}
										onChange={handleDateChange}
										className='form-control'
									/>
								</div>
							</div>

							<div className='col-md-4'>
								<label className='label-static'>Requested by</label>
								<div className='form-group'>
									<select
										className='form-control select-top'
										value={requestedBy}
										onChange={e => setRequestedBy(e.target.value)}
									>
										<option value='all'>All</option>
										<option value='user'>User</option>
										<option value='admin'>Admin</option>
									</select>
									<span className='fa fa-fw fa-angle-down field_icon eye'></span>
								</div>
							</div>
							<div
								className='col-md-1 text-right'
								role='button'
								onClick={handleSearchClick}
							>
								<a
									id='srh'
									href='#!'
									className={`btn btn-primary ${classes.searchButton}`}
								>
									Search
								</a>
							</div>
						</div>
					</div>

					<div className='content'>
						<div className='container-fluid'>
							<div className='card-plain hideonmobile'>
								<div className='card-body'>
									<div className='row'>
										<div className='col-md-12'>
											<div className='row'>
												<div
													className='col-md-3 col-sm-6 col-6'
													onClick={() => handleSummaryClick('requested')}
													role='button'
													tabIndex='0'
												>
													<div
														className={`tile ${
															currentTab.current
																.toLowerCase()
																.includes('requested') && 'selected-tile'
														}`}
													>
														<label className='h4'>Requested</label>
														<div className='h1 d-flex justify-content-between'>
															<span className='text-secondary material-icons-outlined'>
																forward_to_inbox
															</span>
															<label style={labelStyle}>
																{summary.requested}
															</label>
														</div>
													</div>
												</div>
												<div
													className='col-md-3 col-sm-6 col-6'
													onClick={() => handleSummaryClick('in_progress')}
													role='button'
													tabIndex='0'
												>
													<div
														className={`tile ${
															currentTab.current
																.toLowerCase()
																.includes('in progress') && 'selected-tile'
														}`}
													>
														<label className='h4'>In Progress</label>
														<div className='h1 d-flex justify-content-between'>
															<span className='text-secondary material-icons-outlined'>
																watch_later
															</span>
															<label style={labelStyle}>
																{summary.inprogress}
															</label>
														</div>
													</div>
												</div>
												<div
													className='col-md-3 col-sm-6 col-6'
													onClick={() => handleSummaryClick('completed')}
													role='button'
													tabIndex='0'
												>
													<div
														className={`tile ${
															currentTab.current
																.toLowerCase()
																.includes('completed') && 'selected-tile'
														}`}
													>
														<label className='h4'>Completed</label>
														<div className='h1 d-flex justify-content-between'>
															<span className='text-secondary material-icons-outlined'>
																done_outline
															</span>
															<label style={labelStyle}>
																{summary.completed}
															</label>
														</div>
													</div>
												</div>
												<div
													className='col-md-3 col-sm-6 col-6'
													onClick={() => handleSummaryClick('archived')}
													role='button'
													tabIndex='0'
												>
													<div
														className={`tile ${
															currentTab.current
																.toLowerCase()
																.includes('archived') && 'selected-tile'
														}`}
													>
														<label className='h4'>Archived</label>
														<div className='h1 d-flex justify-content-between'>
															<span className='text-secondary material-icons-outlined'>
																inventory_2
															</span>
															<label style={labelStyle}>
																{summary.archived}
															</label>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className='row'>
								<div className='col-md-12'>
									<div className='card mt_zero mpad2 pad_zero'>
										<div className='search-box'>
											<div className='row'>
												<div className='col-md-4'>
													<form
														className='navbar-form'
														onSubmit={e => e?.preventDefault()}
													>
														<span className='bmd-form-group'>
															<div className='input-group no-border'>
																<i className='material-icons sr_icon'>search</i>
																<input
																	type='text'
																	onChange={e =>
																		handleSearch(
																			e?.target?.value?.toLowerCase()
																		)
																	}
																	className='form-control'
																	placeholder='Search...'
																/>
															</div>
														</span>
													</form>
												</div>
											</div>
										</div>

										{
											//Mobile filters starts here
										}

										<div
											className='card-plain showonmobile mb-1'
											style={{ display: 'none' }}
										>
											<div className='card-body'>
												<div className='row'>
													<div className='col-md-12 pt2 lrpad2'>
														<div className='row'>
															<div className='col-6 filter_pad'>
																<button className='btn mbtn100 btn-outline-primary'>
																	{currentTab.current}
																	<span className='badge mbadge badge-pill badge-primary'>
																		14
																	</span>
																	<span className='text-secondary fleft material-icons-outlined'>
																		forward_to_inbox
																	</span>
																	<div className='ripple-container'></div>
																</button>
															</div>
															<div className='col-6 filter_pad'>
																<button className='btn mbtn100 btn-outline-primary'>
																	In Progress{' '}
																	<span className='badge mbadge badge-pill badge-secondary'>
																		06
																	</span>
																	<span className='text-secondary fleft material-icons-outlined'>
																		watch_later
																	</span>
																	<div className='ripple-container'></div>
																</button>
															</div>
															<div className='col-6 filter_pad'>
																<button className='btn mbtn100 btn-outline-primary'>
																	Criteria Met{' '}
																	<span className='badge mbadge badge-pill badge-trisary'>
																		08
																	</span>
																	<span className='text-secondary fleft material-icons-outlined'>
																		done_outline
																	</span>
																	<div className='ripple-container'></div>
																</button>
															</div>
															<div className='col-6 filter_pad'>
																<button className='btn mbtn100 btn-outline-primary'>
																	Archived{' '}
																	<span className='badge mbadge badge-pill badge-gray'>
																		27
																	</span>
																	<span className='text-secondary fleft material-icons-outlined'>
																		inventory_2
																	</span>
																	<div className='ripple-container'></div>
																</button>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>

										{
											// <!--Mobile filters ends here -->
										}

										<div className='card-plain lrpad'>
											<div className='row'>
												<div className='col-md-6'>
													<h3 style={{ textTransform: 'capitalize' }}>
														{currentTab.current}
													</h3>
												</div>
												<div className='col-md-6 text-right'>
													<div className='btn-group setmobile'>
														<button
															type='button'
															className='btn btnsm btn-secondary'
															onClick={handleFilterByClick}
														>
															Filter By
														</button>
														<button
															type='button'
															className='btn btnsm btn-secondary dropdown-toggle dropdown-toggle-split'
															data-toggle='dropdown'
															aria-haspopup='true'
															aria-expanded='false'
														>
															<span className='sr-only'>Toggle Dropdown</span>
														</button>
														<div className='dropdown-menu'>
															<span
																style={labelStyle}
																onClick={handleFilterByClick}
																className='dropdown-item'
																href='#'
															>
																last 15 days
															</span>
															<span
																style={labelStyle}
																onClick={handleFilterByClick}
																className='dropdown-item'
																href='#'
															>
																last 1 month
															</span>
															<span
																style={labelStyle}
																onClick={handleFilterByClick}
																className='dropdown-item'
																href='#'
															>
																last 3 months
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>

										{
											//<!--Mobile View Table starts here -->
										}

										<div
											className='showonmobile'
											style={{ display: 'none' }}
										>
											{requested.map(val => (
												<table className='mobile-data-table br5_secondary table'>
													<tbody>
														<tr>
															{' '}
															<td>Request Date</td>
															<td>
																<a href='admin_requests_summary.html'>
																	{val.requestDate}
																</a>
															</td>
														</tr>
														<tr>
															{' '}
															<td>Requested</td>
															<td>
																<a href='admin_requests_summary.html'>
																	{val.recruiterName}
																</a>
															</td>
														</tr>
														<tr>
															{' '}
															<td>Candidate</td>
															<td>
																<a href='admin_requests_summary.html'>{`${val.candidateInfo.firstName} ${val.candidateInfo.lastName}`}</a>
															</td>
														</tr>
														<tr>
															{' '}
															<td>Email</td>
															<td>{val.candidateInfo.email}</td>
														</tr>
														<tr>
															{' '}
															<td>Job Title</td>
															<td>{val.role}</td>
														</tr>
														<tr>
															{' '}
															<td>References</td>
															<td>Referee 1, Referee 2</td>
														</tr>
														<tr>
															{' '}
															<td>Action</td>
															<td>
																<a href='admin_requests_summary.html'>
																	<i className='fa fa-file-o'></i>
																	&nbsp;&nbsp;Summary
																</a>
															</td>
														</tr>
													</tbody>
												</table>
											))}
											<br />
										</div>

										{
											//<!--Mobile View Table Ends here -->
										}

										<div className='table-responsive hideonmobile'>
											<table className='table-hover table'>
												<thead>
													<tr>
														<th className='text-center'>#</th>
														<th className='sorting'>Request Date</th>
														<th className='sorting'>Requested</th>
														<th className='sorting'>Candidate</th>
														<th className='sorting'>Email</th>
														<th className='sorting'>Job Title</th>
														<th className='sorting'>References</th>
														<th className='sorting'>Action</th>
													</tr>
												</thead>
												<tbody>
													{requested.map((val, i) => (
														<tr>
															<td className='text-center'>{i + 1}</td>
															<td>{val.requestDate}</td>
															<td>{val.recruiterName}</td>
															<td>
																<a href='admin_requests_summary.html'>{`${val.candidateInfo.firstName} ${val.candidateInfo.lastName}`}</a>
															</td>
															<td>{val.candidateInfo.email}</td>
															<td>{val.role}</td>
															<td>
																{!!val.references ? (
																	<>
																		{!!val.referenceDetails[0][2] && (
																			<span className='material-icons-outlined text-info fs11'>
																				thumb_up
																			</span>
																		)}
																		{`${val.referenceDetails[0][0]} ${val.referenceDetails[0][1]}`}
																		, &nbsp;
																		{!!val.referenceDetails[1][2] && (
																			<span className='material-icons-outlined text-info fs11'>
																				thumb_up
																			</span>
																		)}
																		{`${val.referenceDetails[1][0]} ${val.referenceDetails[1][1]}`}
																	</>
																) : (
																	'awaiting action'
																)}
															</td>
															<td>
																<a href='admin_requests_summary.html'>
																	<i className='fa fa-file-o'></i>
																	&nbsp;&nbsp;Summary{' '}
																</a>
															</td>
														</tr>
													))}
												</tbody>
											</table>
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

export default Requests;
