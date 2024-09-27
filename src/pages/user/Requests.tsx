import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { Box, Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { addToArchive, getCandidatesList, getSummaryCount } from '../../apis';
import { RequestItem, Tabs, DisplayStatuses } from '../../apis/types';
import {
	filterRequests,
	searchRequests,
	unarchiveRequest,
} from '../../apis/user.api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { OptionMenu } from '../../components';
import { toast } from 'react-toastify';
import { useInView } from 'react-intersection-observer';
import { useDebounce, useRequestInfinite } from '../../Common';
dayjs.extend(utc);

const filterBy = [
	'All Requests',
	'Last 15 days',
	'Last 1 month',
	'Last 3 months',
];

const getNextIndex = (filterName: string) =>
	(filterBy?.indexOf?.(filterName) + 1) % filterBy?.length;

const getDays = (text: string) => ('' + text).match(/\b\d+\b/)?.[0] ?? '1000';

function isValidTab(tab: string): tab is Tabs {
	return ['in_progress', 'requested', 'completed', 'archive'].includes(tab);
}

function getDisplayStatus(tab: Tabs): DisplayStatuses {
	switch (tab) {
		case 'archive':
			return 'Archived';
		case 'requested':
			return 'Requested';
		case 'completed':
			return 'Completed';
		case 'in_progress':
			return 'In Progress';
		default:
			throw new Error(`${tab} not found`);
	}
}

function Requests() {
	const navigate = useNavigate();
	const { state: previousTab } = useLocation();
	const searchInputRef = useRef<HTMLInputElement>(null);
	const firstRunRef = useRef<boolean>(true);
	const searchButtonRef = useRef<HTMLAnchorElement | null>(null);
	const { ref, inView } = useInView();
	const [selectedTab, setSelectedTab] = useState<Tabs | null>('requested');
	const [mobileFilterRequest, setMobileFilterRequest] = useState('Filter By');
	const [status, setStatus] = useState<Tabs>('requested');
	const [archive, setArchive] = useState<RequestItem[]>([]);
	const [filteredArchive, setFilteredArchive] = useState<RequestItem[]>([]);
	const [displayStatus, setDisplayStatus] = useState<
		'Requested' | 'In Progress' | 'Completed' | 'Archived'
	>('Requested');
	const [search, setSearch] = useState('');
	const [summary, setSummary] = useState({
		archived: 0,
		completed: 0,
		inprogress: 0,
		requested: 0,
	});
	const [searchResults, setSearchResults] = useState<null | RequestItem[]>(
		null
	);
	const mutation = useMutation({
		mutationFn: async (archive_uuid: string) => {
			const response = await unarchiveRequest({ archive_uuid });
			if (response.status === 200)
				setFilteredArchive(val => val.filter(v => v.uuid !== archive_uuid));
			const resp2 = await getSummaryCount();
			if (resp2.status === 200) setSummary(resp2.data);
		},
	});

	const nextFilter = useMemo(
		() => filterBy[getNextIndex(mobileFilterRequest)],
		[mobileFilterRequest]
	);
	const days = useMemo(() => {
		let days = Number.parseInt(getDays(nextFilter));
		if (days === 1) days = 30;
		if (days === 3) days = 90;
		return days;
	}, [nextFilter]);

	useEffect(() => {
		const fetchData = async () => {
			const resp1 = await getSummaryCount();
			if (resp1.status === 200) setSummary(resp1.data);
			let tab: Tabs;
			if (!!previousTab && isValidTab(previousTab)) {
				tab = previousTab;
				setSelectedTab(tab);
				return setDisplayStatus(getDisplayStatus(tab));
			}
			if (resp1.data.requested <= 0 && resp1.data.inprogress > 0) {
				tab = 'in_progress';
				setDisplayStatus('In Progress');
			} else {
				tab = 'requested';
				setDisplayStatus('Requested');
			}
			setSelectedTab(tab);
		};
		if (firstRunRef.current) {
			firstRunRef.current = false;
			fetchData();
		}
	}, [previousTab]);

	const { data, isLoading, fetchNextPage, isFetching, refetch } =
		useRequestInfinite(selectedTab);

	useEffect(() => {
		if (inView) fetchNextPage();
	}, [fetchNextPage, inView]);

	const displayRequests = async (candidatesStatus: Tabs) => {
		setSearch('');
		setSearchResults(null);
		if (searchInputRef.current) searchInputRef.current.value = '';
		setSelectedTab(candidatesStatus);
		setStatus(candidatesStatus);
		if (candidatesStatus === 'requested') setDisplayStatus('Requested');
		else if (candidatesStatus === 'in_progress')
			setDisplayStatus('In Progress');
		else if (candidatesStatus === 'completed') setDisplayStatus('Completed');
		else setDisplayStatus('Archived');
		const resp = await getCandidatesList(candidatesStatus);
		if (resp.status === 200) {
			if (candidatesStatus === 'archive') {
				setArchive(resp.data.results);
				setFilteredArchive(resp.data.results);
			} else {
			}
		}
		setMobileFilterRequest('Filter By');
	};

	const handleArchive = async (candidate_uuid: string) => {
		const item = { candidate_uuid };
		const resp = await addToArchive(item);
		if (resp.status === 200) refetch();
		const resp2 = await getSummaryCount();
		if (resp2.status === 200) setSummary(resp2.data);
	};

	async function handleUnarchive(archive_uuid: string) {
		mutation.mutate(archive_uuid, {
			onSuccess: () => {
				refetch();
				getSummaryCount().then(resp => {
					if (resp.status === 200) setSummary(resp.data);
				});
			},
		});
	}

	const searchRequestsDebounced = useDebounce(async (searchParam: string) => {
		const { data } = await searchRequests({ tab: selectedTab!, searchParam });
		if (data && data.results) {
			setSearchResults(data.results);
		}
	}, 1000);
	const filtered =
		searchResults ??
		data?.pages.flatMap(page => (page.results ? page.results : [])) ??
		[];

	const handleSearch = (e: Record<string, any>) => {
		if (status === 'archive') {
			if (e.target.value === '') {
				setFilteredArchive(archive);
			} else {
				setSearch(e.target.value);
				const filteredData = archive.filter(
					item =>
						item.recruiterName.toLowerCase().startsWith(search.toLowerCase()) ||
						item.firstName.toLowerCase().startsWith(search.toLowerCase()) ||
						item.lastName.toLowerCase().startsWith(search.toLowerCase()) ||
						item.email.toLowerCase().startsWith(search.toLowerCase()) ||
						item.role.toLowerCase().startsWith(search.toLowerCase())
				);
				setFilteredArchive(filteredData);
			}
		} else {
			if (e.target.value === '' || !e.target.value) {
				setSearchResults(null);
			} else {
				const { value: searchParam } = e.target;
				setSearch(searchParam);
				searchRequestsDebounced(searchParam);
			}
		}
	};

	const formatFilterDate = (dateString: Date) => {
		if (dateString) {
			let d = new Date(dateString);
			let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
			let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
			let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
			return year + '-' + month + '-' + day;
		}
		return dateString;
	};

	const displayFilteredRequests = async (days: number, text: string) => {
		if (text === 'All Requests') return setSearchResults(null);
		const d = new Date();
		d.setDate(d.getDate() - days);
		if (status === 'archive') {
			const resp1 = await getCandidatesList?.(status);
			const newFilteredArr2 = resp1?.data?.results?.filter?.(
				(item: any) =>
					new Date(item?.data?.candidateMore?.updated_at) >
					new Date(formatFilterDate(d))
			);
			setFilteredArchive(newFilteredArr2);
		} else {
			const { data } = await filterRequests({
				start_date: d.toISOString(),
				tab: selectedTab!,
			});
			setSearchResults(data.results);
		}
		setMobileFilterRequest(text);
	};

	const ArchivehandleRefereeIcon = (refereeArray: RequestItem) => {
		let refArray: { action: string; name: string }[];
		if (refereeArray.references.every(val => Boolean(val.refreeName))) {
			refArray = refereeArray.references.map(val => {
				return {
					action:
						typeof val.refereeResponse === 'string'
							? val.refereeResponse.toLowerCase() === 'declined'
								? 'declined'
								: 'agreed'
							: 'awaiting action',
					name: val.refreeName,
				};
			});
		} else {
			refArray = refereeArray.data?.lifeCycle.flatMap((item: any) =>
				(item.action === 'Agreed' || item.action === 'Declined') &&
				item?.userType === 'Referee'
					? { action: item.action.toLowerCase(), name: item.name }
					: []
			);
		}

		const newRefereeArray = [
			...new Map(refArray.map((val: any) => [val.name, val])).values(),
		] as any;

		let html_tag;
		for (let i = 0; i < newRefereeArray.length; i++) {
			const data = newRefereeArray[i];
			html_tag = (
				<span>
					{html_tag}{' '}
					<span
						style={{
							// position: "absolute",
							display: 'block',
						}}
					>
						{data['action'].toLowerCase() === 'declined' && (
							<ThumbDownAltOutlinedIcon
								style={{
									color: '#ED642A',
									cursor: 'pointer',
									fontSize: '1.1em',
									// display: "none",
								}}
							/>
						)}
						{data['action'].toLowerCase() === 'agreed' && (
							<ThumbUpAltOutlinedIcon
								style={{
									color: '#1396ed',
									cursor: 'pointer',
									fontSize: '1.1em',
									// display: "none",
								}}
							/>
						)}{' '}
						{data['name']}
					</span>
				</span>
			);
		}
		return html_tag;
	};

	const handleRefereeIcon = (refereeArray: any) => {
		var html_tag;
		if (refereeArray)
			for (let i = 0; i < refereeArray?.length; i++) {
				html_tag = (
					<span>
						{html_tag}{' '}
						<span
							style={{
								display: 'block',
							}}
						>
							{(refereeArray[i][2] === 'Declined' ||
								refereeArray[i][2] === 'declined') && (
								<ThumbDownAltOutlinedIcon
									style={{
										color: '#ED642A',
										cursor: 'pointer',
										fontSize: '1.1em',
									}}
								/>
							)}
							{refereeArray[i][2] === 'Accepted' && (
								<ThumbUpAltOutlinedIcon
									style={{
										color: '#1396ed',
										cursor: 'pointer',
										fontSize: '1.1em',
										// display: "none",
									}}
								/>
							)}{' '}
							{refereeArray[i][0]} {refereeArray[i][1]}
						</span>
					</span>
				);
			}
		return html_tag;
	};

	const handleEnterKeyPress = (e: any) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			searchButtonRef!.current?.click();
		}
	};

	const handleClear = useCallback(() => {
		setSearch('');
		setSearchResults(null);
	}, []);

	return (
		<>
			<div className='content'>
				<div className='container-fluid'>
					<div className='card-plain hideonmobile'>
						<div className='card-body'>
							<div className='row'>
								<div className='col-md-12'>
									<div className='row'>
										<div className='col-md-3 col-sm-6 col-6'>
											<a
												href='#!'
												onClick={() => displayRequests('requested')}
											>
												<div
													className={`tile ${
														selectedTab === 'requested' ? 'selected-tile' : null
													}`}
												>
													<label className='h4'>Requested</label>
													<div className='h1 d-flex justify-content-between'>
														<span className='text-secondary material-icons-outlined'>
															forward_to_inbox
														</span>
														<label>{summary.requested}</label>
													</div>
												</div>
											</a>
										</div>
										<div className='col-md-3 col-sm-6 col-6'>
											<a
												href='#!'
												onClick={() => displayRequests('in_progress')}
											>
												<div
													className={`tile ${
														selectedTab === 'in_progress'
															? 'selected-tile'
															: null
													}`}
												>
													<label className='h4'>In Progress</label>
													<div className='h1 d-flex justify-content-between'>
														<span className='text-secondary material-icons-outlined'>
															watch_later
														</span>
														<label>{summary.inprogress}</label>
													</div>
												</div>
											</a>
										</div>
										<div className='col-md-3 col-sm-6 col-6'>
											<a
												href='#!'
												onClick={() => displayRequests('completed')}
											>
												<div
													className={`tile ${
														selectedTab === 'completed' ? 'selected-tile' : null
													}`}
												>
													<label className='h4'>Completed</label>
													<div className='h1 d-flex justify-content-between'>
														<span className='text-secondary material-icons-outlined'>
															done_outline
														</span>
														<label>{summary.completed}</label>
													</div>
												</div>
											</a>
										</div>
										<div className='col-md-3 col-sm-6 col-6'>
											<a
												href='#!'
												onClick={() => displayRequests('archive')}
											>
												<div
													className={`tile ${
														selectedTab === 'archive' ? 'selected-tile' : null
													}`}
												>
													<label className='h4'>Archived</label>
													<div className='h1 d-flex justify-content-between'>
														<span className='text-secondary material-icons-outlined'>
															inventory_2
														</span>
														<label>{summary.archived}</label>
													</div>
												</div>
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='row'>
						<div className='col-md-12 p-0'>
							<div className='card mt_zero pad_zero'>
								<div className='search-box mx-0'>
									<div className='col-md-4'>
										<form className='navbar-form'>
											<div className='input-group no-border'>
												<a
													ref={searchButtonRef}
													href='/'
													onClick={e => {
														e.preventDefault();
														handleSearch(e);
													}}
												>
													<i className='material-icons sr_icon'>search</i>
												</a>
												<input
													ref={searchInputRef}
													type='text'
													className='form-control'
													placeholder='Search...'
													onKeyDown={handleEnterKeyPress}
													onChange={e => handleSearch(e)}
												/>
												{false && (
													<Button
														onClick={handleClear}
														className='relative left-10 top-2'
														color='secondary'
														variant='contained'
													>
														Clear
													</Button>
												)}
											</div>
										</form>
									</div>
								</div>

								{/* Mobile filters starts here */}

								{isLoading ? null : (
									<React.Fragment>
										<div
											className='card-plain showonmobile'
											style={{ display: `none` }}
										>
											<div className='card-body'>
												<div className='row justify-center'>
													<div className='col-6 filter_pad'>
														<a
															href='#!'
															onClick={() => displayRequests('requested')}
														>
															<button
																className={`btn mbtn100 btn-outline-primary ${
																	selectedTab === 'requested'
																		? 'selected-tile'
																		: null
																}`}
															>
																<span className='badge mbadge badge-pill badge-primary relative top-1 float-left sm:hidden'>
																	{summary.requested}
																</span>
																Requested{' '}
																<span className='badge mbadge badge-pill badge-primary relative top-1 hidden sm:inline'>
																	{summary.requested}
																</span>
																<span className='text-secondary fleft material-icons-outlined hidden sm:inline'>
																	forward_to_inbox
																</span>
																<div className='ripple-container'></div>
															</button>
														</a>
													</div>
													<div className='col-6 filter_pad'>
														<a
															href='#!'
															onClick={() => displayRequests('in_progress')}
														>
															<button
																className={`btn mbtn100 btn-outline-primary ${
																	selectedTab === 'in_progress'
																		? 'selected-tile'
																		: null
																}`}
															>
																<span className='badge mbadge badge-pill badge-secondary relative top-1 float-left sm:hidden'>
																	{summary.inprogress}
																</span>
																In Progress{' '}
																<span className='badge mbadge badge-pill badge-secondary top-1 hidden sm:inline'>
																	{summary.inprogress}
																</span>
																<span className='text-secondary fleft material-icons-outlined hidden sm:inline'>
																	watch_later
																</span>
																<div className='ripple-container'></div>
															</button>
														</a>
													</div>
													<div className='col-6 filter_pad'>
														<a
															href='#!'
															onClick={() => displayRequests('completed')}
														>
															<button
																className={`btn mbtn100 btn-outline-primary ${
																	selectedTab === 'completed'
																		? 'selected-tile'
																		: null
																}`}
															>
																<span className='badge mbadge badge-pill badge-trisary relative top-1 float-left sm:hidden'>
																	{summary.completed}
																</span>
																Completed{' '}
																<span className='badge mbadge badge-pill badge-trisary top-1 hidden sm:inline'>
																	{summary.completed}
																</span>
																<span className='text-secondary fleft material-icons-outlined hidden sm:inline'>
																	done_outline
																</span>
																<div className='ripple-container'></div>
															</button>
														</a>
													</div>
													<div className='col-6 filter_pad'>
														<a
															href='#!'
															onClick={() => displayRequests('archive')}
														>
															<button
																className={`btn mbtn100 btn-outline-primary ${
																	selectedTab === 'archive'
																		? 'selected-tile'
																		: null
																}`}
															>
																<span className='badge mbadge badge-pill badge-gray relative top-1 float-left sm:hidden'>
																	{summary.archived}
																</span>
																Archived{' '}
																<span className='badge mbadge badge-pill badge-gray top-1 hidden sm:inline'>
																	{summary.archived}
																</span>
																<span className='text-secondary fleft material-icons-outlined hidden sm:inline'>
																	inventory_2
																</span>
																<div className='ripple-container'></div>
															</button>
														</a>
													</div>
												</div>
											</div>
										</div>

										{/* <!--Mobile filters ends here -->*/}

										<div className='card-plain lrpad'>
											<div className='row align-items-end flex-nowrap'>
												<div className='col-md-6'>
													<h3>{displayStatus}</h3>
												</div>
												<div className='col-md-6 text-right'>
													<div className='btn-group setmobile'>
														<button
															type='button'
															className='btn btnsm btn-secondary'
															onClick={() =>
																displayFilteredRequests?.(days, nextFilter)
															}
														>
															{mobileFilterRequest}
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
																href='#!'
																className='dropdown-item'
																style={{ cursor: 'pointer' }}
																onClick={() =>
																	displayFilteredRequests(1000, 'All Requests')
																}
															>
																All Requests
															</a>
															<a
																href='#!'
																className='dropdown-item'
																style={{ cursor: 'pointer' }}
																onClick={() =>
																	displayFilteredRequests(15, 'Last 15 days')
																}
															>
																Last 15 days
															</a>
															<a
																href='#!'
																className='dropdown-item'
																style={{ cursor: 'pointer' }}
																onClick={() =>
																	displayFilteredRequests(30, 'Last 1 month')
																}
															>
																Last 1 month
															</a>
															<a
																href='#!'
																className='dropdown-item'
																style={{ cursor: 'pointer' }}
																onClick={() =>
																	displayFilteredRequests(90, 'Last 3 months')
																}
															>
																Last 3 months
															</a>
														</div>
													</div>
												</div>
											</div>
										</div>

										{/* <!--Mobile View Table starts here --> */}

										<div
											className='showonmobile'
											style={{ display: `none` }}
										>
											{status === 'archive'
												? filteredArchive.map((item, i) => (
														<Box
															key={i}
															onClick={() =>
																navigate(`/home/candidate/summary/${item.uuid}`)
															}
															className='br5_primary custom-data-table'
														>
															<p>Archived</p>
															<p>{item.recruiterName}</p>
															<p>Request Date</p>
															<p>
																{dayjs(item.created_at).toString().slice(0, 16)}
															</p>
															<p>Candidate</p>
															<p>
																<Link
																	to={`/home/candidate/summary/${item.uuid}`}
																>
																	{item.firstName}&nbsp;{item.lastName}
																	{!item.firstName && !item.lastName
																		? item?.data?.lifeCycle[1] &&
																			item?.data?.lifeCycle?.[1]?.userType ===
																				'candidate'
																			? item?.data?.lifeCycle?.[1].name
																			: item?.data?.lifeCycle?.[2]?.userType ===
																				  'candidate'
																				? item?.data?.lifeCycle?.[2].name
																				: item?.data?.lifeCycle?.forEach(
																						(item: any) => {
																							if (
																								item?.userType ===
																									'candidate' &&
																								item?.action === 'Agreed'
																							)
																								return item?.name;
																						}
																					)
																		: null}
																</Link>
															</p>
															<p>Email</p>
															<p>{item.email ? item.email : 'N/A'}</p>
															<p>Job Title</p>
															<p>{item?.data?.candidateMore.role}</p>
															<p>References </p>
															<p>
																{item?.data?.candidateMore?.references &&
																item?.data?.candidateMore?.references.length > 0
																	? ArchivehandleRefereeIcon(item)
																	: 'Awaiting Action'}
															</p>
															<p>Status</p>
															<p>
																<a
																	href='#!'
																	onClick={e => {
																		e.preventDefault();
																		e.stopPropagation();
																		handleUnarchive(item.uuid);
																	}}
																>
																	<i className='fa fa-file-archive-o'></i>
																	&nbsp;&nbsp;Unarchive
																</a>
															</p>
														</Box>
													))
												: filtered?.map((item, i) => (
														<div
															key={i}
															className='br5_primary custom-data-table relative'
															onClick={() =>
																navigate(
																	`/home/candidate/summary/${item.uuid}`,
																	{
																		state: selectedTab,
																	}
																)
															}
														>
															<p>Requested</p>
															<p>{item.recruiterName}</p>
															<p>Request Date</p>
															<p>
																{dayjs(item.created_at)
																	.toDate()
																	.toString()
																	.slice(0, 16)}
															</p>
															<p>Candidate</p>
															<p>
																<Link
																	to={`/home/candidate/summary/${item.uuid}`}
																>
																	{item?.candidateInfo?.firstName}{' '}
																	{item?.candidateInfo?.lastName}
																</Link>
															</p>
															<p>Email</p>
															<p>{item?.candidateInfo?.email}</p>
															<p>Job Title</p>
															<p>{item.role}</p>
															<p>References</p>
															<p>
																{item.references && item?.references.length > 0
																	? handleRefereeIcon(item.referenceDetails)
																	: 'Awaiting Action'}
															</p>
															<Box className='absolute right-1 top-1'>
																<OptionMenu
																	options={actions.slice()}
																	handleMenuSelect={menuOption => {
																		switch (menuOption) {
																			case 'Archive': {
																				handleArchive(item.uuid);
																				return;
																			}
																			case 'Copy Application Link': {
																				window.navigator.clipboard.writeText(
																					item.application_link
																				);
																				toast.success(
																					'Copied application link successfully!',
																					{
																						autoClose: 500,
																						hideProgressBar: true,
																						theme: 'dark',
																					}
																				);
																				return;
																			}
																		}
																	}}
																/>
															</Box>
														</div>
													))}
											<br />
										</div>

										<div className='table-responsive hideonmobile'>
											<table
												className='table-hover table'
												key='any-key'
											>
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
												{status === 'archive' ? (
													<tbody>
														{filteredArchive.map((item, index) => (
															<tr key={index}>
																<td className='text-center'>{index + 1}</td>
																<td>
																	{dayjs(item.created_at)
																		.toString()
																		.slice(0, 16)}
																</td>
																<td>
																	{item?.data?.candidateMore?.recruiterName}
																</td>
																<td>
																	{item.firstName}&nbsp;{item.lastName}
																	{!item.firstName && !item.lastName
																		? item?.data?.lifeCycle?.[1]?.userType ===
																			'candidate'
																			? item?.data?.lifeCycle?.[1]?.name
																			: item?.data?.lifeCycle?.[2]?.userType ===
																				  'candidate'
																				? item?.data?.lifeCycle?.[2]?.name
																				: item?.data?.lifeCycle?.forEach(
																						(item: any) => {
																							if (
																								item?.userType ===
																									'candidate' &&
																								item?.action === 'Agreed'
																							)
																								return item?.name;
																						}
																					)
																		: null}
																</td>
																<td>{item.email ? item.email : 'N/A'}</td>
																<td>{item?.data?.candidateMore.role}</td>
																<td>
																	{/* <ThumbDownAltOutlinedIcon
																			style={{
																				color: "#ED642A",
																				cursor: "pointer",
																				fontSize: "1.1em",
																			}}
																		/>
																		<ThumbUpAltOutlinedIcon
																			style={{
																				cursor: "pointer",
																				color: "#1396ed",
																				fontSize: "1.1em",
																			}}
																		/> */}
																	{item?.data?.candidateMore.references &&
																	item?.data?.candidateMore?.references.length >
																		0
																		? ArchivehandleRefereeIcon(item)
																		: 'Awaiting Action'}
																</td>

																<td>
																	<a
																		href='#!'
																		onClick={e => {
																			e.preventDefault();
																			e.stopPropagation();
																			handleUnarchive(item.uuid);
																		}}
																	>
																		<i className='fa fa-file-archive-o' />
																		&nbsp;&nbsp;Unarchive
																	</a>
																</td>
															</tr>
														))}
													</tbody>
												) : (
													<tbody>
														{filtered?.map((item, index) => (
															<tr
																key={index}
																onClick={() =>
																	navigate(
																		`/home/candidate/summary/${item.uuid}`,
																		{
																			state: selectedTab,
																		}
																	)
																}
																className='request-row'
															>
																<td className='text-center'>{index + 1}</td>
																<td>
																	{dayjs(item.created_at)
																		.toDate()
																		.toString()
																		.slice(0, 16)}
																</td>
																<td>{item.recruiterName}</td>
																<td>
																	<Link
																		to={`/home/candidate/summary/${item.uuid}`}
																	>
																		{item?.candidateInfo?.firstName}{' '}
																		{item?.candidateInfo?.lastName}
																	</Link>
																</td>

																<td>{item?.candidateInfo?.email}</td>

																<td>{item.role}</td>

																<td>
																	{item.references &&
																	item?.references.length > 0
																		? handleRefereeIcon(
																				item.referenceDetails
																				//	localState.candidateHash
																			)
																		: 'Awaiting Action'}
																</td>

																<td style={{ whiteSpace: 'nowrap' }}>
																	<OptionMenu
																		options={actions.slice()}
																		handleMenuSelect={menuOption => {
																			switch (menuOption) {
																				case 'Archive': {
																					handleArchive(item.uuid);
																					break;
																				}
																				case 'Copy Application Link': {
																					window.navigator.clipboard.writeText(
																						item.application_link
																					);
																					toast.success(
																						'Copied application link successfully!',
																						{
																							autoClose: 500,
																							hideProgressBar: true,
																							theme: 'dark',
																						}
																					);
																					break;
																				}
																			}
																		}}
																	/>
																</td>
															</tr>
														))}
													</tbody>
												)}
											</table>
										</div>
									</React.Fragment>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			{!isFetching && !searchResults && (
				<button
					ref={ref}
					className='opacity-0'
				></button>
			)}
		</>
	);
}

const actions = ['Archive', 'Copy Application Link'] as const;

export default Requests;
