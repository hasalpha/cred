import { Box, Button, CircularProgress } from '@mui/material';
import Slider from '@mui/material/Slider';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { addQuestionnaireResponse } from '../apis';
import jobInfoInitialState, { errorMessage } from '../apis/types/initial-data';
import { getQuestionnaireForReferee } from '../apis/user.api';
import logo from '../assets/img/credibled_logo_205x45.png';
import {
	detectBrowser,
	getDate,
	useIP,
	useISP,
	useRefereePreferences,
} from '../Common';
import {
	sendCompleteEmail,
	updateCandidateJobHistory,
	updateLifeCycle,
} from './../apis';
import { CommentField } from './CommentField';
import { AnswerTypes, RatingAnswerType } from './types/types';
import Loading from './Loading';
import cloneDeep from 'lodash.clonedeep';

const nonMandatoryQuestions = [
	'Is there anything else of significance we should know? Are there any concerns, compliments or general comments?',
] as const;

function RefereeQuestionnaire() {
	const { current: cityName } = useRef(localStorage.getItem('cityName'));
	const navigate = useNavigate();
	const params = useParams() as {
		id: string;
		candidateName: string;
		refereeName: string;
	};
	const [status, setStatus] = useState('idle');
	const [invalidError, setInvalidError] = useState('');
	const [someErrorMessage, setSomeErrorMessage] = useState('');
	const [answers, setAnswers] = useState<Map<string, AnswerTypes>>(
		new Map<string, AnswerTypes>()
	);
	const [errorQuestionID, setErrorQuestionID] = useState('');

	const { data: refereePreferences } = useRefereePreferences(params.id);
	const { data: ipAddress } = useIP();
	const { data: isp } = useISP();
	const { data: jobInfo, isLoading } = useQuery({
		queryKey: ['questionnaire', params?.id],
		initialData:
			cloneDeep(jobInfoInitialState) ?? Object.assign({}, jobInfoInitialState),
		queryFn: async () => {
			const data = await getQuestionnaireForReferee(params?.id);
			const newAnswers = new Map(answers);
			data.questionList.forEach((v: any) => {
				v.rateFlag
					? newAnswers.set(v.uuid, {
							rating: 0,
							comment: '',
							isMandatory: !nonMandatoryQuestions.some(val =>
								v?.question?.includes(val)
							),
						})
					: newAnswers.set(v.uuid, {
							comment: '',
							isMandatory: !nonMandatoryQuestions.some(val => {
								return v.question.toLowerCase()?.includes(val?.toLowerCase());
							}),
						});
			});
			setAnswers(newAnswers);
			return data;
		},
		refetchOnWindowFocus: false,
		enabled: true,
	});

	if (isLoading || answers.size === 0) {
		return <Loading />;
	}

	const handleSliderChange = (v: any, questionUUID: string, idx: any) => {
		const newAnswers = new Map(answers);
		const answer = newAnswers.get(questionUUID)!;
		newAnswers.set(questionUUID, {
			rating: v,
			comment: answer.comment,
			isMandatory: answer?.isMandatory,
		});
		setAnswers(newAnswers);
		const x = document.getElementById(`qtn_${idx}_Error`) as HTMLElement;
		x.style.display = 'none';
	};

	const handleSubmit = async () => {
		setSomeErrorMessage(
			'There was an Error Processing your Request, Please resubmit or refresh the page.'
		);

		if (navigator.onLine === false) {
			setSomeErrorMessage('Device is offline, please connect to Internet');
			const x = document.querySelector('#errorCode') as HTMLElement;
			x.style.display = 'block';
			return false;
		}

		let idx = 1;
		const refreeResponse = [];
		for (let key of answers.keys()) {
			let qtn_id = `qtn_${idx}`;
			const answer = answers.get(key)!;
			if ('rating' in answer) {
				if (answer.rating === 0 || Number(answer.rating) === 0) {
					document.getElementById(qtn_id)!.focus();
					const x = document.getElementById(qtn_id + '_Error')!;
					x.style.display = 'block';
					x.focus();
					setErrorQuestionID(qtn_id);
					return false;
				}
			} else {
				if (answer.comment === '' || answer.comment.length <= 0) {
					if (answer.isMandatory) {
						document.getElementById(qtn_id)!.focus();
						const x = document.getElementById(qtn_id + '_Error')!;
						x.style.display = 'block';
						setErrorQuestionID(qtn_id);
						return false;
					}
				}
			}
			refreeResponse.push({
				questionUUID: key,
				response: answer.comment,
				rating: !!Number((answer as RatingAnswerType).rating)
					? Number((answer as RatingAnswerType).rating)
					: null,
				...('rating' in answer && { comment: answer?.comment }),
			});
			idx++;
		}
		setStatus('pending');
		const body = { refereeResponse: 'Accepted' };
		let candidateResponse = await updateCandidateJobHistory(params.id, body);

		if (candidateResponse.status !== 200) {
			setStatus('rejected');
			setSomeErrorMessage(
				'There was an Error in Processing candidate response, Please resubmit or refresh the page.'
			);
			const x = document.querySelector('#errorCode') as HTMLElement;
			if (x) x.style.display = 'block';
			return false;
		}

		const bodyAnswered = {
			uuid: params.id,
			name: params.refereeName,
			userType: 'Referee',
			action: 'Reference Submitted',
			date: getDate(),
			osBrowser: detectBrowser(),
			ipAddress: ipAddress ?? null,
			locationISP: cityName ? `${isp}/${cityName}` : isp,
			refereeUUID: params.id,
		};

		let lifeCycleResp = await updateLifeCycle(bodyAnswered);

		if (lifeCycleResp.status !== 201) {
			setStatus('rejected');
			setSomeErrorMessage(
				'There was an Error Processing the lifeCycle data, Please resubmit or refresh the page.'
			);
			const x = document.querySelector('#errorCode') as HTMLElement;
			x.style.display = 'block';
			return false;
		}
		const data = {
			jobHistory_uuid: params.id,
			ipAddress: ipAddress,
			refreeResponse: refreeResponse,
		};
		let questionaireResponseStatus = await addQuestionnaireResponse(data);
		if (questionaireResponseStatus.status !== 200) {
			setStatus('rejected');
			setSomeErrorMessage(
				'There was an Error Processing your response for questionaire, Please resubmit or refresh the page.'
			);
			const x = document.querySelector('#errorCode') as HTMLElement;
			x.style.display = 'block';
			return false;
		}
		await sendCompleteEmail('recruiter', params.id);
		await sendCompleteEmail('candidate', params.id);
		await sendCompleteEmail('referee', params.id);
		setStatus('resolved');
		let nextUrl = '/lead-to-hire/';
		if (refereePreferences) {
			const { is_lead_generation_candidate, is_lead_generation_job } =
				refereePreferences;
			if (!is_lead_generation_job && !is_lead_generation_candidate)
				nextUrl = '/referee-summary/';
			else if (is_lead_generation_job && !is_lead_generation_candidate)
				nextUrl = '/lead-to-job/';
		}
		return navigate(
			`${nextUrl}${params.candidateName}/${params.refereeName}/${params.id}`
		);
	};

	const handleChange = (e: any, questionUUID: string, idx: any) => {
		if (/[<>]/.test(e.target.value) === false) {
			setErrorQuestionID('');
			const value = replaceEmoji(e.target.value);
			const newAnswers = new Map(answers);
			const answer = newAnswers.get(questionUUID)! as RatingAnswerType;
			if (answer.rating !== undefined && answer.comment !== undefined) {
				newAnswers.set(questionUUID, {
					rating: answer.rating,
					comment: value,
					isMandatory: answer.isMandatory,
				});
				setAnswers(newAnswers);
				return;
			} else
				newAnswers.set(questionUUID, {
					comment: value,
					isMandatory: answer.isMandatory,
				});
			setAnswers(newAnswers);
			const x = document.getElementById(`qtn_${idx}_Error`)!;
			x.style.display = 'none';
			const y = document.getElementById(`qtn_${idx}_invalid`)!;
			y.style.display = 'none';
		} else {
			setInvalidError('Invalid input entered');
			const y = document.getElementById(`qtn_${idx}_invalid`)!;
			y.style.display = 'block';
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
						<div className='col-sm-10 col-md-10 col-lg-10 px-0'>
							<div className=''>
								<Link
									className='navbar-brand'
									to='/'
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
										<div className='stepper-step ss25 stepper-step-isActive'>
											<div className='stepper-stepContent step_active_primary'>
												<Link
													to={'/referee-accept/' + params.id}
													className='text-primary'
												>
													<span className='stepper-stepMarker'>1</span>Before we
													begin
												</Link>
											</div>
										</div>
										<div className='stepper-step ss25 stepper-step-isActive'>
											<div className='stepper-stepContent step_active_primary'>
												<Link
													to={
														'/referee-verify/' +
														params.candidateName +
														'/' +
														params.refereeName +
														'/' +
														params.id
													}
													className='text-primary'
												>
													<span className='stepper-stepMarker'>2</span>Verify
													the basics
												</Link>
											</div>
										</div>
										<div className='stepper-step ss25 stepper-step-isActive'>
											<div className='stepper-stepContent step_active'>
												<span className='stepper-stepMarker'>3</span>
												Questionnaire
											</div>
										</div>
									</div>
								</div>

								<div className='row w-100 m-0'>
									<div className='col-md-12 p-0'>
										<ul id='questionnaire'>
											<li className='pl1'>
												<h4 className='text-secondary'>
													{jobInfo?.noOfQuestions} Questions
												</h4>
												<small>
													(&nbsp;
													<span className='sup_char'>*</span> Mandatory)
												</small>
											</li>

											{jobInfo?.questionList?.map((val: any, i: number) => (
												<li key={val.uuid}>
													<div className='gray-box1'>
														<table className='quest'>
															<tbody>
																<tr>
																	<td>{i + 1}</td>
																	<td className='question'>
																		{answers.get(val.uuid)!.isMandatory && (
																			<span className='sup_char'>
																				<sup>* </sup>
																			</span>
																		)}
																		<span className='text-justify'>
																			{val.question}
																		</span>
																		{val.rateFlag ? (
																			<>
																				<h6 className='pt1 ml1'>
																					<span className='inline-block pl-0'>
																						<span className='p-0 pr-1 text-black'>
																							1-
																						</span>
																						Poor
																					</span>
																					<span className='inline-block pl-0'>
																						<span className='p-0 pr-1 text-black'>
																							2-
																						</span>
																						Average
																					</span>
																					<span className='inline-block pl-0'>
																						<span className='p-0 pr-1 text-black'>
																							3-
																						</span>
																						Fair
																					</span>
																					<span className='inline-block pl-0'>
																						<span className='p-0 pr-1 text-black'>
																							4-
																						</span>
																						Good{' '}
																					</span>
																					<span className='inline-block pl-0'>
																						<span className='p-0 pr-1 text-black'>
																							5-
																						</span>
																						Excellent
																					</span>
																				</h6>
																				<span
																					tabIndex={0}
																					className='notes'
																					id={`qtn_${i + 1}_Error`}
																					style={{
																						display: `none`,
																						textAlign: 'center',
																					}}
																				>
																					Ratings are Required
																					<input
																						id='ratingRequired'
																						style={{
																							opacity: '0',
																							width: '0',
																						}}
																					/>
																				</span>
																				<div
																					className='col-md-6'
																					id={`qtn_${i + 1}`}
																				>
																					<div className='range-slider position-relative mb-3'>
																						<span
																							className='range-slider__value'
																							style={{ marginRight: '20px' }}
																						>
																							{
																								(
																									answers.get(
																										val.uuid
																									) as RatingAnswerType
																								)?.rating
																							}
																						</span>
																						<Slider
																							valueLabelDisplay='auto'
																							step={1}
																							marks
																							min={0}
																							max={5}
																							value={
																								(
																									answers.get(
																										val.uuid
																									) as RatingAnswerType
																								)?.rating ?? 0
																							}
																							onChange={(_, v) =>
																								handleSliderChange(
																									v,
																									val.uuid,
																									i + 1
																								)
																							}
																							style={{
																								width: '75%',
																								position: 'absolute',
																							}}
																						/>
																					</div>
																					<div className='form-group bmd-form-group'>
																						<input
																							value={
																								answers.get(val.uuid)
																									?.comment ?? ''
																							}
																							placeholder='Your comments:'
																							maxLength={500}
																							className='form-control'
																							onChange={e =>
																								handleChange(e, val.uuid, i + 1)
																							}
																						></input>
																					</div>
																				</div>
																			</>
																		) : (
																			<div className='answer'>
																				<CommentField
																					size='small'
																					variant='outlined'
																					label='Your comments:'
																					value={
																						answers?.get(val?.uuid)!.comment ??
																						''
																					}
																					inputProps={{
																						maxLength: 1000,
																						id: `qtn_${i + 1}`,
																					}}
																					onChange={(e: any) =>
																						handleChange(e, val.uuid, i + 1)
																					}
																					rows={4}
																					error={
																						errorQuestionID === `qtn_${i + 1}`
																					}
																					multiline
																					fullWidth
																				/>
																				<div
																					className='notes'
																					id={`qtn_${i + 1}_invalid`}
																					style={{ display: `none` }}
																				>
																					{invalidError}
																				</div>
																				<div
																					className='notes'
																					id={`qtn_${i + 1}_Error`}
																					style={{ display: `none` }}
																				>
																					{errorMessage}
																				</div>
																			</div>
																		)}
																	</td>
																</tr>
															</tbody>
														</table>
													</div>
												</li>
											))}
											<div
												className='notes p-1'
												id='errorCode'
												style={{ display: `none` }}
											>
												{someErrorMessage}
											</div>
										</ul>
									</div>
								</div>
								<Box className='pb-4 pt-2 text-center'>
									<Button
										type='button'
										onClick={handleSubmit}
										id='btnQuestSubmit'
										disabled={status === 'pending'}
										variant='contained'
									>
										{!(status === 'pending') ? (
											'submit'.toUpperCase()
										) : (
											<CircularProgress
												color='primary'
												size={30}
												sx={{ position: 'relative', bottom: '5px' }}
											/>
										)}
									</Button>
									<br />
								</Box>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default RefereeQuestionnaire;

function replaceEmoji(text: string) {
	return text.replace(
		/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
		''
	);
}
