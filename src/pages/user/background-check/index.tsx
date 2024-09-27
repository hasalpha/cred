import React, { ReactNode, useMemo, useState } from 'react';
import {
	Link,
	Navigate,
	useLoaderData,
	useNavigate,
	useNavigation,
} from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LoadingButton, TabContext, TabList } from '@mui/lab';
import { useImmer, useImmerReducer } from 'use-immer';
import { toast } from 'react-toastify';
import {
	BackgroundCheckRequests,
	FilterActionSchema,
	FilterStateSchema,
	applicationResultTypes,
	applicationStatusTypes,
	filterActionSchema,
	filterStateSchema,
	initialFilterState,
} from './types';
import { useCheckTypes, useFilterMutation } from '../../../hooks';
import { downloadPDF, getDate } from '../../../Common';
import { BackgroundCheckDrawer, OptionMenu } from '../../../components';
import {
	doUpdateBackgroundCheck,
	getBackgroundCheck,
} from '../../../apis/user.api';
import Loading from '../../../components/Loading';
import { getReport } from '../../../apis/user.api';
import clsx from 'clsx';
import { useAuth } from '../../../contexts/AuthContext';
import { useAllCheckTypes } from 'hooks/useGetCheckTypes';
import { SOQUIJSVG } from '../new-request-v2/soquijSVG';
import USCrimeCheckSVG from '../new-request-v2/US-crime-check';
import { CredentialCheckSVG } from '../new-request-v2/credentialCheckSVG';
import CreditCheckSVG from '../new-request-v2/credit-check';
import EnhancedCanadianCrimCheck from '../new-request-v2/enhanced-can-crim-check';
import ReferenceSVG from '../new-request-v2/referenceSVG';
import SocialSVG from '../new-request-v2/social';
import { OneIDSVG } from '../new-request-v2/oneIDSVG';
import DriversAbstractSVG from '../new-request-v2/drivers-abstracts';
import EducationSVG from '../new-request-v2/education';
import Box from '@mui/material/Box/Box';
import Tab from '@mui/material/Tab/Tab';
import TextField from '@mui/material/TextField/TextField';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import Stack from '@mui/material/Stack/Stack';
import Button from '@mui/material/Button/Button';
import Avatar from '@mui/material/Avatar/Avatar';
import Popover from '@mui/material/Popover/Popover';
import IconButton from '@mui/material/IconButton/IconButton';
import { SoftCheckSVG } from '../new-request-v2/softcheck';
import { CyberTruckSVG } from '../new-request-v2/CyberTruckSVG';
import CanCrimCheckSVG from '../new-request-v2/can-crim-check';

export type FromBackgroundCheck = {
	activeBackgroundCheck: true;
};

export type DrawerContent = {
	drawerData: DrawerData;
	email: string;
	date: Date;
	uuid: string;
};

export default function BackgroundCheck() {
	const [anchorEl, setAnchorEl] = useImmer<HTMLButtonElement | null>(null);
	const [content, setContent] = useImmer<ReactNode>(null);
	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const { isBackgroundCheck } = useAuth();
	const navigate = useNavigate();
	const { state: isDownloadingPDF, location } = useNavigation();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [drawerContent, setDrawerContent] = useState<DrawerContent>({
		uuid: '',
		email: '',
		drawerData: [],
		date: new Date(),
	});
	const { data: allCheckTypes, isLoading: isAllCheckTypesLoading } =
		useAllCheckTypes();
	const { data: types, isLoading } = useCheckTypes();
	const typesObj = useMemo(
		() =>
			allCheckTypes?.reduce((acc, v) => ({ ...acc, [v.uuid]: v.name }), {}) ??
			{},
		[allCheckTypes]
	) as { [k: string]: string };
	const [tab, setTab] = useImmer<(typeof tabs)[number]>('ALL');
	const check = useLoaderData() as BackgroundCheckRequests;
	const [checksList, setChecks] = useImmer<BackgroundCheckRequests>(() =>
		check.slice().reverse()
	);

	const scanTypes = useMemo(() => {
		return [
			...new Set(
				check
					.filter(v => v.status !== 'Archive')
					.flatMap(v => v.scan_list.map(val => val.scanType))
			),
		].map(v => ({
			uuid: v,
			name: typesObj[v],
		}));
	}, [check, typesObj]);

	const doFilterMutation = useFilterMutation();
	const doResetMutation = useFilterMutation();
	const [state, dispatch] = useImmerReducer(
		(draftState = initialFilterState, action: FilterActionSchema) => {
			const result = filterActionSchema.safeParse(action);
			if (!result.success) throw new Error(result.error.message);
			const { type, payload } = result.data;
			switch (type) {
				case 'CHANGE_QUERY': {
					draftState.searchQuery = payload;
					break;
				}
				case 'SELECT_SCAN_TYPE': {
					draftState.applicationScanType = payload;
					break;
				}
				case 'SELECT_APPLICATION_STATUS_TYPE': {
					draftState.applicationStatusType = payload;
					break;
				}
				case 'SELECT_APPLICATION_RESULT_TYPE': {
					draftState.applicationResultType = payload;
					break;
				}
				case 'SELECT_IS_ACTIVE': {
					draftState.is_active = payload;
					break;
				}
				case 'SELECT_BACKGROUND_CHECK_STATUS': {
					draftState.backgroundCheckStatus = payload;
					break;
				}
				case 'RESET': {
					draftState = initialFilterState;
					break;
				}
				default:
					throw new Error(`Unknown action type:${type} `);
			}
			return draftState;
		},
		initialFilterState
	);

	const checks = useMemo(() => {
		const sortedChecksList = checksList.toSorted((a, b) => {
			return new Date(a.updated_at) < new Date(b.updated_at) ? 1 : -1;
		});
		if (tab === 'ALL') {
			return sortedChecksList.filter(v => v.status !== 'Archive');
		}
		return sortedChecksList;
	}, [checksList, tab]);

	if (!isBackgroundCheck)
		return (
			<Navigate
				to='/home'
				replace
			/>
		);

	if (
		(isDownloadingPDF === 'loading' &&
			location.pathname.includes('background-check')) ||
		isLoading ||
		isAllCheckTypesLoading
	)
		return <Loading />;

	async function refetchData() {
		const response = (await getBackgroundCheck({})) as {
			results: BackgroundCheckRequests;
		};
		const { results: checks } = response;
		if (tab === 'ALL') return setChecks(checks);
		setChecks(
			checks.filter(val => tab.toLowerCase().includes(val.status.toLowerCase()))
		);
	}

	async function handleTabChange(newTab: (typeof tabs)[number]) {
		setTab(newTab);
		const response = (await getBackgroundCheck({})) as {
			results: BackgroundCheckRequests;
		};
		const { results: checks } = response;
		if (newTab === 'ALL') return setChecks(checks);
		setChecks(
			checks.filter(val =>
				newTab.toLowerCase().includes(val.status.toLowerCase())
			)
		);
	}

	const {
		searchQuery,
		applicationScanType,
		applicationResultType,
		applicationStatusType,
	} = state;

	function handleSearchQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
		return dispatch({ type: 'CHANGE_QUERY', payload: e.target.value });
	}

	function handleEnterPress(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	}

	async function handleSearchSubmit() {
		const result = filterStateSchema.safeParse(state);
		if (!result.success) {
			return toast.error(result.error.message);
		}
		const { data } = result;
		const params = Object.fromEntries(
			Object.entries({
				score: data.applicationResultType,
				search: data.searchQuery,
				is_active: true,
				application_status: data.applicationStatusType,
				status: data.backgroundCheckStatus,
				scan_type: data.applicationScanType,
			}).filter(([_, v]) => v != null)
		);
		const response = await doFilterMutation.mutateAsync(params);
		if (Array.isArray(response)) {
			setChecks(response);
		}
	}

	async function handleReset() {
		dispatch({ type: 'RESET' });
		const response = await doResetMutation.mutateAsync(initialFilterState);
		if (Array.isArray(response)) {
			setChecks(response);
		}
	}

	return (
		<>
			<div className='card-plain'>
				<div className='card-body'>
					<div className='row'>
						<div className='col-md-12'>
							<div className='card-plain bb10'>
								<div className='row justify-content-between'>
									<div className='col-md-4'>
										<h3>Background Check</h3>
									</div>
									<div className='nomobile mr-lg-3'>
										<Link
											className='btn btn-primary'
											to='../add-new-request'
											state={
												{
													activeBackgroundCheck: true,
												} as FromBackgroundCheck
											}
										>
											Screen an applicant
										</Link>
										&nbsp;
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<TabContext value={tab}>
				<Box>
					<TabList
						onChange={(_e, data) => handleTabChange(data)}
						aria-label='background check status tabs'
						textColor='secondary'
						indicatorColor='secondary'
						variant='scrollable'
						scrollButtons
						allowScrollButtonsMobile
					>
						<Tab
							label='All'
							value='ALL'
						/>
						<Tab
							label='Prospects'
							value='PROSPECTS'
							wrapped
						/>
						<Tab
							label='Employment Pending'
							value='EMPLOYMENT PENDING'
							wrapped
						/>
						<Tab
							label='Employees'
							value='EMPLOYEES'
							wrapped
						/>
						<Tab
							label='Archive'
							value='ARCHIVE'
							wrapped
						/>
					</TabList>
				</Box>
			</TabContext>

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
												value={searchQuery ?? ''}
												onChange={handleSearchQueryChange}
												className='form-control'
												placeholder='Search by candidate name, email or report ID'
												onKeyDown={handleEnterPress}
											/>
										</div>
									</form>
								</div>
							</div>
						</div>
						<Box className='grid grid-cols-1 gap-4 px-3 lg:grid-cols-4'>
							<TextField
								select
								label='Search by scan type'
								variant='outlined'
								size='small'
								value={applicationScanType ?? ''}
								onChange={e => {
									dispatch({
										type: 'SELECT_SCAN_TYPE',
										payload: e.target.value,
									});
								}}
							>
								{scanTypes.length
									? scanTypes.map(val => (
											<MenuItem
												key={val.uuid}
												value={val.uuid}
											>
												{val.name}
											</MenuItem>
										))
									: types?.map(v => (
											<MenuItem
												key={v.uuid}
												value={v.uuid}
											>
												{v.name}
											</MenuItem>
										))}
							</TextField>
							<TextField
								select
								label='Search by application status'
								variant='outlined'
								size='small'
								value={applicationStatusType ?? ''}
								onChange={e =>
									dispatch({
										type: 'SELECT_APPLICATION_STATUS_TYPE',
										payload: e.target
											.value as FilterStateSchema['applicationStatusType'],
									})
								}
							>
								{applicationStatusTypes.map(val => (
									<MenuItem
										key={val}
										value={val}
										className='capitalize'
									>
										{val}
									</MenuItem>
								))}
							</TextField>
							<TextField
								select
								label='Search by application result'
								size='small'
								variant='outlined'
								value={applicationResultType ?? ''}
								onChange={e =>
									dispatch({
										type: 'SELECT_APPLICATION_RESULT_TYPE',
										payload: e.target
											.value as FilterStateSchema['applicationResultType'],
									})
								}
							>
								{applicationResultTypes?.map(val => (
									<MenuItem
										key={val}
										value={val}
										className='capitalize'
									>
										{val}
									</MenuItem>
								))}
							</TextField>
							<Box className='grid grid-cols-2 gap-2'>
								<LoadingButton
									variant='contained'
									onClick={handleSearchSubmit}
									loading={doFilterMutation.isPending}
								>
									Search
								</LoadingButton>
								<LoadingButton
									variant='outlined'
									onClick={handleReset}
									loading={doResetMutation.isPending}
									color='secondary'
									disabled={
										JSON.stringify(state) === JSON.stringify(initialFilterState)
									}
								>
									Reset
								</LoadingButton>
							</Box>
						</Box>

						<div
							className='showonmobile mt2 lrpad'
							style={{ display: 'none' }}
						>
							{checks.map(val => (
								<Box
									className='relative mb-3 pt-3'
									key={val.uuid}
									onClick={() => navigate(`./${val.uuid}`)}
								>
									<table className='mobile-data-table table border-0'>
										<tbody style={{ borderLeft: '4px solid #250c77' }}>
											<tr>
												<td className='w30 font-bold'>Updated</td>
												<td>
													{val.webhook_hit_at
														? getDate(val.webhook_hit_at, 'mmddyyyy')
														: getDate(val.created_at, 'mmddyyyy')}
												</td>
											</tr>
											<tr>
												<td className='w30 font-bold'>Email</td>
												<td>{val.email}</td>
											</tr>
											<tr>
												<td className='w30 font-bold'>First Name</td>
												<td>{val.firstName}</td>
											</tr>
											<tr>
												<td className='w30 font-bold'>Last Name</td>
												<td>{val.lastName}</td>
											</tr>
											<tr>
												<td className='w30 font-bold'>Email</td>
												<td>{val.email}</td>
											</tr>
											<tr>
												<td className='w30 font-bold'>Scan Type</td>
												<td className='max-w-4 capitalize'>
													<Stack
														direction='row'
														sx={{
															border: 'none',
															bgcolor: 'transparent',
															'& svg': {
																width: 25,
																height: 25,
															},
														}}
														columnGap={1}
														flexWrap='wrap'
													>
														{val.scan_list.map(scan => (
															<div
																key={scan.uuid}
																title={typesObj[scan.scanType]}
															>
																{getScanTypeIcon(typesObj[scan.scanType])}
															</div>
														))}
													</Stack>
												</td>
											</tr>
											<tr>
												<td className='w30 font-bold'>Report ID</td>
												<td>{val.report_id}</td>
											</tr>
											<tr>
												<td className='w30 font-bold'>Application Status</td>
												<td>{val.application_status}</td>
											</tr>
											<tr>
												<td className='w30 font-bold'>Score</td>
												<td>{val.score}</td>
											</tr>
										</tbody>
									</table>
									<Box className='absolute right-2.5 top-2.5'>
										<OptionMenu
											options={actions.filter(
												v =>
													!(val.firstName === null && v === 'Download PDF') &&
													!v.toLowerCase().includes(tab.toLowerCase())
											)}
											handleMenuSelect={menuOption => {
												switch (menuOption) {
													case 'Move to Archive': {
														doUpdateBackgroundCheck({
															uuid: val.uuid,
															body: { status: 'Archive' },
														}).then(async () => await refetchData());
														break;
													}
													case 'Move to Prospects': {
														doUpdateBackgroundCheck({
															uuid: val.uuid,
															body: { status: 'Prospect' },
														}).then(async () => await refetchData());
														break;
													}
													case 'Move to Employees': {
														doUpdateBackgroundCheck({
															uuid: val.uuid,
															body: { status: 'Employee' },
														}).then(async () => await refetchData());
														break;
													}
													case 'Send Reminder Email': {
														alert('not implemented');
														break;
													}

													case 'Copy Application Link': {
														window.navigator.clipboard.writeText(
															val.application_url
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
													case 'Move to Employment Pending': {
														doUpdateBackgroundCheck({
															uuid: val.uuid,
															body: { status: 'Pending' },
														}).then(async () => await refetchData());
														break;
													}
													case 'Download PDF': {
														getReport(val.uuid).then(pdf => {
															downloadPDF(pdf, val.firstName + val.lastName);
														});
														break;
													}
													default: {
														doUpdateBackgroundCheck({
															uuid: val.uuid,
															body: { status: 'None' },
														}).then(async () => await refetchData());
														break;
													}
												}
											}}
										/>
									</Box>
								</Box>
							))}
						</div>

						<div className='table-responsive hideonmobile'>
							<table className='table-hover table'>
								<thead>
									<tr>
										<th>#</th>
										<th className='w-[100px]'>Updated</th>
										<th>First Name</th>
										<th>Last Name</th>
										<th>Email</th>
										<th>Scan Type</th>
										<th>Report ID</th>
										<th>Application Status</th>
										<th>Score</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{checks.map((val, i) => (
										<tr
											key={val.uuid}
											{...(val?.application_status?.toLowerCase() ===
												'complete' && {
												onClick: () => navigate(`./${val.uuid}`),
												className: 'hover:cursor-pointer',
											})}
										>
											<td>{i + 1}</td>
											<td>
												{val.webhook_hit_at
													? getDate(val.webhook_hit_at, 'mmddyyyy')
													: getDate(val.created_at, 'mmddyyyy')}
											</td>
											<td className='capitalize'>{val.firstName}</td>
											<td className='capitalize'>{val.lastName}</td>
											<td>{val.email}</td>
											<td className='capitalize'>
												<Stack
													direction='row'
													sx={{
														border: 'none',
														bgcolor: 'transparent',
														'& svg': {
															width: 40,
														},
													}}
													columnGap={1}
												>
													{val.scan_list.slice(0, 3).map(scan => (
														<div
															key={scan.uuid}
															title={typesObj[scan.scanType]}
														>
															{getScanTypeIcon(typesObj[scan.scanType])}
														</div>
													))}
													{val.scan_list.length > 3 && (
														<IconButton
															aria-label='expand more'
															disabled={open}
															onClick={e => {
																e.stopPropagation();
																setAnchorEl(e.currentTarget);
																setContent(
																	<Stack
																		direction='row'
																		sx={{
																			border: 'none',
																			bgcolor: 'transparent',
																			'& svg': {
																				width: 50,
																			},
																		}}
																		columnGap={1}
																	>
																		{val.scan_list.slice(3).map(scan => (
																			<div
																				key={scan.uuid}
																				title={typesObj[scan.scanType]}
																			>
																				{getScanTypeIcon(
																					typesObj[scan.scanType]
																				)}
																			</div>
																		))}
																	</Stack>
																);
															}}
														>
															<ExpandMoreIcon />
														</IconButton>
													)}
												</Stack>
												{val.scan_list.length > 3 && (
													<Popover
														component={Stack}
														open={open}
														anchorEl={anchorEl}
														onClose={handleClose}
														anchorOrigin={{
															vertical: 'bottom',
															horizontal: -180,
														}}
														slotProps={{
															paper: {
																sx: {
																	boxShadow: 'none',
																	padding: '10px',
																	border: '.5px solid black',
																},
															},
														}}
													>
														{content}
													</Popover>
												)}
											</td>
											<td>{val.report_id}</td>
											<td className='capitalize'>
												<Button
													fullWidth
													variant='outlined'
													onClick={e => {
														e.stopPropagation();
														setIsDrawerOpen(true);
														setDrawerContent({
															uuid: val.uuid,
															email: val.email,
															drawerData: val.check_executions,
															date: new Date(val.updated_at),
														});
													}}
												>
													{val.application_status}
												</Button>
											</td>
											<td className='text-center'>
												<Avatar
													sx={{ width: 54, height: 54 }}
													className={clsx({
														'bg-green-400': val.score
															.toLowerCase()
															.includes('cleared'),
														'bg-yellow-400':
															val.score.toLowerCase() === 'review',
														'border-2 border-solid border-slate-300 bg-transparent text-slate-300':
															val.score.toLowerCase().includes('none') && true,
													})}
												>
													{val.score.toLowerCase().includes('cleared')
														? 'CLR'
														: val.score === 'Review'
															? 'Rev'
															: 'None'}
												</Avatar>
											</td>
											<td>
												<OptionMenu
													options={[
														...actions.filter(
															v =>
																!(
																	val.firstName === null && v === 'Download PDF'
																) &&
																!v.toLowerCase().includes(tab.toLowerCase())
														),
														counterActions.find(val =>
															val.toLowerCase().includes(tab.toLowerCase())
														)!,
													]}
													handleMenuSelect={menuOption => {
														switch (menuOption) {
															case 'Move to Archive': {
																doUpdateBackgroundCheck({
																	uuid: val.uuid,
																	body: { status: 'Archive' },
																}).then(async () => await refetchData());
																break;
															}
															case 'Move to Prospects': {
																doUpdateBackgroundCheck({
																	uuid: val.uuid,
																	body: { status: 'Prospect' },
																}).then(async () => await refetchData());
																break;
															}
															case 'Move to Employees': {
																doUpdateBackgroundCheck({
																	uuid: val.uuid,
																	body: { status: 'Employees' },
																}).then(async () => await refetchData());
																break;
															}
															case 'Send Reminder Email': {
																alert('not implemented');
																break;
															}

															case 'Copy Application Link': {
																window.navigator.clipboard.writeText(
																	val.application_url
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
															case 'Move to Employment Pending': {
																doUpdateBackgroundCheck({
																	uuid: val.uuid,
																	body: { status: 'Employment Pending' },
																}).then(async () => await refetchData());
																break;
															}
															case 'Download PDF': {
																getReport(val.uuid).then(pdf => {
																	downloadPDF(
																		pdf,
																		val.firstName + val.lastName
																	);
																});
																break;
															}
															default: {
																doUpdateBackgroundCheck({
																	uuid: val.uuid,
																	body: { status: 'None' },
																}).then(async () => await refetchData());
																break;
															}
														}
													}}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<BackgroundCheckDrawer
				isOpen={isDrawerOpen}
				setIsDrawerOpen={setIsDrawerOpen}
				closeDrawer={() => setIsDrawerOpen(false)}
				drawerContent={drawerContent}
			/>
		</>
	);
}

const actions = [
	'Download PDF',
	'Move to Prospects',
	'Move to Employment Pending',
	'Move to Employees',
	'Move to Archive',
	'Copy Application Link',
] as const;

const counterActions = [
	'Remove from Prospects',
	'Remove from Employment Pending',
	'Remove from Employees',
	'Remove from Archive',
] as const;

export const tabs = [
	'ALL',
	'PROSPECTS',
	'EMPLOYMENT PENDING',
	'EMPLOYEES',
	'ARCHIVE',
] as const;

export type WithoutNullableKeys<Type> = {
	[Key in keyof Type]-?: WithoutNullableKeys<NonNullable<Type[Key]>>;
};

const drawerContentData = [
	{
		id: 'check_exec_5yvWwKBOu71tACaqWUbzR6',
		status: 'WAITING_ON_CANDIDATE',
		check_name: 'criminal_record_check',
	},
	{
		id: 'check_exec_7zjpD0SOA59y4dTReWEpLH',
		status: 'WAITING_ON_CANDIDATE',
		check_name: 'identity_verification',
	},
];

export type DrawerData = typeof drawerContentData;

const allScanTypes = [
	'Canadian Criminal Record Check',
	'Enhanced Canadian Criminal Record Check',
	'US Base Criminal',
	'US Single County Criminal',
	'US Unlimited County Criminal',
	'Canadian Softcheck',
	'Canadian Credit check',
	'Canadian Instant Education Verification',
	'Canadian Credential Verification',
	'Canadian Social Media Check',
	'Canadian Driver Abstracts',
	'SOQUIJ',
	'US Instant Education Verification',
	'US Credit check',
	'US Softcheck',
	'US Social Media Check',
	'US Credential Verification',
	'Identity Verification',
	'International Criminal Record Check',
	'Employment Verification',
	'Motor Vehicle Record Check',
] as const;

export type ScanNames = (typeof allScanTypes)[number];

export function getScanTypeContent(scan: string) {
	switch (scan) {
		case 'SOQUIJ': {
			return '';
		}
		case 'US Softcheck': {
			return `Softcheck is a real-time search of over 200,000 databases from 200+ countries. It searches public media sources, sex offender registries, courts, fraud, sanctions and watchlists for adverse media for risk-relevant information such as: criminal history, fraud, affiliations with negative groups, global sanctions, public safety issues, public profile information and more.`;
		}
		case 'US Credit check': {
			return `An inquiry of an applicant's credit file. Reports include tradelines, bankruptcies, public record and collection information, and a credit score.`;
		}
		case 'US Base Criminal': {
			return `The check covers a search for the last seven years of the candidate’s address history as reported by: Social Security Number Trace; Sex Offender Registry (National with Alias); National Criminal Database with Alias; Global Sanctions and Terrorist Watchlist Check with Alias; and Results will reveal matched and accessible felony, misdemeanor, and pending cases for a 7-year period. Applicable access fees will be passed through.`;
		}
		case 'Canadian Softcheck': {
			return 'Softcheck is a real-time search of over 200,000 databases from 200+ countries. It searches public media sources, sex offender registries, courts, fraud, sanctions and watchlists for adverse media for risk-relevant information such as: criminal history, fraud, affiliations with negative groups, global sanctions, public safety issues, public profile information and more.';
		}
		case 'Canadian Credit check': {
			return `An inquiry of an applicant's credit file. Reports include tradelines, bankruptcies, public record and collection information, and a credit score.`;
		}
		case 'Identity Verification': {
			return ``;
		}
		case 'US Social Media Check': {
			return `Credibled compliance first approach to social media screening re- trieves public posts and images across an applicant’s social media profiles, and screens for customizable keywords. *** Not available in Quebec`;
		}
		case 'Employment Verification': {
			return ``;
		}
		case 'US Single County Criminal': {
			return `The check covers a search for the last seven years of the candidate’s address history as reported by: Social Security Number Trace; Sex Offender Registry (National with Alias); National Criminal Database with Alias; Global Sanctions and Terrorist Watchlist Check with Alias; County level criminal record check for provided current address; Federal statewide criminal search for provided current address; and Results will reveal matched and accessible felony, misdemeanor, and pending cases for a 7-year period. Ap- plicable access fees will be passed through.`;
		}
		case 'Canadian Driver Abstracts': {
			return `This check includes discovering traffic citations, vehicular crimes, accidents, driving under the influence convictions and the number of points on the applicant’s driver’s license.`;
		}
		case 'Motor Vehicle Record Check': {
			return `A motor vehicle record report shows a copy of a candidate's driving record which includes license status, traffic citations and accident history through a state's Department of Motor Vehicles (DMV). Additional state fees apply.`;
		}
		case 'US Credential Verification': {
			return `A credential verification validates a candidate's professional credential/license as entered by the candidate. Credibled makes 3-5 sufficient attempts to obtain source data for verification and reports back accordingly.`;
		}
		case 'Canadian Social Media Check': {
			return `Credibled compliance first approach to social media screening retrieves public posts and images across an applicant’s social media profiles, and screens for customizable keywords. *** Not available in Quebec`;
		}
		case 'US Unlimited County Criminal': {
			return `The check covers a search for the last seven years of the candidate’s address history as reported by: Social Security Number Trace; Sex Offender Registry (National with Alias); National Criminal Database with Alias; Global Sanctions and Terrorist Watchlist Check with Alias; County level criminal record check for the last seven years of the candidate’s address history; Federal statewide criminal search for the last seven years of the candidate’s address history; and Results will reveal matched and accessible felony, misdemeanor, and pending cases for a 7-year period. Applicable access fees will be passed through.`;
		}
		case 'Canadian Criminal Record Check': {
			return `A Canadian police information check includes a search of the Canadian Police Information Centre (“CPIC”) database and locally held police information centres for: charges, warrants, peace bonds, prohibition orders, release conditions, probation orders, summary convictions, recent convictions not yet registered in the national repository.`;
		}
		case 'Canadian Credential Verification': {
			return `A credential verification validates a candidate's professional credential/license as entered by the candidate. Credibled makes 3-5 sufficient attempts to obtain source data for verification and reports back accordingly.`;
		}
		case 'US Instant Education Verification': {
			return `An education verification validates the disclosed education of an individual. Typically, the standard is to verify the highest degree, unless otherwise requested. Certn verifies degree(s) received, course of study, and dates of attendance when available. This is verified directly with the institution(s) listed which includes through their electronic repository that holds the records if required. Credibled makes 3-5 sufficient attempts to obtain source data for verification and reports back accordingly. A sufficient attempt can be defined as an attempt which could reasonably lead to a result. Additional fees apply when a school utilizes an outsourced entity to provide data.`;
		}
		case 'Enhanced Canadian Criminal Record Check': {
			return `All of the searches included in the Canadian criminal record check plus a search of the Police Information Portal (PIP) looking for: Criminal convictions for which a pardon has not been granted, and conditional and absolute discharges which have not been removed from the Canadian Police Information Centre system. Probation in- formation, wanted person information, accused person information, peace bonds, judicial orders, warrants, absolute and conditional discharges (If relevant), criminal charges that have been withdrawn, dismissed or stayed of proceedings, any negative contact with police.`;
		}
		case 'Canadian Instant Education Verification': {
			return `An education verification validates the disclosed education of an individual. Typically, the standard is to verify the highest degree, unless otherwise requested. Certn verifies degree(s) received, course of study, and dates of attendance when available. This is verified directly with the institution(s) listed which includes through their electronic repository that holds the records if required. Credibled makes 3-5 sufficient attempts to obtain source data for verification and reports back accordingly. A sufficient attempt can be defined as an attempt which could reasonably lead to a result. Additional fees apply when a school utilizes an outsourced entity to provide data.`;
		}
	}
}

export function getScanTypeIcon(scan: string) {
	switch (scan) {
		case 'SOQUIJ': {
			return <SOQUIJSVG />;
		}
		case 'US Softcheck': {
			return <SoftCheckSVG />;
		}
		case 'US Credit check': {
			return <CreditCheckSVG />;
		}
		case 'US Base Criminal': {
			return <USCrimeCheckSVG />;
		}
		case 'Public Records Check': {
			return <SoftCheckSVG />;
		}
		case 'Canadian Credit check': {
			return <CreditCheckSVG />;
		}
		case 'Identity Verification': {
			return <OneIDSVG />;
		}
		case 'US Social Media Check': {
			return <SocialSVG />;
		}
		case 'Employment Verification': {
			return <ReferenceSVG />;
		}
		case 'US Single County Criminal': {
			return <USCrimeCheckSVG />;
		}
		case 'Canadian Driver Abstracts': {
			return <DriversAbstractSVG />;
		}
		case 'Motor Vehicle Record Check': {
			return <CyberTruckSVG />;
		}
		case 'US Credential Verification': {
			return <CredentialCheckSVG />;
		}
		case 'Canadian Social Media Check': {
			return <SocialSVG />;
		}
		case 'US Unlimited County Criminal': {
			return <USCrimeCheckSVG />;
		}
		case 'Canadian Criminal Record Check': {
			return <CanCrimCheckSVG />;
		}
		case 'Canadian Credential Verification': {
			return <CredentialCheckSVG />;
		}
		case 'US Instant Education Verification': {
			return <EducationSVG />;
		}
		case 'International Criminal Record Check': {
			return <SOQUIJSVG />;
		}
		case 'Enhanced Canadian Criminal Record Check': {
			return <EnhancedCanadianCrimCheck />;
		}
		case 'Canadian Instant Education Verification': {
			return <EducationSVG />;
		}
	}
}
