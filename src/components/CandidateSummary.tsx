import { Button, CircularProgress, Collapse } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link, useLocation } from 'react-router-dom';
import { Api, getCandidateSummary, getMinReference } from '../apis';
import {
	getPDF,
	getRefereeDetails,
	getRefereeDetails2,
} from '../apis/user.api';
import { downloadPDF } from '../Common';
import PrettoSlider from './PrettoSlider';
import GoBackLink from './GoBackLink';
import { CandidateSummaryData } from 'apis/radom-types';
import { Questionnaire } from 'apis/types/user-api-types';

const convertDate = (date: any) => {
	var strDateTime = date;
	var myDate = new Date(strDateTime);
	return myDate.toLocaleString();
};

const knownActions = [
	'agreed',
	'verified',
	'declined',
	'accessed',
	'reference submitted',
	'sent request',
];

type FilterRequestText =
	| 'All Requests'
	| 'Last 15 Days'
	| 'Last 30 Days'
	| 'Last 3 Months';

const CandidateSummary = () => {
	const params = useParams();
	const { state: previousTab } = useLocation();
	const [jobhistory, setJobHistory] = useState<any>([]);
	const [collapse, setCollapse] = useState(false);
	const [lifeCycle, setLifeCycle] = useState<CandidateSummaryData['lifeCycle']>(
		[]
	);
	const [candidateFirstName, setCandidateFirstName] = useState('');
	const [candidateLastName, setCandidateLastName] = useState('');
	const [candidateRole, setCandidateRole] = useState('');
	const [candidateEmail, setCandidateEmail] = useState('');
	const [candidatePhone, setCandidatePhone] = useState('');
	const [filterRequestText, setFilterRequestText] =
		useState<FilterRequestText>('All Requests');
	const [inputSearchValue, setInputSearchValue] = useState('');
	const [questionnaire, setQuestionnaire] =
		useState<NonNullable<Questionnaire>>();

	const [minReference, setMinReference] = useState(2);

	if (!localStorage.getItem('email')) {
		window.location.href = '/signin';
	}

	useEffect(() => {
		const fetchData = async () => {
			const resp = await getCandidateSummary(params.id);
			if (resp.status === 401) {
				window.location.href = '/signin';
				return;
			}
			try {
				if (resp.status !== 200) {
					return;
				}
				const questionnaireUUID = resp?.data?.candidateMore?.questionnaire;
				if (!questionnaire) {
					const { data: questionnaire } = await Api.get<JobHistoryResponse>(
						`/api/get-questionnaire-uuid/${questionnaireUUID}`
					);
					setQuestionnaire(questionnaire);
				}
				const references = resp.data.candidateMore.references;
				setCandidateRole(resp.data.candidateMore.role);
				setCandidateFirstName(resp.data.candidate.firstName);
				setCandidateLastName(resp.data.candidate.lastName);
				setCandidateEmail(resp.data.candidate.email);
				setCandidatePhone(resp.data.candidate.phone);
				setLifeCycle(
					resp.data.lifeCycle.toSorted((a, b) => {
						return new Date(b.created_at) < new Date(a.created_at) ? -1 : 1;
					})
				);
				setJobHistory(resp.data.jobHistory);
				const arr: any[] = [];
				if (references) {
					references.forEach(async (item: any) => {
						const resp = await getRefereeDetails(item);
						const resp2 = await getRefereeDetails2(resp.data.refree);
						arr.push({ ...resp2.data, ...resp.data });
						if (references.length === arr.length) {
							setJobHistory(arr);
						}
					});
				}
				setCollapse(true);
				if (resp.data.candidateMore.min_reference == null) {
					const res = await getMinReference(params.id ? params.id : '');
					setMinReference(res.data.min_reference);
				} else {
					setMinReference(resp.data.candidateMore.min_reference);
				}
			} catch (err) {
				console.error(err);
			}
		};
		fetchData();
	}, [params.id]);

	const formatDate = (dateString: any) => {
		if (dateString) {
			let d = new Date(dateString);
			let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
			let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
			// let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
			return month + ' ' + year;
		}
	};

	const formatFilterDate = (dateString: any) => {
		if (dateString) {
			let d = new Date(dateString);
			let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
			let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
			let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
			return year + '-' + month + '-' + day;
		}
	};

	const displayFilteredRequests = async (
		days: number,
		text: FilterRequestText
	) => {
		const date = new Date();
		date.setDate(date.getDate() - days);
		setFilterRequestText(text);
		const resp = await getCandidateSummary(params.id);
		const filteredLifecycle = resp.data.lifeCycle
			.filter(item => new Date(item.date) > new Date(formatFilterDate(date)!))
			.sort((a, b) => {
				return new Date(b.created_at) < new Date(a.created_at) ? -1 : 1;
			});
		setLifeCycle(filteredLifecycle);
	};

	const handleSearchText = async (e: any) => {
		setInputSearchValue(e.target.value);
		const resp = await getCandidateSummary(params.id);
		let search = e.target.value;
		if (resp.data.lifeCycle) {
			const filteredData = resp.data.lifeCycle?.flatMap(item => {
				const a =
					item.name.toLowerCase() +
					item.action.toLowerCase() +
					item.date.toLowerCase() +
					item.userType.toLowerCase();
				const b = a.match(search);
				if (b != null) {
					return [item];
				}
				return [];
			});

			if (filteredData.length === 0) {
			}
			setLifeCycle(
				filteredData.sort((a, b) => (b.created_at < a.created_at ? -1 : 1))
			);
		}
	};

	const [loader, setLoader] = useState({ state: false, jobId: null });
	const handleExportClick = async (jobId: any) => {
		if (loader.state) return;
		setLoader({ state: true, jobId: jobId });
		const pdf = await getPDF(jobId);
		const file = new Blob([pdf.data], {
			type: 'application/pdf; charset=utf-8',
		});
		(file as any).name =
			`${candidateFirstName} ${candidateLastName}'s reference - ${jobhistory.organization}`;
		downloadPDF(file as any);
		setLoader({ state: false, jobId: null });
	};

	return (
		<>
			<GoBackLink
				relative={false}
				previousTab={previousTab}
			/>
			<div className='card-plain'>
				<div className='card-body'>
					<div className='row'>
						<div className='col-md-12'>
							<div className='card-plain bb10'>
								<div className='row'>
									<div className='col-md-4'>
										<h3>Request Summary</h3>
									</div>
									<div
										className='col-md-8 showonmobile'
										style={{ display: `none` }}
									>
										<div className='btn-group setmobile'>
											<div className='dropdown-menu'>
												<a
													className='dropdown-item'
													href='#noop'
												>
													<div className='form-check'>
														{/* <label className="txt_body">
                                      <input
                                        className=""
                                        type="checkbox"
                                        value=""
                                      />
                                      Elvine AsLn
                                    </label> */}
													</div>
												</a>
												{/* <!-- <div className="dropdown-divider"></div> --> */}
												<div className='clearfix'></div>
												<div className='box-pad-sm text-center'>
													<a
														href='#noop'
														className='btn btnxs btn-secondary-outline'
													>
														Cancel
													</a>
													<a
														href='#noop'
														className='btn btnxs btn-primary'
													>
														Export
													</a>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='row pb2'>
				<div className='col info-box'>
					<div className='row'>
						<div className='col'>
							<p className='title'>Candidate</p>
							{/* candidate info */}
							<p className='ref-name'>
								{candidateFirstName} {candidateLastName}
							</p>
						</div>
						<div className='col'>
							<table className='noborder'>
								<tbody>
									<tr>
										<td>
											<b>Job Title</b>
										</td>
										<td className='text-primary fw300'>
											<strong>{candidateRole}</strong>
										</td>
									</tr>
									<tr>
										<td>
											<b>E-mail</b>
										</td>
										<td>{candidateEmail}</td>
									</tr>
									<tr>
										<td>
											<b>Phone</b>
										</td>
										<td>{candidatePhone}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className='col'>
							<p className='title'>Criteria</p>
							<p className='details'>
								{minReference === 1 ? (
									<>{minReference} Reference Minimum</>
								) : (
									<>{minReference} References Minimum</>
								)}

								<br />
								{questionnaire?.questionnaire_title}
								<a
									data-toggle='modal'
									data-target='#question'
									href='#noop'
								>
									&nbsp;show
								</a>
							</p>
						</div>
						<div
							className='modal fade'
							id='question'
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
											Questionnaire
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
											<div className='model_scroll1'>
												<ul id='questionnaire'>
													<li>
														<div>
															<table className='quest'>
																{questionnaire?.questionList?.map((val, i) => (
																	<tr key={val.uuid}>
																		<td>{i + 1}.</td>
																		<p className='question'>{val.question}</p>
																		{val.rateFlag && (
																			<div
																				className='row pmzero'
																				style={{
																					position: 'relative',
																					bottom: '25px',
																				}}
																			>
																				<div className='col-md-6'>
																					<div className='range-slider'>
																						<span
																							className='range-slider__value'
																							style={{ marginRight: '20px' }}
																						>
																							0
																						</span>
																						<PrettoSlider
																							className='slider-value'
																							valueLabelDisplay='auto'
																							aria-label='pretto slider'
																							step={1}
																							marks
																							min={0}
																							max={5}
																							value={0}
																							defaultValue={0}
																							style={{
																								width: '75%',
																								position: 'absolute',
																							}}
																						/>
																					</div>
																				</div>
																			</div>
																		)}
																	</tr>
																))}
															</table>
														</div>
													</li>
												</ul>
												<br />
												<br />
											</div>
										</div>
									</div>
									<div className='modal-footer'>
										<button
											type='button'
											className='btn btn-secondary-outline'
											data-dismiss='modal'
										>
											Close
										</button>
									</div>
								</div>
							</div>
						</div>
						<div className='col pt2 hideonmobile'>
							<div className='btn-group'>
								{/* <button
                          type="button"
                          className="btn btn-secondary dropdown-toggle"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Export Request
                        </button> */}
								<div className='dropdown-menu'>
									<a
										className='dropdown-item'
										href='#noop'
									>
										<div className='form-check'>
											{/* <label className="txt_body">
                                <input className="" type="checkbox" value="" />
                                &nbsp;Elvine AsLn
                              </label> */}
										</div>
									</a>
									{/* <!-- <div className="dropdown-divider"></div> --> */}
									<div className='clearfix'></div>
									<div className='box-pad-sm text-center'>
										<a
											href='#noop'
											className='btn btnxs btn-secondary-outline'
										>
											Cancel
										</a>
										<a
											href='#noop'
											className='btn btnxs btn-primary'
										>
											Export
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='row pb2 nopb'>
				<div
					className='col info-box-white'
					style={{ paddingInline: '0' }}
				>
					<Collapse in={collapse}>
						<div className='grid'>
							{jobhistory.map((localState: any, index: any) => {
								return localState.emailFlag ? (
									<div
										className='col-sm-10 col-md-6 col-lg-6 bg-gray'
										style={{ minWidth: '100%', maxWidth: '100%' }}
									>
										<div
											className='row'
											key={localState.id}
										>
											<div className='col'>
												<p className='title'>Referee {index + 1}</p>
												<p className='ref-name'>
													{localState.refereeFirstName}{' '}
													{localState.refereeLastName}
												</p>
											</div>
											<div className='col push-right text-right'>
												{localState.refereeResponse === 'Accepted' ? (
													<h4 className='text-secondary px-4'>
														<Link
															to={
																'/home/reference/status/' +
																params.id +
																'/' +
																localState.uuid
															}
														>
															Answered
															<Tooltip
																placement='top'
																title='Referee has responded to the questionnaire.'
															>
																<ThumbUpAltOutlinedIcon
																	style={{
																		position: 'absolute',
																		cursor: 'pointer',
																		color: '#1396ed',
																		marginLeft: '5px',
																	}}
																/>
															</Tooltip>
														</Link>
													</h4>
												) : (
													<h4
														className='text-secondary'
														style={{ paddingRight: '30px' }}
													>
														{localState.refereeResponse === 'Declined' ||
														localState.refereeResponse === 'declined'
															? 'Request Declined'
															: localState.refereeResponse === 'Agreed'
																? 'Request Agreed'
																: 'Requested'}
														{localState.refereeResponse === 'Declined' ||
														localState.refereeResponse === 'declined' ? (
															<Tooltip
																placement='top'
																title='Referee has declined the request.'
															>
																<ThumbDownAltOutlinedIcon
																	style={{
																		color: '#ED642A',
																		position: 'absolute',
																		cursor: 'pointer',
																		marginLeft: '5px',
																	}}
																/>
															</Tooltip>
														) : (
															<Tooltip
																placement='top'
																title='Once we receive the response from referee you can view the results'
															>
																<InfoIcon
																	style={{
																		color: '#ED642A',
																		position: 'absolute',
																		cursor: 'pointer',
																	}}
																/>
															</Tooltip>
														)}
													</h4>
												)}

												<p
													className='details'
													style={{ position: 'absolute', right: '5%' }}
												>
													{/* Jan 08/2021 7-30AM */}
													{localState.refereeResponse === 'Accepted' ? (
														<div
															style={{
																width: '110px',
																display: 'flex',
																flexDirection: 'column',
																marginLeft: 'auto',
															}}
														>
															<Link
																to={`/home/reference/status/${params.id}/${localState.uuid}`}
																className='btn btnsm btn-secondary'
																aria-label='Close'
															>
																Results
															</Link>
															<Button
																variant='contained'
																size='large'
																disabled={
																	loader.state &&
																	loader.jobId === localState.uuid
																}
																onClick={() =>
																	handleExportClick(localState.uuid)
																}
															>
																{loader.state &&
																loader.jobId === localState.uuid ? (
																	<CircularProgress size={15} />
																) : (
																	'Export Result'
																)}
															</Button>
														</div>
													) : (
														''
													)}
													<br />
												</p>
											</div>
										</div>
										<table className='noborder'>
											<tbody>
												<tr>
													<td>
														<b>Organization</b>
													</td>
													<td className='text-primary fw300'>
														<strong>{localState.organization}</strong>
													</td>
												</tr>
												<tr>
													<td>
														<b>Job Title</b>
													</td>
													<td>
														<strong>{localState.refereeJobTitle}</strong>
													</td>
												</tr>
												<tr>
													<td>
														<b>E-mail</b>
													</td>
													<td>{localState.refereeEmail}</td>
												</tr>
												<tr>
													<td>
														<b>Phone</b>
													</td>
													<td>{localState.refereePhone}</td>
												</tr>
											</tbody>
										</table>
										<div className='period'>
											<h5 className='hr-blue'>
												{localState.refwork.cyeardiff} Years
											</h5>

											<p className='details'>
												{formatDate(
													localState.partStartDate
														? localState.partStartDate
														: localState.startDate
												)}
												{' - '}
												{!!localState.endDate
													? formatDate(
															localState.partEndDate
																? localState.partEndDate
																: localState.endDate
														)
													: 'Present'}
											</p>
										</div>
									</div>
								) : null;
							})}
						</div>
					</Collapse>
				</div>
			</div>
			<div
				className='showonmobile'
				style={{ display: `none` }}
			>
				<div className='lrpad'>
					<div className='row'>
						<div className='col-md-6'>
							<h3>Life Cycle Data</h3>
						</div>
						<div className='col-md-6 text-right'>
							<div className='btn-group setmobile'>
								<button
									type='button'
									className='btn btnsm btn-secondary'
									onClick={() => {
										if (filterRequestText === 'All Requests') {
											return displayFilteredRequests(15, 'Last 15 Days');
										}
										if (filterRequestText === 'Last 15 Days') {
											return displayFilteredRequests(30, 'Last 30 Days');
										}
										if (filterRequestText === 'Last 30 Days') {
											return displayFilteredRequests(90, 'Last 3 Months');
										}
										if (filterRequestText === 'Last 3 Months') {
											return displayFilteredRequests(1000, 'All Requests');
										}
									}}
								>
									{filterRequestText}
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
									<a
										className='dropdown-item'
										href='#noop'
										onClick={() =>
											displayFilteredRequests(1000, 'All Requests')
										}
									>
										All Requests
									</a>
									<a
										className='dropdown-item'
										href='#noop'
										onClick={() => displayFilteredRequests(15, 'Last 15 Days')}
									>
										last 15 days
									</a>
									<a
										className='dropdown-item'
										href='#noop'
										onClick={() => displayFilteredRequests(30, 'Last 30 Days')}
									>
										last 30 days
									</a>
									<a
										className='dropdown-item'
										href='#noop'
										onClick={() => displayFilteredRequests(90, 'Last 3 Months')}
									>
										last 3 months
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='search-box'>
					<div className='col-md-4'>
						<form className='navbar-form'>
							<div className='input-group no-border'>
								<i className='material-icons sr_icon'>search</i>
								<input
									value={inputSearchValue}
									type='text'
									onChange={handleSearchText}
									className='form-control'
									placeholder='Search...'
									maxLength={40}
								/>
							</div>
						</form>
					</div>
				</div>
				{lifeCycle.map((item, index) => {
					let borderColor = 'border-blue-400';
					switch (item.userType.toLowerCase()) {
						case 'referee': {
							borderColor = 'border-credibledOrange';
							break;
						}
						case 'system': {
							borderColor = 'border-credibledPurple';
							break;
						}
						case 'candidate': {
							borderColor = 'border-green-400';
							break;
						}
					}
					return (
						<table
							className={`mobile-data-table table border-y-0 border-l-8 border-r-0 ${borderColor}`}
							key={index}
						>
							<tbody>
								<tr>
									<td>User Type</td>
									<td className='capitalize'>{item.userType}</td>
								</tr>
								<tr>
									<td>Name</td>
									<td className='capitalize'>{item.name?.split(' ').at(0)}</td>
								</tr>
								<tr>
									<td>Action</td>
									<td>
										{item.action === 'Reference Submitted' ? (
											<Link
												className='font-medium text-black underline hover:decoration-2'
												to={
													'/home/reference/status/' +
													params.id +
													'/' +
													item.refereeUUID
												}
												data-toggle='popover'
												data-content='Credibled questionnaire answered by the Referee'
											>
												{item.action}
											</Link>
										) : (
											<span
												className='fw400'
												data-toggle='popover'
												data-content='Credibled request verified by the Referee'
											>
												{item.action}
											</span>
										)}
									</td>
								</tr>
								<tr>
									<td>Date</td>
									<td>{convertDate(item.created_at)}</td>
								</tr>
								<tr>
									<td>OS-Browser</td>
									<td> {item.osBrowser}</td>
								</tr>
								<tr>
									<td>IP Address</td>
									<td> {item.ipAddress}</td>
								</tr>
								<tr>
									<td>Location</td>
									<td> {item.locationISP}</td>
								</tr>
							</tbody>
						</table>
					);
				})}
				<br />
				<br />
			</div>
			<div className='row hideonmobile'>
				<div className='col-md-12'>
					<div className='card mt_zero pad_zero'>
						<div className='search-box'>
							<div className='col-md-12'>
								<div className='row'>
									<div className='col-md-3 col-sm-6'>
										<form className='navbar-form'>
											<div className='input-group no-border'>
												<i className='material-icons sr_icon'>search</i>
												<input
													value={inputSearchValue}
													type='text'
													onChange={handleSearchText}
													className='form-control'
													placeholder='Search...'
													maxLength={40}
												/>
											</div>
										</form>
									</div>
									<div
										className='col pt1 no-mobile text-right'
										style={{ display: 'none' }}
									>
										<div className='form-check form-check-inline'>
											<label className='form-check-label'>
												<div className='circle1 green'>&nbsp;</div>
												<input
													className='form-check-input'
													type='checkbox'
													id='inlineCheckbox1'
													value='option1'
												/>
												Criteria Met
												<span className='form-check-sign'>
													<span className='check'></span>
												</span>
											</label>
										</div>
										<div className='form-check form-check-inline'>
											<label className='form-check-label'>
												<div className='circle1 amber'>&nbsp;</div>
												<input
													className='form-check-input'
													type='checkbox'
													id='inlineCheckbox2'
													value='option2'
												/>
												Pending
												<span className='form-check-sign'>
													<span className='check'></span>
												</span>
											</label>
										</div>
										<div className='form-check form-check-inline'>
											<label className='form-check-label'>
												<div className='circle1 red'>&nbsp;</div>
												<input
													className='form-check-input'
													type='checkbox'
													id='inlineCheckbox3'
													value='option3'
												/>
												Rejected
												<span className='form-check-sign'>
													<span className='check'></span>
												</span>
											</label>
										</div>
										<div className='form-check form-check-inline'>
											<label className='form-check-label'>
												<div className='circle1 gray'>&nbsp;</div>
												<input
													className='form-check-input'
													type='checkbox'
													id='inlineCheckbox3'
													value='option3'
												/>
												Archived
												<span className='form-check-sign'>
													<span className='check'></span>
												</span>
											</label>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className='card-plain lrpad'>
							<div className='row'>
								<div className='col-md-6'>
									<h3>Life Cycle Data</h3>
								</div>
								<div className='col-md-6 text-right'>
									<div className='btn-group'>
										<button
											type='button'
											className='btn btnsm btn-secondary'
											onClick={() => {
												if (filterRequestText === 'All Requests') {
													return displayFilteredRequests(15, 'Last 15 Days');
												}
												if (filterRequestText === 'Last 15 Days') {
													return displayFilteredRequests(30, 'Last 30 Days');
												}
												if (filterRequestText === 'Last 30 Days') {
													return displayFilteredRequests(90, 'Last 3 Months');
												}
												if (filterRequestText === 'Last 3 Months') {
													return displayFilteredRequests(1000, 'All Requests');
												}
											}}
										>
											{filterRequestText}
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
										<div
											className='dropdown-menu'
											id='toggle-head'
											style={{ top: '1px' }}
										>
											<a
												className='dropdown-item'
												href='#!'
												onClick={() =>
													displayFilteredRequests(1000, 'All Requests')
												}
											>
												All Requests
											</a>
											<a
												href='#!'
												className='dropdown-item'
												onClick={() =>
													displayFilteredRequests(15, 'Last 15 Days')
												}
											>
												last 15 days
											</a>
											<a
												href='#!'
												className='dropdown-item'
												// style={{ cursor: "pointer" }}
												onClick={() =>
													displayFilteredRequests(30, 'Last 30 Days')
												}
											>
												last 30 days
											</a>
											<a
												href='#!'
												className='dropdown-item'
												// style={{ cursor: "pointer" }}
												onClick={() =>
													displayFilteredRequests(90, 'Last 3 Months')
												}
											>
												last 3 months
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='table-responsive hideonmobile'>
							<table className='table-hover table'>
								<thead>
									<tr>
										<th className='sorting'>Date</th>
										<th className='sorting'>User Type</th>
										<th className='sorting'>Name</th>
										<th className='sorting'>Events</th>
										<th className='sorting'>OS Browser</th>
										<th className='sorting'>IP Address</th>
										<th className='sorting'>Location</th>
									</tr>
								</thead>
								<tbody>
									{lifeCycle.length > 0 ? (
										lifeCycle.map((item, index) => {
											let borderColor = 'border-blue-400';
											switch (item.userType.toLowerCase()) {
												case 'referee': {
													borderColor = 'border-credibledOrange';
													break;
												}
												case 'system': {
													borderColor = 'border-credibledPurple';
													break;
												}
												case 'candidate': {
													borderColor = 'border-green-400';
													break;
												}
											}
											return (
												<tr
													key={index}
													className={`border-y-0 border-l-8 border-r-0 border-solid ${borderColor}`}
												>
													<td> {convertDate(item.created_at)}</td>
													<td className='capitalize'>
														{item.userType?.toLowerCase() === 'recruiter'
															? 'requester'
															: item.userType}
													</td>
													<td className='capitalize'>
														{item.name?.split(' ').at(0)}
													</td>
													<td>
														{!item?.action
															?.toLowerCase?.()
															.includes('sent request') &&
															!knownActions?.includes?.(
																item?.action?.toLowerCase?.()
															) && (
																<span
																	className='font-medium'
																	data-toggle='popover'
																	data-content='Credibled request verified by the Referee'
																>
																	{item.action}
																</span>
															)}
														{item.action === 'Agreed' ? (
															<span
																className='font-medium'
																data-toggle='popover'
																data-content='Credibled request verified by the Referee'
															>
																{item.action}
															</span>
														) : null}
														{item.action === 'Verified' ? (
															<span
																className='font-medium'
																data-toggle='popover'
																data-content='Credibled request verified by the Referee'
															>
																{item.action}
															</span>
														) : null}
														{item.action === 'Declined' ? (
															<span
																className='font-medium'
																data-toggle='popover'
																data-content='Credibled request verified by the Referee'
															>
																{item.action}
															</span>
														) : null}
														{item.action === 'Accessed' ? (
															<span
																className='font-medium'
																data-toggle='popover'
																data-content='Credibled request verified by the Referee'
															>
																{item.action}
															</span>
														) : null}
														{item.action === 'Reference Submitted' ? (
															<Link
																className='font-medium text-black underline hover:decoration-2'
																to={
																	'/home/reference/status/' +
																	params.id +
																	'/' +
																	item.refereeUUID
																}
															>
																{item.action}
															</Link>
														) : null}
														{item.action.includes('Sent request') ? (
															<span
																className='font-medium'
																data-toggle='popover'
																data-content='Credibled request verified by the Referee'
															>
																{item.action}
															</span>
														) : null}
													</td>
													<td>{item.osBrowser}</td>
													<td>{item.ipAddress ?? 'NA'}</td>
													<td>
														{item.locationISP === 'null' || !item.locationISP
															? 'NA'
															: (item.locationISP
																	?.split('/')
																	.filter((v: string) => v !== 'undefined')
																	.join(' ') ?? '')}
													</td>
												</tr>
											);
										})
									) : (
										<tr>
											<td className='br_amber text-center'></td>
											<td>Sorry, {localStorage.getItem('firstName')}</td>
											<td>We couldn't find any records matching your query</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

const jobHistoryResponse = {
	uuid: '1a07ca15-fc8b-4136-bb9e-6e097cc9f255',
	created_at: '2023-07-03T14:43:17.171180Z',
	updated_at: '2023-07-12T13:14:38.454113Z',
	questionnaire_title: 'questionnaire_client1',
	job_title: 'Gaming1',
	type: null,
	noOfQuestions: 2,
	timesUsed: 1,
	is_active: false,
	is_archived: false,
	is_client_created: true,
	recruiter: 191,
	industry: 'd6ffe541-55a7-4652-8eb4-2aec852f6932',
	questionList: [
		{
			uuid: 'fee57ad7-a493-4518-a086-b7d09a149a31',
			created_at: '2023-02-17T16:06:35.171590Z',
			updated_at: '2023-07-03T14:43:17.162776Z',
			question:
				'Please describe their ability to manage conflict and de-escalate stressful situations.',
			numberOfTimesUsed: 1,
			rateFlag: false,
			default: false,
			mandatory: false,
			bucket: 'Personal Attributes',
		},
	],
};

export type JobHistoryResponse = typeof jobHistoryResponse;

export default CandidateSummary;
