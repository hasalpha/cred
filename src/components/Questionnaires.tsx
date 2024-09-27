import { Box, Button, Modal, Switch, TextField } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { getDate, useQuestionnaires } from '../Common';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { archiveQuestionnaire } from '../apis/user.api';
import { CustomToolTip } from './CustomToolTip';
import OptionMenu from './OptionMenu';
import Cookies from 'js-cookie';
import {
	getAdminQuestionnaire,
	updateClientAdminQuestionnaire,
} from '../apis/admin.api';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Questionnaire } from '../apis/types/user-api-types';
import { EditQuestionnaireTitleModal } from './EditQuestionnaireTitleModal';
import { useImmer } from 'use-immer';

export const questionnaireTitleSchema = z
	.string()
	.min(1, 'Questionnaire Title must be atleast one character');

export const modalStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	border: '2px solid #ed642b',
	boxShadow: 24,
	p: 4,
};

function Questionnaires() {
	const [editQuestionnaireUUID, setEditQuestionnaireUUID] =
		useImmer<string>('');
	const { data: allQuestionnaires, refetch: fetchQuestionnaireData } =
		useQuestionnaires();
	const [searchQuery, setSearchQuery] = useState('');
	const preventModal = React.useRef(true);
	const [open, setOpen] = React.useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const handleOpen = useCallback(() => setOpen(true), []);
	const handleClose = useCallback(() => {
		setOpen(false);
		navigate(location.pathname, { replace: true });
	}, [location.pathname, navigate]);
	const { state } = location;
	const { fromTemplateBuilder, uuid, questionnaire_title } = state ?? {};
	useEffect(() => {
		if (fromTemplateBuilder && !open && preventModal.current) {
			preventModal.current = false;
			handleOpen();
		}
	}, [fromTemplateBuilder, handleOpen, open]);

	useEffect(() => {
		if (!Cookies.get('refresh')) {
			navigate('/signin');
		}
	});
	const isAdminQuestionnairePage = location.pathname.includes('admin');
	const corporateQuestionnaires: Questionnaire[] = [];
	const archivedQuestionnaires: Questionnaire[] = [];
	const questionnaires = isAdminQuestionnairePage
		? allQuestionnaires
		: allQuestionnaires?.filter(q => {
				if (q.is_archived) {
					archivedQuestionnaires.push(q);
					return false;
				}
				if (q.is_client_created) {
					if (q.is_active || isAdminQuestionnairePage)
						corporateQuestionnaires.push(q);
					return false;
				}
				return true;
			});

	const [archiveChkBox, setArchiveChkBox] = useState(0);
	const [fetchedQuestions, setFetchedQuestions] = useState<Record<string, any>>(
		{}
	);
	console.log({ questionnaires });

	const handleSave = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const data = new FormData(e.currentTarget);
			const questionnaireTitle = data.get('questionnaireTitle');
			const title = questionnaireTitleSchema.safeParse(questionnaireTitle);
			if (title.success) {
				const { data } = title;
				const response = await updateClientAdminQuestionnaire({
					uuid,
					questionnaire_title: data,
				});
				if (response.status === 200 || response.status === 201) {
					fetchQuestionnaireData();
					toast.success('Updated questionnaire title successfully!');
					return handleClose();
				}
				toast.error(response.status);
				return handleClose();
			}
		},
		[fetchQuestionnaireData, handleClose, uuid]
	);

	const handleActiveChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
		uuid: string
	) => {
		const response = await updateClientAdminQuestionnaire({
			uuid,
			is_active: e.target.checked,
		});
		if (response.status === 200 || response.status === 201) {
			toast.success('Questionnaire updated successfully!');
			fetchQuestionnaireData();
		}
	};

	const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	};

	const handleArchive = async (questionnaireUUID: string, archive = true) => {
		await archiveQuestionnaire(questionnaireUUID, archive);
		await fetchQuestionnaireData();
	};

	const handleClone = (questionnaireUUID: string) => {
		navigate(`/home/template-builder/${questionnaireUUID}`);
	};

	const handleArchived = async () => {
		if (
			(document.getElementById('chkBoxArchived') as HTMLInputElement).checked ||
			(document.getElementById('chkBoxArchived2') as HTMLInputElement).checked
		) {
			setArchiveChkBox(1);
		} else {
			setArchiveChkBox(0);
		}
	};

	return (
		<>
			<div
				className='main-panel'
				style={{ float: 'none', width: '100%' }}
			>
				<div
					className='content'
					style={{ padding: '0px', minHeight: 'auto' }}
				>
					<div className='container-fluid'>
						<div className='card-plain'>
							<div className='card-body'>
								<div className='row'>
									<div className='col-md-12'>
										<div className='card-plain bb10'>
											<div className='row justify-content-between'>
												<div className='col-md-4'>
													<h3>
														{isAdminQuestionnairePage
															? 'Corporate Questionnaires'
															: 'My Questionnaires'}
													</h3>
												</div>
												<div className='nomobile mr-lg-3'>
													<Link
														className='btn btn-primary btn-lg'
														to={'../template-homepage'}
													>
														Create Questionnaire
													</Link>
													&nbsp;
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className='row'>
							<div className='col-md-12 lrpad'>
								<div className='card mt_zero pad_zero'>
									<div className='search-box'>
										<div className='row'>
											<div className='col-md-8'>
												<form className='navbar-form'>
													<div className='input-group no-border'>
														<i className='material-icons sr_icon'>search</i>
														<input
															type='text'
															value={searchQuery}
															onChange={handleSearchQueryChange}
															className='form-control'
															placeholder='Search...'
															onKeyDown={handleEnterPress}
														/>
													</div>
												</form>
											</div>
											{!location.pathname.includes('admin') && (
												<div className='col-md-12 nomobile pthalf hideonmobile text-right'>
													<div className='form-check form-check-inline'>
														<label
															className='form-check-label'
															style={{
																position: 'absolute',
																bottom: '35px',
																right: '5px',
															}}
														>
															<input
																className='form-check-input'
																type='checkbox'
																id='chkBoxArchived'
																value={archiveChkBox}
																onChange={handleArchived}
															/>
															Archived
															<span className='form-check-sign'>
																<span className='check'></span>
															</span>
														</label>
													</div>
												</div>
											)}
										</div>
									</div>

									{/* <!--Mobile View Table starts here --> */}

									<div
										className='showonmobile mt2 lrpad'
										style={{ display: 'none' }}
									>
										<div className='row'>
											<table className='mobile-data-table table'>
												<tbody>
													{!location.pathname.includes('admin') && (
														<tr>
															<td>
																<div className='form-check form-check-m form-check-inline'>
																	<label className='form-check-label'>
																		<input
																			className='form-check-input'
																			type='checkbox'
																			id='chkBoxArchived2'
																			value={archiveChkBox}
																			onChange={handleArchived}
																		/>
																		Archived
																		<span className='form-check-sign'>
																			<span className='check'></span>
																		</span>
																	</label>
																</div>
															</td>
														</tr>
													)}
												</tbody>
											</table>
											{archiveChkBox === 0
												? questionnaires
														?.filter(val => {
															if (searchQuery === '') {
																return true;
															}
															return val?.questionnaire_title
																?.toLowerCase()
																?.includes(searchQuery.toLowerCase());
														})
														?.map(v => (
															<table
																className='mobile-data-table table'
																key={v.uuid}
															>
																<tbody>
																	<tr>
																		<td className='w30'>Title</td>
																		<td>
																			<a
																				data-toggle='modal'
																				data-target='#modal'
																				href='#modal'
																				onClick={async () => {
																					setFetchedQuestions(v);
																				}}
																			>
																				{v.questionnaire_title}
																			</a>
																		</td>
																	</tr>
																	<tr>
																		<td>Created On</td>
																		<td>{getDate(v.created_at, 'mmddyyyy')}</td>
																	</tr>
																	<tr>
																		<td>
																			Questions
																			<Tooltip
																				className='hideonmobile'
																				placement='top'
																				title='The total number of questions used in the questionnaire.'
																			>
																				<div>
																					<InfoIcon
																						style={{
																							color: '#ED642A',
																							cursor: 'pointer',
																						}}
																					/>
																				</div>
																			</Tooltip>
																		</td>
																		<td>{v.noOfQuestions}</td>
																	</tr>
																	{v.val === 'default_questionnaire' ||
																	v.questionnaire_title?.toLowerCase() ===
																		'default questionnaire' ? null : (
																		<tr>
																			{location.pathname.includes('admin') ? (
																				<>
																					<td>Active</td>
																					<td>
																						<Switch
																							defaultChecked={v.is_active}
																							onChange={e =>
																								handleActiveChange(e, v.uuid)
																							}
																							size='small'
																						/>
																					</td>
																				</>
																			) : (
																				<>
																					<td>Actions</td>
																					<td>
																						<a
																							href='/'
																							onClick={e => {
																								e.preventDefault();
																								handleArchive(v.uuid);
																							}}
																						>
																							<i className='fa fa-file-archive-o'></i>
																							&nbsp;&nbsp;Archive
																						</a>
																					</td>
																				</>
																			)}
																		</tr>
																	)}
																	{!archiveChkBox &&
																		!location.pathname.includes('admin') && (
																			<tr>
																				<td>Duplicate</td>
																				<td>
																					<a
																						href='/'
																						onClick={e => {
																							e.preventDefault();
																							handleClone(v.uuid);
																						}}
																					>
																						<i className='fa fa-clone'></i>
																						&nbsp;&nbsp;Duplicate
																					</a>
																				</td>
																			</tr>
																		)}
																	{v.questionnaire_title?.toLowerCase() ===
																		'default questionnaire' && (
																		<tr>
																			<td>Edit Title</td>
																			<td>
																				<a
																					href='#noop'
																					onClick={() =>
																						window.alert('clicked!')
																					}
																				>
																					Edit Title
																				</a>
																			</td>
																		</tr>
																	)}
																</tbody>
															</table>
														))
												: archivedQuestionnaires
														?.filter(val => {
															if (searchQuery === '') {
																return true;
															}
															return val?.questionnaire_title
																?.toLowerCase()
																?.includes(searchQuery.toLowerCase());
														})
														?.map((localState, _) => (
															<table
																className='mobile-data-table table'
																key={localState.uuid}
															>
																<tbody>
																	<tr>
																		<td className='w30'>Title</td>
																		<td>
																			<a
																				data-toggle='modal'
																				data-target='#modal'
																				href='#modal'
																				onClick={() => {
																					setFetchedQuestions(localState);
																				}}
																			>
																				{localState.questionnaire_title}
																			</a>
																		</td>
																	</tr>
																	<tr>
																		<td>Created On</td>
																		<td>
																			{getDate(
																				localState.created_at,
																				'mmddyyyy'
																			)}
																		</td>
																	</tr>
																	<tr>
																		<td>
																			Questions
																			<Tooltip
																				className='hideonmobile'
																				placement='top'
																				title='The total number of questions used in the questionnaire.'
																			>
																				<div>
																					<InfoIcon
																						style={{
																							color: '#ED642A',
																							cursor: 'pointer',
																						}}
																					/>
																				</div>
																			</Tooltip>
																		</td>
																		<td>{localState.noOfQuestions}</td>
																	</tr>
																	<tr>
																		<td>Actions</td>
																		<td>
																			<a
																				href='/'
																				onClick={e => {
																					e.preventDefault();
																					handleArchive(localState.uuid, false);
																				}}
																			>
																				<i className='fa fa-file-archive-o'></i>
																				&nbsp;&nbsp;Unarchive
																			</a>
																		</td>
																	</tr>
																	{!archiveChkBox && (
																		<tr>
																			<td>Duplicate</td>
																			<td>
																				<a
																					href='/'
																					onClick={e => {
																						e.preventDefault();
																						handleClone(localState.uuid);
																					}}
																				>
																					<i className='fa fa-clone'></i>
																					&nbsp;&nbsp;Duplicate
																				</a>
																			</td>
																		</tr>
																	)}
																</tbody>
															</table>
														))}
										</div>
									</div>

									{/* <!--Mobile View Table starts here --> */}
									<div className='table-responsive hideonmobile'>
										<table className='table-hover table'>
											<thead>
												<tr>
													<th className='text-center'>#</th>
													<th className='sorting'>Title</th>
													<th className='sorting'>Created On</th>
													<th className='sorting'>
														Questions
														<CustomToolTip
															className='hideonmobile'
															content={
																'The total number of questions in the questionnaire'
															}
														/>
													</th>
													<th className='sorting'>
														{location.pathname.includes('admin')
															? 'Active'
															: 'Actions'}
													</th>
													{!archiveChkBox && null}
												</tr>
											</thead>
											<tbody>
												{archiveChkBox === 0
													? questionnaires
															?.filter(val => {
																if (searchQuery === '') {
																	return true;
																}
																return val?.questionnaire_title
																	?.toLowerCase()
																	?.includes(searchQuery.toLowerCase());
															})
															?.map((val, i) => (
																<tr key={val.uuid}>
																	<td className='text-center'>{i + 1}</td>
																	<td>
																		<a
																			data-toggle='modal'
																			data-target='#modal'
																			href='#modal'
																			onClick={() => {
																				setFetchedQuestions(val);
																			}}
																		>
																			{val.questionnaire_title}
																		</a>
																	</td>
																	<td>{getDate(val.created_at, 'mmddyyyy')}</td>
																	<td style={{ paddingLeft: '40px' }}>
																		{val.noOfQuestions}
																	</td>
																	<td>
																		{location.pathname.includes('admin') ? (
																			<Switch
																				defaultChecked={val.is_active}
																				onChange={e =>
																					handleActiveChange(e, val.uuid)
																				}
																			/>
																		) : (
																			<OptionMenu
																				options={[
																					val.questionnaire_title !==
																						'default_questionnaire' &&
																					val.questionnaire_title?.toLowerCase() !==
																						'default questionnaire'
																						? 'Archive'
																						: '',
																					val.questionnaire_title !==
																						'default_questionnaire' ||
																					val.questionnaire_title?.toLowerCase() !==
																						'default questionnaire'
																						? 'Duplicate'
																						: '',
																					val.questionnaire_title !==
																						'default_questionnaire' &&
																					val.questionnaire_title?.toLowerCase() !==
																						'default questionnaire'
																						? 'Edit Title'
																						: '',
																				]}
																				handleMenuSelect={menuOption => {
																					switch (menuOption) {
																						case 'Archive': {
																							return handleArchive(val.uuid);
																						}
																						case 'Duplicate': {
																							return handleClone(val.uuid);
																						}
																						case 'Edit Title': {
																							return setEditQuestionnaireUUID(
																								val.uuid
																							);
																						}
																					}
																				}}
																			/>
																		)}
																	</td>
																</tr>
															))
													: archivedQuestionnaires
															?.filter(val => {
																if (searchQuery === '') {
																	return true;
																}
																return val?.questionnaire_title
																	?.toLowerCase()
																	?.includes(searchQuery.toLowerCase());
															})
															?.map((val, i) => (
																<tr key={val.uuid}>
																	<td className='text-center'>{i + 1}</td>
																	<td>
																		<a
																			data-toggle='modal'
																			data-target='#modal'
																			href='#modal'
																			onClick={async () => {
																				const questionnaire =
																					await getAdminQuestionnaire(val.uuid);
																				console.log({ questionnaire });
																				setFetchedQuestions(val);
																			}}
																		>
																			{val.questionnaire_title}
																		</a>
																	</td>
																	<td>{getDate(val.created_at, 'mmddyyyy')}</td>
																	<td style={{ paddingLeft: '40px' }}>
																		{val.noOfQuestions}
																	</td>
																	<td>
																		<a
																			href='/'
																			onClick={e => {
																				e.preventDefault();
																				handleArchive(val.uuid, false);
																			}}
																		>
																			<i className='fa fa-file-archive-o'></i>
																			&nbsp;&nbsp;Unarchive
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

					{!isAdminQuestionnairePage && corporateQuestionnaires.length > 0 && (
						<div className='container-fluid'>
							<div className='card-plain'>
								<div className='card-body'>
									<div className='row'>
										<div className='col-md-12'>
											<div className='card-plain bb10'>
												<div className='row justify-content-between'>
													<div className='col-md-4'>
														<h3>Corporate Questionnaires</h3>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className='row'>
								<div className='col-md-12 lrpad'>
									<div className='card mt_zero pad_zero'>
										<div className='search-box'>
											<div className='row'>
												<div className='col-md-8'>
													<form className='navbar-form'>
														<div className='input-group no-border'>
															<i className='material-icons sr_icon'>search</i>
															<input
																type='text'
																value={searchQuery}
																onChange={handleSearchQueryChange}
																className='form-control'
																placeholder='Search...'
																onKeyDown={handleEnterPress}
															/>
														</div>
													</form>
												</div>
												{!location.pathname.includes('admin') && (
													<div className='col-md-12 nomobile pthalf hideonmobile text-right'>
														<div className='form-check form-check-inline'></div>
													</div>
												)}
											</div>
										</div>

										{/* <!--Mobile View Table starts here --> */}

										<div
											className='showonmobile mt2 lrpad'
											style={{ display: 'none' }}
										>
											<div className='row'>
												<table className='mobile-data-table table'>
													<tbody>
														{!location.pathname.includes('admin') && (
															<tr>
																<td>
																	<div className='form-check form-check-m form-check-inline'>
																		<label className='form-check-label'>
																			<input
																				className='form-check-input'
																				type='checkbox'
																				id='chkBoxArchived2'
																				value={archiveChkBox}
																				onChange={handleArchived}
																			/>
																			Archived
																			<span className='form-check-sign'>
																				<span className='check'></span>
																			</span>
																		</label>
																	</div>
																</td>
															</tr>
														)}
													</tbody>
												</table>
												{corporateQuestionnaires
													?.filter(val => {
														if (searchQuery === '') {
															return true;
														}
														return val?.questionnaire_title
															?.toLowerCase()
															?.includes(searchQuery.toLowerCase());
													})
													?.map((questionnaire, _) => (
														<table
															className='mobile-data-table table'
															key={questionnaire.uuid}
														>
															<tbody>
																<tr>
																	<td className='w30'>Title</td>
																	<td>
																		<a
																			data-toggle='modal'
																			data-target='#modal'
																			href='#modal'
																			onClick={async () => {
																				setFetchedQuestions(questionnaire);
																			}}
																		>
																			{questionnaire.questionnaire_title}
																		</a>
																	</td>
																</tr>
																<tr>
																	<td>Created On</td>
																	<td>
																		{getDate(
																			questionnaire.created_at,
																			'mmddyyyy'
																		)}
																	</td>
																</tr>
																<tr>
																	<td>
																		Questions
																		<Tooltip
																			className='hideonmobile'
																			placement='top'
																			title='The total number of questions used in the questionnaire.'
																		>
																			<div>
																				<InfoIcon
																					style={{
																						color: '#ED642A',
																						cursor: 'pointer',
																					}}
																				/>
																			</div>
																		</Tooltip>
																	</td>
																	<td>{questionnaire.noOfQuestions}</td>
																</tr>
															</tbody>
														</table>
													))}
											</div>
										</div>

										<div className='table-responsive hideonmobile'>
											<table className='table-hover table'>
												<thead>
													<tr>
														<th className='text-center'>#</th>
														<th className='sorting w-1/3'>Title</th>
														<th className='sorting'>Created On</th>
														<th className='sorting'>
															Questions
															<CustomToolTip
																className='hideonmobile'
																content={
																	'The total number of questions in the questionnaire'
																}
															/>
														</th>
													</tr>
												</thead>
												<tbody>
													{corporateQuestionnaires
														?.filter(val => {
															if (searchQuery === '') {
																return true;
															}
															return val?.questionnaire_title
																?.toLowerCase()
																?.includes(searchQuery.toLowerCase());
														})
														?.map((val, i) => (
															<tr key={val.uuid}>
																<td className='text-center'>{i + 1}</td>
																<td>
																	<a
																		data-toggle='modal'
																		data-target='#modal'
																		href='#modal'
																		onClick={() => {
																			setFetchedQuestions(val);
																		}}
																	>
																		{val.questionnaire_title}
																	</a>
																</td>
																<td>{getDate(val.created_at, 'mmddyyyy')}</td>
																<td>{val.noOfQuestions}</td>
															</tr>
														))}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
			<footer
				className='footer showonmobile'
				style={{ display: `none` }}
			>
				<nav className='col-md-12'>
					<ul className='mobile_footer'>
						<li
							className='nav-item'
							key='q1'
						>
							<Link
								className='nav-link'
								to='/home/requests'
							>
								<i className='material-icons-outlined'>dvr</i>
								<p>Requests</p>
							</Link>
						</li>
						<li
							className='nav-item'
							key='q2'
						>
							<Link
								className='nav-link'
								to='/home/add-new-request'
							>
								<i className='material-icons-outlined'>post_add</i>
								<p>New Request</p>
							</Link>
						</li>
						<li
							className='nav-item mobile-active'
							key='q3'
						>
							<Link
								className='nav-link'
								to='/home/questionnaires'
							>
								<i className='material-icons-outlined'>assignment</i>
								<p>Questionnaires</p>
							</Link>
						</li>
						<li className='nav-item dropdown'>
							<a
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
								x-placement='top-start'
								style={{
									position: 'absolute',
									top: '-43px',
									left: '-37px',
									willChange: 'top, left',
								}}
							>
								<Link
									className='dropdown-item'
									to={`/home/template-homepage`}
								>
									Questionnaire Builder
								</Link>
								<Link
									className='dropdown-item'
									to='/home/settings'
								>
									Settings
								</Link>
							</div>
						</li>
					</ul>
				</nav>
			</footer>
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
								{fetchedQuestions.questionnaire_title}
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
										{fetchedQuestions?.questionList?.map((val: any, i: any) => (
											<li key={val.uuid}>
												<div className='div-p__grid div-p__grid-gap'>
													<p>{i + 1}.</p>
													<p>{val.question ? val.question : val}</p>
												</div>
											</li>
										))}
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
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<Box
					sx={modalStyle}
					className='modal-style'
				>
					{location.pathname.includes('admin') ? (
						<>
							<h3 className='text-primary text-center'>
								Confirm your Questionnaire Title,{' '}
								<span className='text-secondary capitalize'>
									{localStorage.getItem('firstName')}!
								</span>
							</h3>
							<h4 className='mb-3 text-center'>
								Your template is now in the company questionnaires. When active,
								all users can access it.{' '}
							</h4>
							<Box
								component='form'
								onSubmit={handleSave}
							>
								<TextField
									required
									name='questionnaireTitle'
									id='questionnaireTitle'
									label='Questionnaire Title'
									fullWidth
									variant='standard'
									autoFocus
									margin='normal'
									defaultValue={questionnaire_title}
								/>
								<div className='modal-footer mt-3'>
									<Button
										variant='contained'
										onClick={handleClose}
									>
										Close
									</Button>
									<Button
										type='submit'
										variant='contained'
										color='secondary'
									>
										Save
									</Button>
								</div>
							</Box>
						</>
					) : (
						<>
							<h3
								className='text-primary no-pt2 pt2'
								style={{ textAlign: 'center' }}
							>
								Awesome{' '}
								<span className='text-secondary'>
									{localStorage.getItem('firstName')}
								</span>
								, your template has been added to your Credibled Questionnaires.{' '}
							</h3>
							<div className='modal-footer'>
								<button
									type='button'
									className='btn btn-secondary-outline modal-close-button'
									onClick={handleClose}
								>
									Close
								</button>
							</div>
						</>
					)}
				</Box>
			</Modal>
			<EditQuestionnaireTitleModal
				uuid={editQuestionnaireUUID}
				handleClose={() => setEditQuestionnaireUUID('')}
			/>
		</>
	);
}

export default Questionnaires;
