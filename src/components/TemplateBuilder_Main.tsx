import {
	Box,
	Button,
	CircularProgress,
	Divider,
	Grid,
	Stack,
	Typography,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { NoteAdd, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useEffect, useReducer, useRef, useState } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Logout } from '../apis';
import {
	buildQuestionnaire,
	createClientAdminQuestionnaire,
	createQuestionnaire,
	getCustomQuestionsForThisUser,
	getQuestionsByCompetencyType,
} from '../apis/user.api';
import logo from '../assets/img/credibled_logo_205x45.png';
import {
	useLocalStorageHook,
	useOtherAuth,
	useQuestionnaires,
	useQuestionsFromQuestionType,
} from '../Common';
import AddQuestions from './AddQuestions';
import Loading from './Loading';
import { DeleteQuestionModal } from '../components';
import cloneDeep from 'lodash.clonedeep';
import { BucketTypes, Question, bucketTypes } from './TemplateBuilderTypes';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
const initialDeletePreference = {
	showModal: true,
	uuid: null,
};

const deletePreferenceReducer = (
	state = initialDeletePreference,
	{ type, payload }: any
) => {
	switch (type) {
		case 'ADD_UUID':
			return { ...state, uuid: payload };
		case 'REMOVE_UUID':
			return { ...state, uuid: null };
		case 'SHOW_MODAL':
			return { ...state, showModal: true };
		case 'DONT_SHOW_MODAL':
			return { ...state, showModal: false };
		default:
			throw new Error(`Unhandled case: ${type}`);
	}
};
const getCurrentDate = () => {
	let d = new Date();
	let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
	let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
	let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
	return day + ' ' + month + ' ' + year;
};

function TemplateBuilderMain() {
	const firstRender = useRef<boolean>(true);
	const { pathname } = useLocation();
	const { questionnaireUUID = null } = useParams();
	const currLink = useLocation().pathname;
	const baseLink = currLink.split('/')[1];
	const moreCompetencyRef = useRef<any>();
	const [isLoading, setIsLoading] = useState(false);
	const [selectedIndustry, setSelectedIndustry] = useState('');
	const [title, setTitle] = useState('');
	const [error, setError] = useState(false);
	const [fetchedQuestions, setFetchedQuestions] = useState<{
		bucketName: string;
		questions: Question[];
	}>({
		bucketName: '',
		questions: [],
	});
	const [firstName] = useState(() => getName());

	const [questionnaireTitle, setQuestionnaireTitle] = useState(
		JSON.parse(localStorage.getItem('cred-tb-title')!) +
			' - ' +
			getCurrentDate()
	);

	const [questions, setQuestions, clearQuestions] = useLocalStorageHook(
		'questions',
		null
	) as unknown as [
		Question[],
		(v: Array<Partial<Question>>) => void,
		() => void,
	];

	const navigate = useNavigate();
	let {
		competencyOptions = [],
		moreCompetencyOptions = [],
		buckets = [],
	} = useOtherAuth();

	const { data: questionsByBucketType } = useQuestionsFromQuestionType();

	const { data: questionnaires, refetch: fetchQuestionnaireData } =
		useQuestionnaires();

	if (!buckets) {
		buckets = [];
	}

	const [{ showModal, uuid }, setDeletePreference] = useReducer(
		deletePreferenceReducer,
		initialDeletePreference
	);

	const bucketNames = buckets?.reduce(
		(a, v) => ({ ...a, [v.name]: 0 }),
		{}
	) as any;

	questions?.forEach?.((question: any) => {
		if (question.bucket) return (bucketNames[question?.bucket] += 1);
		if (bucketNames[question.type]) {
			return (bucketNames[question?.type] += 1);
		}
		return (bucketNames[question?.type] = 1);
	});

	const essentialUUID = buckets?.find(
		val => val?.name?.toLowerCase() === 'essentials'
	)?.uuid;

	const roleSpecificUUID = buckets?.find(
		val => val?.name?.toLowerCase() === 'role specific'
	)?.uuid;

	const personalAttributesUUID = buckets?.find(
		val => val?.name?.toLowerCase() === 'personal attributes'
	)?.uuid;

	const customUUID = buckets?.find(val => val?.name === 'Custom History')?.uuid;

	useEffect(() => {
		if (questions && questions.length) return;
		if (questionnaireUUID) return;
		if (!firstRender.current) return;
		firstRender.current = false;

		async function fetchData() {
			const body = {
				industry: JSON.parse(localStorage.getItem('cred-tb-industry')!)?.uuid,
				jobTitle: JSON.parse(localStorage.getItem('cred-tb-title')!),
				competencyList: JSON.parse(
					localStorage.getItem('cred-tb-competencies')!
				)?.map((val: any) => val?.uuid),
			};
			const res = await buildQuestionnaire(body);
			if (res && res.status !== 500) {
				const { final_question_list } = res.data;
				setQuestions(final_question_list);
				// setQuestionnaireTitle(body.jobTitle + " - " + getCurrentDate());
			} else {
				setError(true);
			}
		}
		fetchData();
	}, [questions, setQuestions, questionnaireUUID]);

	useEffect(() => {
		if (questionnaireUUID) {
			const questionnaire = questionnaires?.find(
				val => val.uuid === questionnaireUUID
			);
			if (questionnaire) {
				setQuestions(
					cloneDeep(questionnaire?.questionList) ?? [
						...questionnaire?.questionList,
					]
				);
				setQuestionnaireTitle(
					`${
						questionnaire?.questionnaire_title?.split('-duplicate-')[0]
					}${'-duplicate-'}${getDuplicateCount(
						questionnaires,
						questionnaire?.questionnaire_title?.split('-duplicate-')[0]
					)}`
				);
				setSelectedIndustry(questionnaire?.industry);
				setTitle(
					questionnaire?.job_title || questionnaire?.questionnaire_title
				);
			}
		}
	}, [questionnaireUUID, setQuestions, selectedIndustry, questionnaires]);

	useEffect(() => {
		setSelectedIndustry(
			JSON.parse(localStorage.getItem('cred-tb-industry')!)?.uuid
		);
		setTitle(JSON.parse(localStorage.getItem('cred-tb-title')!));
	}, []);

	const handleViewMoreClick = (event: any) => {
		event.preventDefault();
		moreCompetencyRef.current!.classList.toggle('more-competency-show');
	};

	if (error) {
		return <h1>Something went wrong!</h1>;
	}

	const signOutClicked = async () => {
		await Logout();

		const getbannerTracker = JSON.parse(
			localStorage.getItem('bannerTracker') || '{}'
		);
		localStorage.clear();
		// Is localStorage Saved or not...
		Object.keys(getbannerTracker).length > 0 &&
			(() => {
				localStorage.setItem('bannerTracker', JSON.stringify(getbannerTracker));
			})();

		if ('caches' in window) {
			caches.keys().then(names => {
				// Delete all the cache files
				names.forEach(name => {
					caches.delete(name);
				});
			});
		}
		window.location.href = '/signin';
	};

	const handleClick = async (bucketName: string, bucketUUID: string) => {
		setIsLoading(true);
		let newQuestions;
		if (bucketName === 'Custom History')
			newQuestions = await getCustomQuestionsForThisUser();
		else newQuestions = questionsByBucketType![bucketUUID]!;
		newQuestions = newQuestions as Question[];
		if (newQuestions) {
			const fetchedQuestions = newQuestions?.map(val => {
				if (questions?.find(question => question.uuid === val.uuid)) {
					val.added = true;
				} else {
					val.added = false;
				}
				return val;
			});
			setFetchedQuestions({ bucketName, questions: fetchedQuestions });
		}
		setIsLoading(false);
	};

	const handleGetQuestionsFromCompetencyClick = async (
		bucketName: any,
		data: any
	) => {
		setIsLoading(true);
		let newQuestions = await getQuestionsByCompetencyType(data);
		newQuestions = newQuestions.map((val: any) => {
			if (questions?.find((question: any) => question.uuid === val.uuid)) {
				val.added = true;
			}
			return val;
		});
		setFetchedQuestions({ bucketName, questions: newQuestions });
		setIsLoading(false);
	};

	function handleOnDragEnd(result: any) {
		if (!result.destination) return;

		const items = Array.from(questions);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setQuestions(items);
	}

	function handleQuestionToggle(questionObject: any, isAdded: any) {
		// Check if question is already or not
		if (!isAdded) {
			let type = 'essential';
			if (fetchedQuestions.bucketName.toLowerCase() === 'personal attributes')
				type = 'personal';
			else if (fetchedQuestions.bucketName.toLowerCase() === 'role specific')
				type = 'roleSpecific';
			questionObject.type = type;
			setQuestions([questionObject, ...questions]);
			return resetFetchedQuestions(isAdded);
		}
		const newQuestions = questions?.filter(
			(val: any) => val.uuid !== questionObject.uuid
		);
		setQuestions(newQuestions);
		return resetFetchedQuestions(isAdded);

		function resetFetchedQuestions(isAdded: any) {
			const newFetchedQuestions = Object.assign({}, fetchedQuestions);
			if (!isAdded)
				newFetchedQuestions?.questions?.forEach(
					(val: any, i: any, arr: any) => {
						if (val.uuid === questionObject.uuid) arr[i].added = true;
					}
				);
			else
				newFetchedQuestions?.questions?.forEach(
					(val: any, i: any, arr: any) => {
						if (val.uuid === questionObject.uuid) arr[i].added = false;
					}
				);
			return setFetchedQuestions(newFetchedQuestions);
		}
	}

	function handleQuestionDelete(questionUUID: any) {
		setQuestions(questions?.filter((val: any) => val.uuid !== questionUUID));
	}

	async function handleSave() {
		if (isLoading) return;
		if (questions?.length <= 0) {
			const element = document.querySelector('#questionsError') as HTMLElement;
			element!.style.display = 'block';
			return;
		}
		if (questionnaireTitle?.length <= 0) {
			const element = document.querySelector('#titleError') as HTMLElement;
			element!.style.display = 'block';
			return;
		}
		setIsLoading(true);
		// const questionnaireTitle = `${titleRef?.current?.textContent?.trim()} ${subTitleRef?.current?.textContent?.trim()}`;
		const body = {
			industry: selectedIndustry,
			job_title: title,
			questionnaire_title: questionnaireTitle,
			questionList: questions?.map((val: any) => val.uuid) as string[],
		};
		let response;
		if (pathname.includes('admin'))
			response = await createClientAdminQuestionnaire(body);
		else response = await createQuestionnaire(body);

		setIsLoading(false);
		if (response.status >= 400) {
			return toast.error(JSON.stringify(response.data));
		}
		await fetchQuestionnaireData();
		clearQuestions();
		navigate(
			pathname.includes('admin')
				? '/admin/questionnaires'
				: '/home/questionnaires',
			{
				state: {
					fromTemplateBuilder: true,
					uuid: response.data.uuid,
					questionnaire_title: response.data.questionnaire_title,
				},
				replace: true,
			}
		);
	}

	if (
		(!questions || !competencyOptions || !buckets || !moreCompetencyOptions) &&
		!questionnaireUUID
	) {
		return <Loading />;
	}

	const handleDeletePreference = (preference: any) =>
		preference
			? setDeletePreference({ type: 'SHOW_MODAL' })
			: setDeletePreference({ type: 'DONT_SHOW_MODAL' });
	const handleRemoveUUID = () => setDeletePreference({ type: 'REMOVE_UUID' });
	const deleteUUID = () => handleQuestionDelete(uuid);

	const questionTypeAmount =
		questions?.reduce(
			(acc, val) => {
				acc[val.bucket as BucketTypes] += 1;
				return acc;
			},
			bucketTypes.reduce(
				(a, v) => {
					a[v] = 0;
					return a;
				},
				{} as Record<BucketTypes, number>
			)
		) ?? {};
	console.log({ questionTypeAmount });

	return (
		<>
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-6 bg-primary text-left'>&nbsp;</div>
					<div className='col-6 bg-secondary text-right'>&nbsp;</div>
				</div>
			</div>
			<div className='wrapper'>
				<div className='main-panel w100'>
					<div className='content'>
						<div className='container-fluid'>
							<div className='row'>
								<div className='col-md-10 offset-md-1'>
									<nav className='navbar navbar-expand navbar-transparent navbar-absolute fixed-top mobile_logo'>
										<div className='container-fluid'>
											<div className='logo logo-flex'>
												<Link
													className='navbar-brand'
													to='/'
												>
													<img
														src={logo}
														className='mob_logo'
														alt='Credibled Logo'
													/>
												</Link>
												<div className='nomobile fl-right'>
													<h5>Question Builder</h5>
												</div>
											</div>

											<div className='text-right'>
												<ul className='navbar-nav mobile_nav'>
													<li className='nav-item dropdown'>
														<a
															className='nav-link dropdown-toggle'
															href='#!'
															id='navbarDropdownMenuLink'
															data-toggle='dropdown'
															aria-haspopup='true'
															aria-expanded='false'
														>
															<i className='material-icons'>account_box</i> Hi{' '}
															<span className='text-secondary'>
																{firstName ? firstName : 'There'}
															</span>
														</a>
														<div
															className='dropdown-menu'
															aria-labelledby='navbarDropdownMenuLink'
														>
															<a
																className='dropdown-item'
																href='#!'
																onClick={signOutClicked}
															>
																Sign out
															</a>
														</div>
													</li>
												</ul>
											</div>
										</div>
									</nav>
									<div className='card-plain mt3'>
										<div className='row'>
											<div className='col-md-12 mt3 mb3'>
												<div className='mt3'>
													<AddQuestions
														selectedQuestions={questions}
														updateSelectedQuestions={setQuestions}
													/>

													<div className='search_chip'>
														<h6 className='text-secondary'>
															Search by Question type
														</h6>
														<div className='chips__filter cf-type'>
															{buckets?.map(val => (
																<div
																	key={val.uuid}
																	id={val.uuid}
																	className='chip chip-active'
																	data-toggle='modal'
																	data-target='#modal'
																	onClick={() =>
																		handleClick(val.name, val.uuid)
																	}
																>
																	<span className='icon icon--leadind chip--check'>
																		<i className='material-icons'>done</i>
																	</span>
																	{val.name}
																</div>
															))}
														</div>
														<h6 className='text-secondary'>
															Search by Competency
														</h6>

														{/* Load Competencies */}
														<div className='chips__filter cf-type'>
															{competencyOptions?.map(
																val =>
																	val.name && (
																		<div
																			key={val.uuid}
																			id={val.uuid}
																			className='chip chip-active'
																			data-toggle='modal'
																			data-target='#modal'
																			onClick={() =>
																				handleGetQuestionsFromCompetencyClick(
																					val.name,
																					val.uuid
																				)
																			}
																		>
																			<span className='icon icon--leadind chip--check'>
																				<i className='material-icons'>done</i>
																			</span>
																			{val.name}
																		</div>
																	)
															)}
														</div>

														<div
															id='showmore'
															className='ml1 mt1'
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
																		<div
																			data-toggle='modal'
																			data-target='#modal'
																			key={val.uuid}
																			className='chip chip-active'
																			id={val.uuid}
																			onClick={() =>
																				handleGetQuestionsFromCompetencyClick(
																					val.name,
																					val.uuid
																				)
																			}
																		>
																			{val.name}
																		</div>
																	)
															)}
														</div>
													</div>

													<br />
													<Box>
														<label className='bmd-label-floating text-secondary'>
															Template Title
															<span className='sup_char'>
																<sup>*</sup>
															</span>
														</label>
														<input
															onChange={e => {
																document.getElementById(
																	'titleError'
																)!.style.display = 'none';
																setQuestionnaireTitle(e.target.value);
															}}
															className='form-control icon-rtl'
															value={questionnaireTitle}
														/>
														<div
															className='notes'
															id='titleError'
															style={{ display: 'none' }}
														>
															Please add questionnaire title
														</div>
													</Box>

													<br />
													<div className='row pb2'>
														<div className='col info-box-thin rounded-2xl px-4'>
															<div className='row flex-nowrap items-center'>
																<h2 className='big-num primary-text'>
																	{questions?.length}
																</h2>
																&nbsp;Questions
																<a
																	id='pop'
																	className='a__relative hideonmobile'
																	href='/'
																	onClick={e => e.preventDefault()}
																	data-toggle='popover'
																	data-content='The total number of questions used in the questionnaire.'
																	data-original-title=''
																	title=''
																>
																	<div
																		className='popover fade bs-popover-top show custom-popover'
																		role='tooltip'
																		id='popover'
																	>
																		{/* <div className="arrow"></div> */}
																		<h3 className='popover-header'>{null}</h3>
																		<div className='popover-body'>
																			The number of questions currently included
																			in your template
																		</div>
																	</div>
																	<i className='material-icons icon_info text-secondary'>
																		info
																	</i>
																</a>
																<ul id='quest'>
																	<li>
																		<div className='al-icon1'>
																			<i className='material-icons'>grade</i>
																		</div>{' '}
																		<span className='sm'>
																			{questionTypeAmount.Essentials}
																		</span>{' '}
																		Universal
																		<a
																			id='pop'
																			className='a__relative hideonmobile'
																			href='/'
																			onClick={e => e.preventDefault()}
																			data-toggle='popover'
																			data-content='The total number of questions used in the questionnaire.'
																			data-original-title=''
																			title=''
																		>
																			<div
																				className='popover fade bs-popover-top show custom-popover'
																				role='tooltip'
																				id='popover'
																			>
																				<h3 className='popover-header'>
																					{null}
																				</h3>
																				<div className='popover-body'>
																					We recommend including 5 essential
																					questions about your candidate's
																					previous employment and performance.
																				</div>
																			</div>
																			<i className='material-icons icon_info text-secondary'>
																				info
																			</i>
																		</a>
																	</li>
																	<li>
																		<div className='al-icon1'>
																			<i className='material-icons'>
																				account_box
																			</i>
																		</div>
																		<span className='sm'>
																			{
																				questionTypeAmount[
																					'Personal Attributes'
																				]
																			}
																		</span>{' '}
																		Candidate Characteristics
																		<a
																			id='pop'
																			className='a__relative hideonmobile'
																			href='/'
																			onClick={e => e.preventDefault()}
																			data-toggle='popover'
																			data-content='The total number of questions used in the questionnaire.'
																			data-original-title=''
																			title=''
																		>
																			<div
																				className='popover fade bs-popover-top show custom-popover'
																				role='tooltip'
																				id='popover'
																			>
																				{/* <div className="arrow"></div> */}
																				<h3 className='popover-header'>
																					{null}
																				</h3>
																				<div className='popover-body'>
																					We recommend including 4 to 7
																					questions about your professional
																					personality traits.
																				</div>
																			</div>
																			<i className='material-icons icon_info text-secondary'>
																				info
																			</i>
																		</a>
																	</li>
																	<li>
																		<div className='al-icon1'>
																			<i className='material-icons'>work</i>
																		</div>
																		<span className='sm'>
																			{questionTypeAmount['Role specific']}
																		</span>{' '}
																		Job Specific
																		<a
																			id='pop'
																			className='a__relative hideonmobile'
																			href='/'
																			onClick={e => e.preventDefault()}
																			data-toggle='popover'
																			data-content='The total number of questions used in the questionnaire.'
																			data-original-title=''
																			title=''
																		>
																			<div
																				className='popover fade bs-popover-top show custom-popover'
																				role='tooltip'
																				id='popover'
																			>
																				{/* <div className="arrow"></div> */}
																				<h3 className='popover-header'>
																					{null}
																				</h3>
																				<div className='popover-body'>
																					We recommend including 4 to 7
																					questions about your professional
																					capabilities.
																				</div>
																			</div>
																			<i className='material-icons icon_info text-secondary'>
																				info
																			</i>
																		</a>
																	</li>
																	<li>
																		<div className='al-icon1'>
																			<NoteAdd />
																		</div>
																		<span className='sm'>
																			{questionTypeAmount['Custom History']}
																		</span>{' '}
																		Custom
																		<a
																			id='pop'
																			className='a__relative hideonmobile'
																			href='/'
																			onClick={e => e.preventDefault()}
																			data-toggle='popover'
																			data-content='The total number of questions used in the questionnaire.'
																			data-original-title=''
																			title=''
																		>
																			<div
																				className='popover fade bs-popover-top show custom-popover'
																				role='tooltip'
																				id='popover'
																			>
																				<h3 className='popover-header'>
																					{null}
																				</h3>
																				<div className='popover-body'>
																					These are the Custom History questions
																					you have added.
																				</div>
																			</div>
																			<i className='material-icons icon_info text-secondary'>
																				info
																			</i>
																		</a>
																	</li>
																</ul>
																<Divider
																	orientation='vertical'
																	className='m-2 h-24'
																/>
																<Stack
																	direction='row'
																	gap={1}
																	alignItems='center'
																>
																	<Typography className='font-bold'>
																		Type:
																	</Typography>
																	<Stack
																		justifyContent='center'
																		alignItems='center'
																		rowGap={1}
																	>
																		<Box className='h-5 w-5 rounded-full bg-blue-400' />
																		<Typography>Text</Typography>
																	</Stack>
																	<Stack
																		justifyContent='center'
																		alignItems='center'
																		rowGap={1}
																	>
																		<Box className='h-5 w-5 rounded-full bg-credibledGreen' />
																		<Typography>Rating</Typography>
																	</Stack>
																</Stack>
															</div>
														</div>
													</div>

													<Stack
														direction='row'
														className='h-16 border-2 border-y-1 border-solid border-gray-200'
													>
														<Box className='h-16 min-w-[62px] border-y-0 border-l-0 border-r-2 border-solid border-gray-200 text-center'>
															<DragIndicatorIcon
																color='primary'
																className='h-full'
															/>
														</Box>
														<Typography
															variant='h5'
															className='text-primary pl-3 pt-3'
														>
															Selected Questions
														</Typography>
													</Stack>

													<DragDropContext onDragEnd={handleOnDragEnd}>
														<Droppable droppableId='characters'>
															{(provided: any) => (
																<Grid
																	container
																	id='characters'
																	{...provided.droppableProps}
																	ref={provided.innerRef}
																>
																	{questions?.map((val, i) => {
																		return (
																			<Draggable
																				key={val.uuid}
																				draggableId={val.uuid}
																				index={i}
																			>
																				{(provided: any) => (
																					<Grid
																						item
																						xs={12}
																						ref={provided.innerRef}
																						{...provided.draggableProps}
																						{...provided.dragHandleProps}
																					>
																						<Stack
																							direction='row'
																							className='h-16 border-2 border-y-1 border-solid border-gray-200'
																						>
																							<Typography
																								variant='h6'
																								className='min-w-[60px] p-3 pl-4'
																							>
																								{i + 1}.
																							</Typography>
																							<Box
																								component='aside'
																								className={`${
																									val.rateFlag
																										? 'br-green'
																										: 'br-blue'
																								} pl-1 pr-3 pt-3`}
																							>
																								{val.bucket === customUUID ||
																								val.bucket ===
																									'Custom History' ||
																								(
																									val as typeof val & {
																										isCustom?: boolean;
																									}
																								)?.isCustom ? (
																									<NoteAdd
																										className={
																											val.rateFlag
																												? 'text-credibledGreen'
																												: 'text-blue-400'
																										}
																									/>
																								) : (
																									<i
																										className={`material-icons ${val.rateFlag ? 'text-credibledGreen' : 'text-blue-400'}`}
																									>
																										{val.bucket ===
																											essentialUUID ||
																										val.bucket === 'Essentials'
																											? 'grade'
																											: val.bucket ===
																														'Personal Attributes' ||
																												  val.bucket ===
																														personalAttributesUUID
																												? 'account_box'
																												: 'work'}
																									</i>
																								)}
																							</Box>
																							<Typography
																								variant='button'
																								className='pt-3'
																							>
																								{val.question}
																							</Typography>
																							<Stack
																								direction='row'
																								className='grow pr-4 opacity-0 hover:opacity-100'
																								alignItems='center'
																								justifyContent='end'
																							>
																								<span>
																									<i className='fa fa-arrows-v fa-lg'></i>
																								</span>
																								<span
																									onClick={e => {
																										e.preventDefault();
																										if (!showModal)
																											return handleQuestionDelete(
																												val.uuid
																											);
																										setDeletePreference({
																											type: 'ADD_UUID',
																											payload: val.uuid,
																										});
																									}}
																								>
																									<a
																										className='open-icon'
																										id='del-list'
																										href='/'
																										{...(showModal && {
																											'data-toggle': 'modal',
																										})}
																										{...(showModal && {
																											'data-target':
																												'#delete_question',
																										})}
																									>
																										<i className='fa fa-trash fa-lg' />
																									</a>
																								</span>
																							</Stack>
																						</Stack>
																					</Grid>
																				)}
																			</Draggable>
																		);
																	})}
																	{provided.placeholder}
																</Grid>
															)}
														</Droppable>
													</DragDropContext>
													<div
														className='notes'
														id='questionsError'
														style={{ display: 'none' }}
													>
														Please add at least 1 question
													</div>
													<div className='col-md-12 mt3 pb3'>
														<div className='box-pad pt2 nomobile'>
															<Button
																className='btn-lg btn-secondary-outline'
																onClick={() => {
																	clearQuestions();
																	navigate('/home/template-homepage', {
																		replace: true,
																	});
																}}
																variant='contained'
															>
																Cancel
															</Button>
															&nbsp;
															<LoadingButton
																className='btn-lg'
																loading={isLoading}
																variant='contained'
																startIcon={<Save />}
																color='secondary'
																onClick={handleSave}
															>
																Save
															</LoadingButton>
														</div>

														<div
															className='box-pad pt2 viewonmobile'
															style={{ display: 'none' }}
														>
															<button
																className='btn btn-secondary-outline full-width-button'
																onClick={() => {
																	clearQuestions();
																	navigate('/home/template-homepage', {
																		replace: true,
																	});
																}}
															>
																Cancel
															</button>
															&nbsp;
															<button
																className='btn btn-primary full-width-button'
																onClick={handleSave}
																disabled={isLoading || questions?.length <= 0}
															>
																{isLoading ? (
																	<CircularProgress
																		color='secondary'
																		size={20}
																	/>
																) : (
																	'Save'
																)}
															</button>
														</div>
													</div>
												</div>
											</div>

											<div className='clearfix'></div>
										</div>
									</div>

									{/* Load QuestionsModal */}
									<div
										className='modal fade'
										id='modal'
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
														{!isLoading && fetchedQuestions?.bucketName}
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
														<div className='model_scroll'>
															<ul id='questionnaire'>
																{isLoading ? (
																	<CircularProgress
																		sx={{
																			position: 'absolute',
																			top: 0,
																			left: 0,
																			right: 0,
																			bottom: 0,
																			margin: 'auto',
																		}}
																	/>
																) : fetchedQuestions?.questions.length ? (
																	fetchedQuestions?.questions?.map(
																		(val: any, i: any) => (
																			<li key={val.uuid}>
																				<div className='div-p__grid div-p__grid-gap'>
																					<p>{i + 1}.</p>
																					<p>{val.question}</p>
																					<p>
																						<button
																							className={`btn btnxs ${
																								val.added
																									? 'btn-gray'
																									: 'btn-secondary-outline'
																							}`}
																							aria-label='Close'
																							onClick={() =>
																								handleQuestionToggle(
																									val,
																									val.added
																								)
																							}
																						>
																							<i className='material-icons'>
																								{val.added
																									? null
																									: 'add_circle'}
																							</i>
																							&nbsp;{' '}
																							{val.added ? 'Remove' : 'Add'}
																						</button>
																					</p>
																				</div>
																			</li>
																		)
																	)
																) : (
																	<Typography
																		variant='body2'
																		className='pl-1.5 text-lg'
																	>
																		Your custom question history is empty now -
																		start by creating your first question
																		directly in the 'Search or Create a
																		Question' bar!
																	</Typography>
																)}
															</ul>
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
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<footer
				className='footer showonmobile'
				style={{ display: `none` }}
			>
				<nav className='col-md-12'>
					<ul className='mobile_footer'>
						<li className='nav-item'>
							<Link
								className={`nav-item ${
									currLink.includes('requests') &&
									!currLink.includes('add-new-request')
										? 'mobile-active'
										: null
								}`}
								to='/home/requests'
							>
								<i className='material-icons-outlined'>dvr</i>
								<p>Requests</p>
							</Link>
						</li>
						<li
							className={`nav-item ${
								currLink.includes('add-new-request') ? 'mobile-active' : null
							}`}
							key='reqs'
						>
							<Link
								className='nav-link'
								to={`/${baseLink}/requests/add-new-request`}
							>
								<i className='material-icons-outlined'>post_add</i>
								<p>New Request</p>
							</Link>
						</li>
						<li
							className={`nav-item ${
								currLink.includes('questionnaires') ? 'mobile-active' : null
							}`}
							key='questnrs'
						>
							<Link
								className='nav-link'
								to={`/${baseLink}/questionnaires`}
							>
								<i className='material-icons-outlined'>assignment</i>
								<p>Questionnaires</p>
							</Link>
						</li>
						<li
							className='nav-item dropdown'
							key='uniq1'
						>
							<a
								// className="nav-link dropdown-toggle"
								className='nav-link'
								href='#!'
								id='footermore'
								data-toggle='dropdown'
								aria-haspopup='true'
								aria-expanded='false'
							>
								<i className='material-icons-outlined'>more_vert</i>
								<p>More</p>
							</a>
							<div
								className='dropdown-menu'
								aria-labelledby='navbarDropdownMenuLink'
							>
								<Link
									className='dropdown-item'
									to={`/home/template-homepage`}
								>
									Questionnaire Builder
								</Link>
								{/**
                  <a className="dropdown-item" href={`/${baseLink}/help-and-traning`}>
                  Help & Training
                </a> */}
								<Link
									className='dropdown-item'
									to={`/home/settings`}
								>
									Settings
								</Link>
							</div>
						</li>
					</ul>
				</nav>
			</footer>
			<DeleteQuestionModal
				{...{ showModal, handleDeletePreference, deleteUUID, handleRemoveUUID }}
			/>
		</>
	);

	function getDuplicateCount(questionnaires: any = [], title: any = '') {
		const questionnairesWithTitle = questionnaires?.filter?.((val: any) =>
			val?.questionnaire_title?.includes?.(title)
		);
		const containsNoDuplicate = questionnairesWithTitle?.some?.(
			(val: any) => !val?.questionnaire_title?.includes('-duplicate-')
		);
		return containsNoDuplicate
			? questionnairesWithTitle?.length
			: questionnairesWithTitle?.length + 1;
	}
}

function getName() {
	return localStorage.getItem('firstName');
}

export default TemplateBuilderMain;
type blah = { a: string };
type glah = { d: string };
type Test = blah & glah;
