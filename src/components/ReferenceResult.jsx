/* eslint-disable eqeqeq */
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { API } from '../Api';
import {
	getCandidateSummary,
	getJobHistorybyId,
	getPDF,
	getQuestionnaireResponse,
} from '../apis';
import { getQuestionnaireForReferee } from '../apis/user.api';
import { downloadPDF } from '../Common';
import GoBackLink from './GoBackLink';
import { LoadingButton } from '@mui/lab';

const PREFIX = 'ReferenceResult';

const classes = {
	root: `${PREFIX}-root`,
	thumb: `${PREFIX}-thumb`,
	active: `${PREFIX}-active`,
	valueLabel: `${PREFIX}-valueLabel`,
	track: `${PREFIX}-track`,
	rail: `${PREFIX}-rail`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
	[`& .${classes.root}`]: {
		color: '#250c77',
		height: 8,
		width: '80%',
		position: 'absolute',
	},
	[`& .${classes.thumb}`]: {
		height: 24,
		width: 24,
		backgroundColor: '#ef7441',
		// border: "2px solid currentColor",
		'&:focus, &:hover, &$active': {
			boxShadow: 'inherit',
		},
	},
	[`& .${classes.active}`]: {},
	[`& .${classes.valueLabel}`]: {
		left: 'calc(-50% + 4px)',
	},
	[`& .${classes.track}`]: {
		height: 8,
		borderRadius: 4,
	},
	[`& .${classes.rail}`]: {
		height: 8,
		borderRadius: 4,
	},
});

function ReferenceResult({ timestamp }) {
	const params = useParams();
	const [loading, setLoading] = useState(false);
	const [jobhistory, setJobhistory] = useState({});
	const [candidateFirstName, setCandidateFirstName] = useState('');
	const [candidateLastName, setCandidateLastName] = useState('');
	const [candidateRole, setCandidateRole] = useState('');
	const [candidateEmail, setCandidateEmail] = useState('');
	const [candidatePhone, setCandidatePhone] = useState('');
	const [candidateWork, setCandidateWork] = useState('');
	const [refreeWork, setrefreeWork] = useState('');
	const [candidatePeriod, setCandidatePeriod] = useState('');
	const [, setSliderVal1] = useState(0);
	const [, setSliderVal2] = useState(0);
	const [, setSliderVal3] = useState(0);
	const [, setSliderVal4] = useState(0);
	const [, setSliderVal5] = useState(0);
	const [, setSliderVal6] = useState(0);
	const [, setSliderVal7] = useState(0);
	const [, setSliderVal8] = useState(0);
	const [, setSliderVal9] = useState(0);
	const [, setAnswer1] = useState('');
	const [, setAnswer2] = useState('');
	const [, setAnswer3] = useState('');
	const [, setAnswer4] = useState('');
	const [, setAnswer5] = useState('');
	const [, setAnswer6] = useState('');
	const [, setAnswer7] = useState('');
	const [, setAnswer8] = useState('');
	const [, setAnswer9] = useState('');
	const [, setAnswer10] = useState('');
	const [templateResponse, setTemplateResponse] = useState('');
	const [questionnaire] = useState('');
	const [qtnType] = useState('');
	const [, setQuestionList] = useState('');
	const [recruiterEmail] = useState('');
	const [employmentType, setEmploymentType] = useState('');
	const [employmentRole, setEmploymentRole] = useState('');
	const [page] = useState(false);
	const [questionsAnswers, setQuestionsAnswers] = useState([]);
	const [isSameIP, setIsSameIP] = useState(false);
	const [isBusinessEmail, setIsBusinessEmail] = useState(true);
	const navigate = useNavigate();
	useEffect(() => {
		if (!Cookies.get('refresh')) navigate('/signin');
	}, [navigate]);

	useEffect(() => {
		(async () => {
			const resp = await getCandidateSummary(params.candidateId);
			if (resp.status === 200) {
				setCandidateRole(resp.data.candidateMore.role);
				setCandidateFirstName(resp.data.candidate.firstName);
				setCandidateLastName(resp.data.candidate.lastName);
				setCandidateEmail(resp.data.candidate.email);
				setCandidatePhone(resp.data.candidate.phone);

				let deta = resp.data.jobHistory.filter(
					item => item.uuid === params.jobId
				);
				setCandidateWork(deta[0].refwork.mrefwork);
				setCandidatePeriod(deta[0].ctenure.ctenure);
				if (
					deta[0].refwork.rtenure !== '' &&
					deta[0].refwork.rtenure !== undefined &&
					deta[0].refwork.rtenure !== null
				) {
					setrefreeWork(deta[0].refwork.rtenure);
				} else {
					setrefreeWork((deta[0].refwork.rtenure = ''));
				}
				setEmploymentType(deta[0].employmentType);
				setEmploymentRole(deta[0].candidateRole);
			}
			const response = await getJobHistorybyId(params.jobId);
			let obj = {};
			if (response.status === 200) {
				const { data } = response;
				const { isSameIP, isBusinessEmail } = data;
				setIsBusinessEmail(isBusinessEmail);
				setIsSameIP(isSameIP);
				fetch(
					`${import.meta.env.VITE_API_URL}/api/refree/${response.data.refree}`
				)
					.then(resp => resp.json())
					.then(json => {
						obj = json;
						setJobhistory({ ...response.data, ...obj });
					});
				if (response.status === 401) {
					window.location.href = '/signin';
				}
			}

			const { data } = await getQuestionnaireResponse(params.jobId);
			const { responseList } = data;
			const { questionList } = await getQuestionnaireForReferee(params.jobId);
			const questionAnswerMap = [];
			for (let i in responseList) {
				questionAnswerMap.push({
					uuid: questionList[i].uuid,
					question: questionList[i].question,
					response: responseList[i].response,
					rateFlag: questionList[i].rateFlag,
					rating: responseList[i].rating,
					comment: responseList[i].comment,
				});
			}
			setQuestionsAnswers(questionAnswerMap);
			for (let x in data) {
				if (data[x]) {
					if (
						/[" "]/.test(data[x]) == false &&
						/[a-zA-Z]/.test(data[x]) == true &&
						data[x].length > 50
					) {
						let str = data[x].split('');
						let str2 = '';

						for (let i = 0; i < str.length - 1; i++) {
							str2 = str2 + str[i];
							if (i % 36 == 0 && i != 0) {
								str2 = str2 + ' ';
							}
						}
						if (str2.length > data[x].length) {
							data[x] = str2;
						}
					}
				}
			}

			setAnswer1(data.question1);
			setAnswer2(data.question2);
			setAnswer3(data.question3);
			setAnswer4(data.question4);
			setAnswer5(data.question5);
			setAnswer6(data.question6);
			setAnswer7(data.question7);
			setAnswer8(data.question8);
			setAnswer9(data.question9);
			setAnswer10(data.question10);
			setSliderVal1(data.rating1);
			setSliderVal2(data.rating2);
			setSliderVal3(data.rating3);
			setSliderVal4(data.rating4);
			setSliderVal5(data.rating5);
			setSliderVal6(data.rating6);
			setSliderVal7(data.rating7);
			setSliderVal8(data.rating8);
			setSliderVal9(data.rating9);
			setTemplateResponse(data.questionnaireResponse);
		})();
	}, [params.candidateId, params.jobId]);

	useEffect(() => {
		if (qtnType === 'user') {
			API.getTemplates({ questionnaire, email: recruiterEmail }).then(resp => {
				if (resp[0].questions) {
					setQuestionList(resp[0].questions);
				}
			});
		}
	}, [qtnType, questionnaire, recruiterEmail]);

	const renderTemplateResponse = questionnaireResponse => {
		var count = 1;
		var responseArr = questionnaireResponse.split('`CREDDIV`');
		for (let i = 0; i < responseArr.length; i++) {
			var cred_ans_id = 'qtn_' + count + '_ans';
			if (document.getElementById(cred_ans_id)) {
				document.getElementById(cred_ans_id).innerText = responseArr[i];
			}

			count++;
		}
	};

	useEffect(() => {
		if (templateResponse) {
			renderTemplateResponse(templateResponse);
		}
	});

	const PrettoSlider = Slider;

	const PdfFromApi = async () => {
		if (loading) return;
		setLoading(true);
		const pdf = await getPDF(params.jobId);
		//console.log(pdf.data)
		const file = new Blob([pdf.data], {
			type: 'application/pdf; charset=utf-8',
		});
		file.name = `${candidateFirstName} ${candidateLastName}'s reference - ${jobhistory.organization}`;
		downloadPDF(file);
		setLoading(false);
	};

	if (page == true)
		return (
			<>
				<h1>Please wait while we generate the pdf</h1>
			</>
		);
	else
		return (
			<Root>
				<GoBackLink relative={false} />
				<div className='card-plain'>
					<div className='card-body'>
						<div className='row'>
							<div className='col-md-12'>
								<div className='card-plain bb10'>
									<div className='row'>
										<div className='col-md-4 result-header'>
											<h3> Results</h3>
										</div>
										<div
											className='col-md-8 showonmobile'
											style={{ display: 'none' }}
										>
											<div className='btn-group setmobile'>
												{/* <input
                               type="button"
                               className="btn btn-secondary"
                               onClick={exportPDF}
                               value="Export Request"
                             /> */}
												<div className='dropdown-menu'>
													<a
														className='dropdown-item'
														href='#!'
													>
														<div className='form-check'></div>
													</a>
													<div className='clearfix'></div>
													<div className='box-pad-sm text-center'>
														<a
															href='#!'
															className='btn btnxs btn-secondary-outline'
														>
															Cancel
														</a>
														<a
															href='#!'
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
				{/* fffffffff */}
				<div className='row mx-0'>
					<div className='col info-box-white m-0 p-0'>
						<div className='grid'>
							<div
								className='col bg-gray mbzero check-me-then'
								style={{ minWidth: '100%', maxWidth: '100%' }}
							>
								<div className='row'>
									<div className='col'>
										<p className='title candidate-title'>Candidate :</p>
										<p className='ref-name'>
											{candidateFirstName} {candidateLastName}
										</p>
									</div>
									<div className='col push-right pt1 text-right'>
										<div className='btn-group'>
											<LoadingButton
												onClick={PdfFromApi}
												loading={loading}
												variant='contained'
											>
												Export Result
											</LoadingButton>
											<div className='dropdown-menu'>
												<a
													className='dropdown-item'
													href='#!'
												>
													<div className='form-check'></div>
												</a>
												<div className='clearfix'></div>
												<div className='box-pad-sm text-center'>
													<a
														href='#!'
														className='btn btnxs btn-secondary-outline'
													>
														Cancel
													</a>
													<a
														href='#!'
														className='btn btnxs btn-primary'
													>
														Export
													</a>
												</div>
											</div>
										</div>
									</div>
									<div className='col-12'>
										<table className='noborder'>
											<tbody>
												<tr>
													<td nowrap='nowrap'>
														<b>Job Title :</b>
													</td>
													<td className='text-primary fw300'>
														<strong>{candidateRole}</strong>
													</td>
												</tr>
												<tr>
													<td>
														<b>E-mail :</b>
													</td>
													<td className='overflow-wrap-anywhere pre'>
														{candidateEmail}
													</td>
												</tr>
												<tr>
													<td>
														<b>Phone :</b>
													</td>
													<td>{candidatePhone}</td>
												</tr>
												<tr>
													<td>
														<b>Employment Type :</b>
													</td>
													<td>{employmentType}</td>
												</tr>
												<tr>
													<td>
														<b>Role at the time :</b>
													</td>
													<td>{employmentRole}</td>
												</tr>
											</tbody>
										</table>
										<div className='period'>
											<h6 className='hr-blue text-secondary'>
												{candidateWork} {candidatePeriod}
												{/* Reference covers the period of{" "}
                      {getYearDiff(
                        jobhistory.partStartDate ? jobhistory.partStartDate : jobhistory.startDate,
                        jobhistory?.partEndDate ? jobhistory?.partEndDate : jobhistory.endDate
                      )}{" "}
                      Years as {candidateFirstName} {candidateLastName} was employed from {" "}
                      {formatDate(jobhistory.partStartDate ? jobhistory.partStartDate : jobhistory.startDate)} to {" "}
                      {!!jobhistory.endDate
                        ? formatDate(jobhistory?.partEndDate ? jobhistory?.partEndDate : jobhistory.endDate)
                        : "present"} */}
											</h6>
											<p className='details'>{refreeWork}</p>
											{/* {jobhistory.partStartDate && <p className="details">
                      Feedback covers {diff_year_month_day(jobhistory.partEndDate, jobhistory.partStartDate)}
                      ({jobhistory?.partEndDate?.split('-')[2]} {formatDate(jobhistory?.partStartDate)} - {jobhistory?.partEndDate.split('-')[2]} {formatDate(jobhistory?.partEndDate)})
                    </p>} */}
										</div>
									</div>
								</div>
							</div>
							<div className='col bg-gray mbzero check-me-then'>
								<div className='row'>
									<div className='col'>
										<p className='title referee-title'>Referee :</p>
										<p className='ref-name referee-name'>
											{jobhistory.refereeFirstName} {jobhistory.refereeLastName}
										</p>
									</div>
									<div className='col push-right answered-selector text-right'>
										{jobhistory.refereeResponse === 'Accepted' ? (
											<h4
												className='text-secondary answered-ico'
												style={{ paddingRight: '30px' }}
											>
												{' '}
												<Link>
													Answered
													<Tooltip
														placement='top'
														title='Referee has responded to the questionnaire.'
													>
														<ThumbUpAltOutlinedIcon
															style={{
																position: 'absolute',
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
												{' '}
												Requested
											</h4>
										)}
									</div>
								</div>
								<table className='noborder'>
									<tbody>
										<tr>
											<td>
												<b>Organization :</b>
											</td>
											<td className='text-primary fw300'>
												<strong>{jobhistory.organization}</strong>
											</td>
										</tr>
										<tr>
											<td>
												<b>Job Title :</b>
											</td>
											<td>
												<strong>{jobhistory.refereeJobTitle}</strong>
											</td>
										</tr>
										<tr>
											<td>
												<b>E-mail :</b>
											</td>
											<td className='overflow-wrap-anywhere pre'>
												{jobhistory.refereeEmail}
											</td>
										</tr>
										<tr>
											<td>
												<b>Phone :</b>
											</td>
											<td>{jobhistory.refereePhone}</td>
										</tr>
										<tr>
											<td>
												<b>Reference Completed :</b>
											</td>
											<td>{timestamp}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				{(isSameIP || !isBusinessEmail) && (
					<div className='mt2'>
						<div
							id='accordion'
							role='tablist'
						>
							<div className='card-collapse'>
								<div
									className='card-header cust-head bg-amberlight pt-3'
									role='tab'
									id='headingOne'
								>
									<h5 className='mb-0'>
										<a
											className='text-danger'
											data-toggle='collapse'
											href='#collapseOne'
											aria-expanded='true'
											aria-controls='collapseOne'
										>
											<span className='display-flex align-items-center'>
												<span>
													<span>
														<i className='material-icons-outlined'>room</i>
													</span>
													<span>
														<i className='material-icons-outlined'>email</i>
														&nbsp;
													</span>
													<span>
														<i className='material-icons-outlined'>monitor</i>
														&nbsp;
													</span>
												</span>
												<span className='position-relative bottom-1'>
													Unusual activity found!
												</span>
												<span className='fa fa-fw fa-angle-down position-absolute font-size-lg right-5'></span>
											</span>
										</a>
									</h5>
								</div>
								{
									<div
										id='collapseOne'
										className='gray-box show collapse'
										role='tabpanel'
										aria-labelledby='headingOne'
										data-parent='#accordion'
									>
										<div className='card-body'>
											<table
												className='quest'
												cellPadding='5px'
											>
												<tbody>
													<tr>
														<td colSpan='2'>
															<h4 className='mt-0'>Reasons for the alert</h4>
														</td>
													</tr>
													{isSameIP && (
														<tr>
															<td>
																<i className='text-danger material-icons-outlined'>
																	room
																</i>
															</td>
															<td>
																{capitalize(candidateFirstName)}{' '}
																{capitalize(candidateLastName)} and{' '}
																{capitalize(jobhistory.refereeFirstName)}{' '}
																{capitalize(jobhistory.refereeLastName)}{' '}
																accessed Credibled from the same IP address{' '}
																<span className='text-danger'>
																	(both the candidate and referee appear to have
																	been at the same location using the same
																	intenet connection).
																</span>
															</td>
														</tr>
													)}
													{!isBusinessEmail && (
														<tr>
															<td>
																<i className='text-danger material-icons-outlined'>
																	email
																</i>
															</td>
															<td>
																{capitalize(jobhistory?.refereeFirstName)}{' '}
																{capitalize(jobhistory?.refereeLastName)}{' '}
																completed the reference request using a personal{' '}
																<span className='text-danger'>
																	(non-professional)
																</span>{' '}
																email address (gmail.com).
															</td>
														</tr>
													)}
												</tbody>
											</table>
										</div>
									</div>
								}
							</div>
						</div>
					</div>
				)}
				<div className='row'>
					<div className='col'>
						<div className='model_scroll1'>
							<ul id='questionnaire'>
								<li className='pl1'>
									<h4>
										Reference from {jobhistory.organization} {'-'}{' '}
										<span className='text-secondary'>
											{jobhistory.refereeFirstName} {jobhistory.refereeLastName}
										</span>
									</h4>
								</li>
								{questionsAnswers.map((val, i) => (
									<li
										className='answer-response'
										key={val.uuid}
									>
										<div className='gray-box1'>
											<table className='quest'>
												<tbody>
													<tr>
														<td>{i + 1}.</td>
														<td className='question'>
															{val.question}
															{val.rateFlag ? (
																<div className='col-md-12'>
																	<div className='range-slider'>
																		<span
																			className='range-slider__value'
																			style={{ marginRight: '20px' }}
																		>
																			{val.rating}
																		</span>
																		<PrettoSlider
																			valueLabelDisplay='auto'
																			aria-label='pretto slider'
																			step={1}
																			marks
																			min={0}
																			max={5}
																			defaultValue={0}
																			style={{
																				width: '300px',
																				position: 'absolute',
																			}}
																			value={val.rating}
																			classes={{
																				root: classes.root,
																				thumb: classes.thumb,
																				active: classes.active,
																				valueLabel: classes.valueLabel,
																				track: classes.track,
																				rail: classes.rail,
																			}}
																		/>
																		<p className='answer'>{val.comment}</p>
																	</div>
																</div>
															) : (
																<p className='answer'>{val.response}</p>
															)}
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</Root>
		);
}

export default ReferenceResult;

export const capitalize = (s = '') =>
	s ? s[0]?.toLocaleUpperCase() + s?.slice(1) : '';
