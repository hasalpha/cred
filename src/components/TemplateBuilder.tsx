import Chip from '@mui/material/Chip';
import React, { useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Industry } from '../apis/types/user-api-types';
import { useOtherAuth } from '../Common';
import Loading from './Loading';

const chipStyles = {
	color: 'white',
	backgroundColor: '#aaaaaa',
	marginRight: '5px',
	marginBottom: '5px',
};

const initialCompetenciesState = { competencies: [] };

function competenciesReducer(state: any, action: any) {
	switch (action.type) {
		case 'ADD': {
			return {
				...state,
				competencies: [...state.competencies, action.payload],
			};
		}
		case 'REMOVE': {
			return {
				...state,
				competencies: state.competencies.filter(
					(val: any) => val.uuid !== action.payload.uuid
				),
			};
		}
		default: {
			return state;
		}
	}
}

function TemplateBuilderHome() {
	const {
		industryOptions = [],
		competencyOptions = [],
		moreCompetencyOptions = [],
	} = useOtherAuth();
	const [keyCompetenciesState, dispatch] = useReducer(
		competenciesReducer,
		initialCompetenciesState
	);
	const moreCompetencyRef = useRef<HTMLDivElement>(null);
	const [industry, setIndustry] = useState<Industry>();
	const [jobTitle, setJobTitle] = useState('');
	const navigate = useNavigate();

	const handleViewMoreClick = (
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => {
		event.preventDefault();
		moreCompetencyRef.current!.classList.toggle('more-competency-show');
	};

	const handleBuildTemplate = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		let errorFlag = false;
		if (industry === undefined) {
			const x = document.getElementById('industryError');
			x!.style.display = 'block';
			document.getElementById('select-industry')!.classList.add('error-field');
			errorFlag = true;
		}
		if (jobTitle === '' || jobTitle === undefined) {
			const x = document.getElementById('jobTitleError');
			x!.style.display = 'block';
			document.getElementById('job-field')!.classList.add('error-field');
			errorFlag = true;
		}

		if (
			keyCompetenciesState.competencies.length < 2 ||
			keyCompetenciesState.competencies.length > 5
		) {
			const element = document.querySelector(
				'#competenciesError'
			) as HTMLElement;
			element!.style.display = 'block';
			errorFlag = true;
		}
		if (!errorFlag) {
			localStorage.setItem('cred-tb-industry', JSON.stringify(industry));
			localStorage.setItem('cred-tb-title', JSON.stringify(jobTitle));
			localStorage.setItem(
				'cred-tb-competencies',
				JSON.stringify(keyCompetenciesState.competencies)
			);
			navigate('../template-builder');
		}
	};

	const handleClick = (data: string) => {
		var x = document.getElementById(data)!;
		let competency = competencyOptions.find(val => val.name === x.textContent);
		if (!competency) {
			competency = moreCompetencyOptions.find(
				val => val.name === x.textContent
			);
		}
		if (x.style.backgroundColor === 'rgb(170, 170, 170)') {
			if (keyCompetenciesState.competencies.length >= 5) return;
			dispatch({ type: 'ADD', payload: competency });
			x.style.backgroundColor = '#402693';
			return;
		}
		dispatch({ type: 'REMOVE', payload: competency });
		x.style.backgroundColor = '#aaaaaa';
	};

	return (
		<>
			<h5 className='text-secondary pl-[10px]'>Questionnaire Builder</h5>
			{!!competencyOptions ? (
				<div className='card-plain'>
					<div className='row'>
						<div className='col-md-12 pl2'>
							<h3 className='jh-title no-pt2 mb-3'>Let's get started </h3>
							<h5 className='jh-subtitle'>
								Based on the Information you share about the role, we'll craft
								your editable questionnaire.
							</h5>
							<div className='mt-4'>
								<h4>
									{' '}
									What industry will the role be based in?{' '}
									<span className='sup_char'>
										{' '}
										<sup>*</sup>{' '}
									</span>
								</h4>

								<div className='form-group pt-1'>
									<select
										id='select-industry'
										className='form-control select-top'
										value={industry?.name}
										onChange={evt => {
											setIndustry(
												industryOptions.find(
													val => val.name === evt.target.value
												)
											);
											var x = document.getElementById('industryError');
											document
												.getElementById('select-industry')!
												.classList.remove('error-field');
											x!.style.display = 'none';
										}}
									>
										<option value=''>Select Industry</option>
										{industryOptions.map(val => (
											<option
												key={val?.uuid}
												value={val?.name}
											>
												{val?.name}
											</option>
										))}
									</select>
									<span className='fa fa-fw fa-angle-down field_icon eye'></span>
									<div
										className='notes'
										id='industryError'
										style={{ display: `none` }}
									>
										Industry is required
									</div>
								</div>

								<div className='form-group bmd-form-group'>
									<h4>
										{' '}
										What is the job title?{' '}
										<span className='sup_char'>
											{' '}
											<sup>*</sup>{' '}
										</span>{' '}
									</h4>
									<input
										id='job-field'
										placeholder='Add job title'
										type='text'
										value={jobTitle}
										onChange={evt => {
											setJobTitle(evt.target.value);
											var x = document.getElementById('jobTitleError');
											x!.style.display = 'none';
											document
												.getElementById('job-field')!
												.classList.remove('error-field');
										}}
										className='form-control'
									/>
									<div
										className='notes'
										id='jobTitleError'
										style={{ display: `none` }}
									>
										Job Title is required
									</div>
								</div>

								<div className='mt-4'>
									<h5>
										{' '}
										Identify the key competencies that are important for this
										role{' '}
									</h5>
									<span className='text-primary'>
										Choose 2 to 5 options from the list below
									</span>
									<div
										className='notes'
										id='competenciesError'
										style={{ display: 'none' }}
									>
										Please select between 2 to 5 competencies only
									</div>
									<div className='chips__filter pt1'>
										{competencyOptions?.map(
											val =>
												val.name && (
													<Chip
														key={val.uuid}
														id={val.uuid}
														label={val.name}
														onClick={() => handleClick(val.uuid)}
														style={chipStyles}
													/>
												)
										)}
										<div
											id='showmore'
											className='ml1 mt2'
										>
											<a
												href='/'
												onClick={handleViewMoreClick}
											>
												View more...
											</a>
										</div>
										<div
											ref={moreCompetencyRef}
											className='more-competency mt1'
										>
											{moreCompetencyOptions?.map(
												val =>
													val.name !== 'nan' && (
														<Chip
															key={val.uuid}
															id={val.uuid}
															label={val.name}
															onClick={() => handleClick(val.uuid)}
															style={chipStyles}
														/>
													)
											)}
										</div>
									</div>
								</div>
								<br />

								<div className='box-pad nomobile'>
									<button
										className='btn btn-primary btn-lg'
										onClick={handleBuildTemplate}
									>
										Build My Questionnaire
									</button>
									&nbsp;
								</div>

								<div
									className='box-pad pt2 viewonmobile'
									style={{ display: `none`, marginBottom: '20px' }}
								>
									<button
										className='btn btn-primary'
										onClick={handleBuildTemplate}
									>
										Build My Questionnaire
									</button>
									&nbsp;
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<Loading />
			)}
			<div className='clearfix'></div>
		</>
	);
}

export default TemplateBuilderHome;
