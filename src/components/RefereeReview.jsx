import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { API } from '../Api';
import logo from '../assets/img/credibled_logo_205x45.png';

const PREFIX = 'RefereeReview';

const classes = {
	root: `${PREFIX}-root`,
	thumb: `${PREFIX}-thumb`,
	active: `${PREFIX}-active`,
	valueLabel: `${PREFIX}-valueLabel`,
	track: `${PREFIX}-track`,
	rail: `${PREFIX}-rail`,
};

const Root = styled('div')({
	[`& .${classes.root}`]: {
		color: '#250c77',
		height: 8,
		width: 350,
		position: 'absolute',
	},
	[`& .${classes.thumb}`]: {
		height: 24,
		width: 24,
		backgroundColor: '#ef7441',
		// border: "2px solid currentColor",
		marginTop: -8,
		marginLeft: -12,
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

function RefereeReview() {
	const params = useParams();
	const [sliderVal1, setSliderVal1] = useState(0);
	const [sliderVal2, setSliderVal2] = useState(0);
	const [sliderVal3, setSliderVal3] = useState(0);
	const [sliderVal4, setSliderVal4] = useState(0);
	const [sliderVal5, setSliderVal5] = useState(0);
	const [sliderVal6, setSliderVal6] = useState(0);
	const [sliderVal7, setSliderVal7] = useState(0);
	const [sliderVal8, setSliderVal8] = useState(0);
	const [sliderVal9, setSliderVal9] = useState(0);
	const [answer1, setAnswer1] = useState('');
	const [answer2, setAnswer2] = useState('');
	const [answer3, setAnswer3] = useState('');
	const [answer4, setAnswer4] = useState('');
	const [answer5, setAnswer5] = useState('');
	const [answer6, setAnswer6] = useState('');
	const [answer7, setAnswer7] = useState('');
	const [answer8, setAnswer8] = useState('');
	const [answer9, setAnswer9] = useState('');
	const [answer10, setAnswer10] = useState('');

	useEffect(() => {
		if (params.candidateHash && params.refereeHash) {
			// API.getRefereeDetails({
			//   candidateHash: params.candidateHash,
			//   refereeHash: params.refereeHash,
			// })
			//   .then((data) => {
			//     if (data[0].refereeResponse == "completed") {
			//       window.location.href =
			//         "/referee-summary/" +
			//         params.name +
			//         "/" +
			//         params.candidateHash +
			//         "/" +
			//         params.refereeHash;
			//     }
			//   })
			//   .catch((error) => console.log(error));
			API.getQuestionnaireData({
				candidateHash: params.candidateHash,
				refereeHash: params.refereeHash,
			})
				.then(data => {
					setAnswer1(data[0].question1);
					setAnswer2(data[0].question2);
					setAnswer3(data[0].question3);
					setAnswer4(data[0].question4);
					setAnswer5(data[0].question5);
					setAnswer6(data[0].question6);
					setAnswer7(data[0].question7);
					setAnswer8(data[0].question8);
					setAnswer9(data[0].question9);
					setAnswer10(data[0].question10);
					setSliderVal1(data[0].rating1);
					setSliderVal2(data[0].rating2);
					setSliderVal3(data[0].rating3);
					setSliderVal4(data[0].rating4);
					setSliderVal5(data[0].rating5);
					setSliderVal6(data[0].rating6);
					setSliderVal7(data[0].rating7);
					setSliderVal8(data[0].rating8);
					setSliderVal9(data[0].rating9);
				})
				.catch(error => console.log(error));
		}
	}, []);

	const PrettoSlider = Slider;

	const submitClicked = () => {
		if (params.candidateHash && params.refereeHash) {
			window.location.href =
				'/referee-summary/' +
				params.name +
				'/' +
				params.candidateHash +
				'/' +
				params.refereeHash;
		}
		API.updateRefereeResponse({
			candidateHash: params.candidateHash,
			refereeHash: params.refereeHash,
			response: 'completed',
		});
	};

	const goBackClicked = () => {
		if (params.name && params.candidateHash) {
			window.location.href =
				'/referee-questionnaire/' +
				params.name +
				'/' +
				params.candidateHash +
				'/' +
				params.refereeHash;
		}
	};

	return (
		<Root>
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-6 bg-primary text-left'>&nbsp;</div>
					<div className='col-6 bg-secondary text-right'>&nbsp;</div>
				</div>
			</div>
			<div className='wrapper'>
				{/* <div className="main-panel"> */}
				<div className='content'>
					<div className='container'>
						<div className='row'>
							<div className='col-md-12'>
								<div className='mt3'>
									<a
										className='navbar-brand'
										href='/'
									>
										<img
											src={logo}
											alt='Credibled Logo'
											className='mob_logo'
										/>
									</a>
								</div>

								<div className='card-plain mt2'>
									<div className='stepper'>
										<div className='stepper-steps'>
											<div className='stepper-step ss25 stepper-step-isActive'>
												<div className='stepper-stepContent step_active_primary'>
													<a
														href={
															'/referee-accept/' +
															params.name +
															'/' +
															params.candidateHash +
															'/' +
															params.refereeHash
														}
														className='text-primary'
													>
														<span className='stepper-stepMarker'>1</span>Before
														we begin
													</a>
												</div>
											</div>
											<div className='stepper-step ss25 stepper-step-isActive'>
												<div className='stepper-stepContent step_active_primary'>
													<a
														href={
															'/referee-verify/' +
															params.name +
															'/' +
															params.candidateHash +
															'/' +
															params.refereeHash
														}
														className='text-primary'
													>
														<span className='stepper-stepMarker'>2</span>Verify
														the basics
													</a>
												</div>
											</div>
											<div className='stepper-step ss25 stepper-step-isActive'>
												<div className='stepper-stepContent step_active_primary'>
													<a
														href={
															'/referee-questionnaire/' +
															params.name +
															'/' +
															params.candidateHash +
															'/' +
															params.refereeHash
														}
														className='text-primary'
													>
														<span className='stepper-stepMarker'>3</span>
														Questionnaire
													</a>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className='row'>
									<div className='col-md-12'>
										<ul id='questionnaire'>
											<li className='pl1'>
												<h4 className='text-secondary'>10 Questions</h4>
											</li>

											<li>
												<div className='gray-box1'>
													<table className='quest'>
														<tr>
															<td>1.</td>
															<td className='question'>
																How long did you work together (
																<i>approx. dates</i>)? What was your working
																relationship?
																<p className='answer'>{answer1}</p>
															</td>
														</tr>
													</table>
												</div>
											</li>
											<li>
												<div className='gray-box1'>
													<table className='quest'>
														<tr>
															<td>2.</td>
															<td className='question'>
																What were the main duties of his/her job?
																<p className='answer'>{answer2}</p>
															</td>
														</tr>
													</table>
												</div>
											</li>
											<li>
												<div className='gray-box1'>
													<table className='quest'>
														<tr>
															<td>3.</td>
															<td className='question'>
																What is your overall appraisal of his/her work?
																<p className='answer'>{answer3}</p>
															</td>
														</tr>
													</table>
												</div>
											</li>
											<li>
												<div className='gray-box1'>
													<table className='quest'>
														<tr>
															<td>4.</td>
															<td className='question'>
																What are his/her strong points? What are his/her
																technical strengths? If you can, please give
																examples of how these strengths were
																demonstrated.
																<p className='answer'>{answer4}</p>
															</td>
														</tr>
													</table>
												</div>
											</li>
											<li>
												<div className='gray-box1'>
													<table className='quest'>
														<tr>
															<td>5.</td>
															<td className='question'>
																How does he/she perform under pressure?
																<p className='answer'>{answer5}</p>
															</td>
														</tr>
													</table>
												</div>
											</li>
											<li>
												<div className='gray-box1'>
													<table className='quest'>
														<tr>
															<td>6.</td>
															<td className='question'>
																How does he/she get along with other people? (
																<i>supervisors, peers, and subordinates</i>).
																<p className='answer'>{answer6}</p>
															</td>
														</tr>
													</table>
												</div>
											</li>
											<li>
												<div className='gray-box1'>
													<table className='quest'>
														<tr>
															<td>7.</td>
															<td className='question'>
																How are his/her communication skills?
																<p className='answer'>{answer7}</p>
															</td>
														</tr>
													</table>
												</div>
											</li>
											<li>
												<div className='gray-box1'>
													<table className='quest'>
														<tr>
															<td>8.</td>
															<td className='question'>
																Please comment on each of the following:
																<h6 className='pt1'>
																	1-<span> Poor</span>&nbsp; 2-
																	<span> Average</span>&nbsp; 3-
																	<span> Fair</span> &nbsp; 4-
																	<span> Good </span> &nbsp; 5-
																	<span> Excellent</span>{' '}
																</h6>
																<ul id='rating'>
																	<li>
																		<div className='row pmzero'>
																			<div className='col-md-6 pt2'>
																				Attendance
																			</div>
																			<div className='col-md-6'>
																				<div className='range-slider'>
																					<span
																						className='range-slider__value'
																						style={{ marginRight: '20px' }}
																					>
																						{sliderVal1}
																					</span>
																					<PrettoSlider
																						valueLabelDisplay='auto'
																						aria-label='pretto slider'
																						step={1}
																						marks
																						min={0}
																						max={5}
																						value={sliderVal1}
																						defaultValue={0}
																						classes={{
																							root: classes.root,
																							thumb: classes.thumb,
																							active: classes.active,
																							valueLabel: classes.valueLabel,
																							track: classes.track,
																							rail: classes.rail,
																						}}
																					/>
																				</div>
																			</div>
																		</div>
																	</li>

																	<li>
																		<div className='row pmzero'>
																			<div className='col-md-6 pt2'>
																				Dependability & Overall Attitude
																			</div>
																			<div className='col-md-6'>
																				<div className='range-slider'>
																					<span
																						className='range-slider__value'
																						style={{ marginRight: '20px' }}
																					>
																						{sliderVal2}
																					</span>
																					<PrettoSlider
																						valueLabelDisplay='auto'
																						aria-label='pretto slider'
																						step={1}
																						marks
																						min={0}
																						max={5}
																						defaultValue={0}
																						value={sliderVal2}
																						classes={{
																							root: classes.root,
																							thumb: classes.thumb,
																							active: classes.active,
																							valueLabel: classes.valueLabel,
																							track: classes.track,
																							rail: classes.rail,
																						}}
																					/>
																				</div>
																			</div>
																		</div>
																	</li>

																	<li>
																		<div className='row pmzero'>
																			<div className='col-md-6 pt2'>
																				Ability to take on Responsibility
																			</div>
																			<div className='col-md-6'>
																				<div className='range-slider'>
																					<span
																						className='range-slider__value'
																						style={{ marginRight: '20px' }}
																					>
																						{sliderVal3}
																					</span>
																					<PrettoSlider
																						valueLabelDisplay='auto'
																						aria-label='pretto slider'
																						step={1}
																						marks
																						min={0}
																						max={5}
																						defaultValue={0}
																						value={sliderVal3}
																						classes={{
																							root: classes.root,
																							thumb: classes.thumb,
																							active: classes.active,
																							valueLabel: classes.valueLabel,
																							track: classes.track,
																							rail: classes.rail,
																						}}
																					/>
																				</div>
																			</div>
																		</div>
																	</li>

																	<li>
																		<div className='row pmzero'>
																			<div className='col-md-6 pt2'>
																				Potential for advancement
																			</div>
																			<div className='col-md-6'>
																				<div className='range-slider'>
																					<span
																						className='range-slider__value'
																						style={{ marginRight: '20px' }}
																					>
																						{sliderVal4}
																					</span>
																					<PrettoSlider
																						valueLabelDisplay='auto'
																						aria-label='pretto slider'
																						step={1}
																						marks
																						min={0}
																						max={5}
																						defaultValue={0}
																						value={sliderVal4}
																						classes={{
																							root: classes.root,
																							thumb: classes.thumb,
																							active: classes.active,
																							valueLabel: classes.valueLabel,
																							track: classes.track,
																							rail: classes.rail,
																						}}
																					/>
																				</div>
																			</div>
																		</div>
																	</li>

																	<li>
																		<div className='row pmzero'>
																			<div className='col-md-6 pt2'>
																				Ability to work independently
																			</div>
																			<div className='col-md-6'>
																				<div className='range-slider'>
																					<span
																						className='range-slider__value'
																						style={{ marginRight: '20px' }}
																					>
																						{sliderVal5}
																					</span>
																					<PrettoSlider
																						valueLabelDisplay='auto'
																						aria-label='pretto slider'
																						step={1}
																						marks
																						min={0}
																						max={5}
																						defaultValue={0}
																						value={sliderVal5}
																						classes={{
																							root: classes.root,
																							thumb: classes.thumb,
																							active: classes.active,
																							valueLabel: classes.valueLabel,
																							track: classes.track,
																							rail: classes.rail,
																						}}
																					/>
																				</div>
																			</div>
																		</div>
																	</li>

																	<li>
																		<div className='row pmzero'>
																			<div className='col-md-6 pt2'>
																				Attention to detail
																			</div>
																			<div className='col-md-6'>
																				<div className='range-slider'>
																					<span
																						className='range-slider__value'
																						style={{ marginRight: '20px' }}
																					>
																						{sliderVal6}
																					</span>
																					<PrettoSlider
																						valueLabelDisplay='auto'
																						aria-label='pretto slider'
																						step={1}
																						marks
																						min={0}
																						max={5}
																						defaultValue={0}
																						value={sliderVal6}
																						classes={{
																							root: classes.root,
																							thumb: classes.thumb,
																							active: classes.active,
																							valueLabel: classes.valueLabel,
																							track: classes.track,
																							rail: classes.rail,
																						}}
																					/>
																				</div>
																			</div>
																		</div>
																	</li>

																	<li>
																		<div className='row pmzero'>
																			<div className='col-md-6 pt2'>
																				Ability to make decisions
																			</div>
																			<div className='col-md-6'>
																				<div className='range-slider'>
																					<span
																						className='range-slider__value'
																						style={{ marginRight: '20px' }}
																					>
																						{sliderVal7}
																					</span>
																					<PrettoSlider
																						valueLabelDisplay='auto'
																						aria-label='pretto slider'
																						step={1}
																						marks
																						min={0}
																						max={5}
																						defaultValue={0}
																						value={sliderVal7}
																						classes={{
																							root: classes.root,
																							thumb: classes.thumb,
																							active: classes.active,
																							valueLabel: classes.valueLabel,
																							track: classes.track,
																							rail: classes.rail,
																						}}
																					/>
																				</div>
																			</div>
																		</div>
																	</li>

																	<li>
																		<div className='row pmzero'>
																			<div className='col-md-6 pt2'>
																				Leadership/Management ability and style
																			</div>
																			<div className='col-md-6'>
																				<div className='range-slider'>
																					<span
																						className='range-slider__value'
																						style={{ marginRight: '20px' }}
																					>
																						{sliderVal8}
																					</span>
																					<PrettoSlider
																						valueLabelDisplay='auto'
																						aria-label='pretto slider'
																						step={1}
																						marks
																						min={0}
																						max={5}
																						defaultValue={0}
																						value={sliderVal8}
																						classes={{
																							root: classes.root,
																							thumb: classes.thumb,
																							active: classes.active,
																							valueLabel: classes.valueLabel,
																							track: classes.track,
																							rail: classes.rail,
																						}}
																					/>
																				</div>
																			</div>
																		</div>
																	</li>

																	<li>
																		<div className='row pmzero'>
																			<div className='col-md-6 pt2'>
																				Problem solving and strategic thinking
																			</div>
																			<div className='col-md-6'>
																				<div className='range-slider'>
																					<span
																						className='range-slider__value'
																						style={{ marginRight: '20px' }}
																					>
																						{sliderVal9}
																					</span>
																					<PrettoSlider
																						valueLabelDisplay='auto'
																						aria-label='pretto slider'
																						step={1}
																						min={0}
																						max={5}
																						defaultValue={0}
																						value={sliderVal9}
																						classes={{
																							root: classes.root,
																							thumb: classes.thumb,
																							active: classes.active,
																							valueLabel: classes.valueLabel,
																							track: classes.track,
																							rail: classes.rail,
																						}}
																					/>
																				</div>
																			</div>
																		</div>
																	</li>
																</ul>
																<p className='answer'>{answer8}</p>
															</td>
														</tr>
													</table>
												</div>
											</li>
											<li>
												<div className='gray-box1'>
													<table className='quest'>
														<tr>
															<td>9.</td>
															<td className='question'>
																Why did he/she leave your company? Would you
																re-employ?
																<p className='answer'>{answer9}</p>
															</td>
														</tr>
													</table>
												</div>
											</li>
											<li>
												<div className='gray-box1'>
													<table className='quest'>
														<tr>
															<td>10.</td>
															<td className='question'>
																Is there anything else of significance we should
																know? (
																<i>
																	Any concerns or compliments or general
																	comments
																</i>
																?)
																<p className='answer'>{answer10}</p>
															</td>
														</tr>
													</table>
												</div>
											</li>
										</ul>
									</div>
								</div>

								<div className='box-pad mt1 text-center'>
									<span
										onClick={goBackClicked}
										className='btn btn-secondary-outline'
									>
										Go Back
									</span>
									&nbsp;
									<span
										onClick={submitClicked}
										className='btn btn-primary'
									>
										Submit
									</span>
								</div>
							</div>
						</div>
						<div className='clearfix'></div>
					</div>
				</div>
				{/* </div> */}
			</div>
		</Root>
	);
}

export default RefereeReview;
