import { useEffect, useState } from 'react';
import stateJSON from '../../assets/json/state.json';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CustomToolTip } from '../../components/CustomToolTip';
import {
	DeleteClient,
	EditClient,
	GetClientChecks,
	UpdateClientChecks,
} from '../../apis';
import { Button, Tab, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { useImmer } from 'use-immer';
import TabMenu from '../../components/TabMenu';
import CustomBranding from '../../components/CustomBranding/CustomBranding';
import EmailSettings from '../../components/EmailSettings/EmailSettings';
import { GoBackLink, LoadingBackdrop } from '../../components';
import { LoadingButton } from '@mui/lab';
import { useSuperAdminContext } from '../../contexts/SuperAdminContext';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Autocomplete, Chip, Switch } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import Pricing from './Pricing';

const isValidTab = (x: string): x is EditTabs => {
	return tabNames.includes(x as EditTabs);
};

const SPECIAL_REGEX_ORG = /[`~!@#$%^&()+=_}{"':?><|/;|\]\\"["]/;
const tabNames = [
	'EDIT CLIENT',
	'EMAIL SETTINGS',
	'CUSTOM BRANDING',
	'PRICING',
] as const;
type EditTabs = (typeof tabNames)[number];

const SuperAdminEditClientInfo = () => {
	const location = useLocation();
	const [initialLoading, setInitialLoading] = useImmer(true);
	const { clients, fetchClients, fetchAllUsers, AllChecks } =
		useSuperAdminContext();
	const [tab, setTab] = useImmer<EditTabs>(() => {
		return location?.state?.tab || 'EDIT CLIENT';
	});
	const handleTabChange = (newTab: string) => {
		if (isValidTab(newTab)) {
			setTab(newTab);
		}
	};
	const [countryList, setCountryList] = useState<any>([]);
	const [stateList, setStateList] = useState([]);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [State, setState] = useState('');
	const [Country, setCountry] = useState('');
	const [Organization, setOrganization] = useState('');
	const [NoOfStaff, setNoOfStaff] = useState('');
	const [isActive, setActive] = useState(true);
	const [uuid, setUuid] = useState('');
	const [isLeadGenerationJob, setLeadGenerationJob] = useState(true);
	const [isLeadGenerationCandidate, setLeadGenerationCandidate] =
		useState(true);
	const [isSMSAllow, setSMSAllow] = useState(false);
	const [isSelectedChecks, setIsSelectedChecks] = useState(false);
	const [selectedChecks, setSelectedChecks] = useState([]);
	const [allowedChecksUUID, setAllowedChecksUUID] = useState('');

	useEffect(() => {
		setCountryList(() => {
			const usaCanada: string[] = [];
			const countries = stateJSON.filter((val: any) => {
				if (val.country === 'United States' || val.country === 'Canada') {
					usaCanada.push(val);
					return false;
				}
				return true;
			});
			return [...usaCanada, ...countries];
		});
		(async function () {
			if (clients.length === 0) {
				await fetchClients();
			}
			setInitialLoading(false);
			let path = window.location.pathname;
			var pathUuid = path.substring(path.lastIndexOf('/') + 1, path.length);
			let client = clients?.filter((val: any) => val.uuid === pathUuid);
			if (client && client[0]) {
				setCountry(client[0]?.country);
				setState(client[0]?.state);
				setActive(client[0]?.is_active);
				setLeadGenerationJob(client[0]?.is_lead_generation_job);
				setLeadGenerationCandidate(client[0]?.is_lead_generation_candidate);
				setNoOfStaff(client[0]?.noOfStaff);
				setOrganization(client[0]?.organization);
				setUuid(client[0]?.uuid);
				setSMSAllow(client[0]?.is_sms_allow);
			}
		})();
		(async function () {
			setInitialLoading(false);
			let path = window.location.pathname;
			var pathUuid = path.substring(path.lastIndexOf('/') + 1, path.length);
			if (isSelectedChecks === false) {
				const resp = await GetClientChecks({
					uuid: pathUuid,
				});
				if (resp.status === 200) {
					const notAllowed = resp.data.results;
					if (notAllowed.length > 0) {
						const allowed = AllChecks.filter((check: any) =>
							notAllowed[0]['checks'].includes(check.uuid)
						);
						setAllowedChecksUUID(notAllowed[0]['uuid']);
						setSelectedChecks(allowed);
						setIsSelectedChecks(true);
					}
				}
			}
		})();
	}, [
		clients,
		fetchClients,
		setInitialLoading,
		selectedChecks,
		setSelectedChecks,
		AllChecks,
		isSelectedChecks,
	]);

	if (initialLoading) return <LoadingBackdrop />;

	const createOrganization = async () => {
		if (Country === '') {
			const x = document.getElementById('countryError');
			x!.style.display = 'block';
			return false;
		}
		if (State === '') {
			const x = document.getElementById('stateError');
			x!.style.display = 'block';
			return false;
		}
		setLoading(true);

		const selectedCheckUuid = selectedChecks.map((check: any) => check.uuid);
		const updateResp = await UpdateClientChecks({
			checks: selectedCheckUuid,
			uuid: allowedChecksUUID,
		});

		if (updateResp.status === 200) {
			toast.success('Checks are updated successfully');
		}
		if (updateResp.status === 400) {
			toast.error('Something went wrong, Checks not Updated');
		}

		const resp = await EditClient({
			country: Country,
			state: State,
			organization: Organization,
			noOfStaff: NoOfStaff,
			is_lead_generation_job: isLeadGenerationJob,
			is_lead_generation_candidate: isLeadGenerationCandidate,
			is_active: isActive,
			uuid: uuid,
			is_sms_allow: isSMSAllow,
		});
		setLoading(false);

		if (resp.status === 200) {
			await fetchClients();
			await fetchAllUsers();
		}
		if (resp.status === 400) {
			const x = document.getElementById('clientCreateError');
			x!.style.display = 'block';
		}
	};

	const renderState = (country: any) => {
		for (let i = 0; i < countryList.length; i++) {
			if (countryList[i].country === country) {
				setStateList(countryList[i].states);
			}
		}
		setState('');
	};

	const activeCheckBox = () => {
		setActive(!isActive);
	};

	const leadGenerationJobCheckBox = () => {
		setLeadGenerationJob(!isLeadGenerationJob);
	};

	const leadGenerationCandidateCheckBox = () => {
		setLeadGenerationCandidate(!isLeadGenerationCandidate);
	};

	const smsAllowCheckBox = () => {
		setSMSAllow(!isSMSAllow);
	};

	const handleDeleteFormSubmit = async () => {
		setLoading(true);

		const resp = await DeleteClient({
			uuid: uuid,
		});
		if (resp.status === 200) {
			toast.success('Email sent - Approve the email to delete the client');
			await fetchClients();
			await fetchAllUsers();
			navigate(-1);
		} else {
			toast.error('Something went wrong, email not sent');
			const x = document.getElementById('clientDeleteError');
			x!.style.display = 'block';
		}
		setLoading(false);
	};

	const handleUserInputChange = (_event: any, newChecks: any) => {
		setSelectedChecks(newChecks);
	};

	return (
		<div className='content'>
			<GoBackLink route='/super-admin/clients' />
			<div className='container-fluid'>
				<div className='mb-4 grid grid-cols-4'>
					<TabMenu
						{...{ tab, handleTabChange, className: 'col-span-4 sm:col-span-3' }}
					>
						<Tab
							label='Edit Client'
							value='EDIT CLIENT'
							wrapped
						/>
						<Tab
							label='Email Settings'
							value='EMAIL SETTINGS'
							wrapped
						/>
						<Tab
							label='Custom Branding'
							value='CUSTOM BRANDING'
							wrapped
						/>
						<Tab
							label='Pricing'
							value='PRICING'
							wrapped
						/>
					</TabMenu>
					{tab === 'EDIT CLIENT' && (
						<Button
							onClick={handleDeleteFormSubmit}
							className='col-span-4 bg-transparent underline sm:col-span-1'
							variant='text'
							disableRipple
							disableElevation
						>
							Delete Client
						</Button>
					)}
				</div>

				{tab === 'EDIT CLIENT' && (
					<div className='row'>
						<div className='col-md-12 lrpad'>
							<div className='card mt_zero pad_zero'>
								<div className='client-box'>
									<div className='row pt1'>
										<div className='col-md-12'>
											<Grid
												container
												spacing={1}
											>
												<Grid
													item
													xs={10}
												>
													<h3 className='text-secondary'>Settings</h3>
												</Grid>
												<Grid
													item
													xs={2}
												>
													<div className='row'>
														<b>Active</b>
														<CustomToolTip
															className=''
															content='Determines if the client account is accessible or not'
														/>
														<div className='lrpad'>
															<Switch
																id='someSwitchOptionDefault'
																name='someSwitchOption001'
																checked={isActive}
																onChange={activeCheckBox}
															/>
														</div>
													</div>
												</Grid>
											</Grid>
										</div>
										<div className='col-md-6'>
											<div className='form-group'>
												<TextField
													id='standard-basic'
													label='Organization'
													variant='standard'
													value={Organization}
													onChange={evt => {
														if (
															SPECIAL_REGEX_ORG.test(evt.target.value) === false
														) {
															setOrganization(evt.target.value);
															const x = document.getElementById('orgError');
															x!.style.display = 'none';
															const y =
																document.getElementById('orgErrorInvalid');
															y!.style.display = 'none';
														} else {
															const x =
																document.getElementById('orgErrorInvalid');
															x!.style.display = 'block';
														}
													}}
													fullWidth
												/>
												<div
													className='notes'
													id='orgError'
													style={{ display: `none` }}
												>
													Organization is required
												</div>
												<div
													className='notes'
													id='orgErrorInvalid'
													style={{ display: `none` }}
												>
													Special characters/numbers not allowed in company name
												</div>
											</div>
										</div>

										<div className='col-md-6'>
											<label className='bmd-label-floating'>
												company Size
												<span className='sup_char'>
													<sup>*</sup>
												</span>
											</label>
											<div className='form-group'>
												<select
													className='form-control select-top'
													value={NoOfStaff}
													onChange={evt => {
														setNoOfStaff(evt.target.value);
														const x = document.getElementById('noOfStaffError');
														x!.style.display = 'none';
													}}
												>
													<option value={NoOfStaff}>{NoOfStaff}</option>
													<option>1-20</option>
													<option>21-100</option>
													<option>101-500</option>
													<option>501-1000</option>
													<option>1001-5000</option>
													<option>5001-10000</option>
													<option>10000+</option>
												</select>
												<div
													className='notes'
													id='noOfStaffError'
													style={{ display: `none` }}
												>
													Please enter the staff number
												</div>
												<span className='fa fa-fw fa-angle-down field_icon eye'></span>
											</div>
										</div>

										<div className='col-md-6'>
											<label className='label-static'>
												Country
												<span className='sup_char'>
													<sup>*</sup>
												</span>
											</label>
											<div className='form-group'>
												<select
													className='form-control select-top'
													id='selectCountry'
													name='selectCountry'
													value={Country}
													onChange={evt => {
														setCountry(evt.target.value);
														renderState(evt.target.value);
														const x = document.getElementById('countryError');
														x!.style.display = 'none';
													}}
												>
													<option value={Country}>{Country}</option>
													{countryList.map((localState: any) =>
														localState.country !== Country ? (
															<option key={localState.country}>
																{localState.country}
															</option>
														) : null
													)}
												</select>
												<span className='fa fa-fw fa-angle-down field_icon eye'></span>
												<div
													className='notes'
													id='countryError'
													style={{ display: `none` }}
												>
													Country is required
												</div>
											</div>
										</div>

										<div className='col-md-6'>
											<label className='label-static'>
												State / Province
												<span className='sup_char'>
													<sup>*</sup>
												</span>
											</label>
											<div className='form-group'>
												<select
													className='form-control select-top'
													value={State}
													onChange={evt => {
														setState(evt.target.value);
														const x = document.getElementById('stateError');
														x!.style.display = 'none';
													}}
												>
													<option value={State}>{State}</option>
													{stateList.map(localState =>
														localState !== State ? (
															<option key={localState}>{localState}</option>
														) : null
													)}
												</select>
												<div
													className='notes'
													id='stateError'
													style={{ display: `none` }}
												>
													State/Province is required
												</div>
												<span className='fa fa-fw fa-angle-down field_icon eye'></span>
											</div>
										</div>

										<div className='col-md-12 pt-2'>
											<Grid
												container
												spacing={1}
											>
												<Grid
													item
													xs={10}
												>
													<h3 className='text-secondary'>Checks</h3>
												</Grid>
												<Grid
													item
													xs={2}
												></Grid>
											</Grid>
										</div>

										<div className='col-md-12 pb-4'>
											<Autocomplete
												multiple
												options={AllChecks}
												getOptionLabel={(option: any) => option?.name}
												value={selectedChecks.map((option: any) => option)}
												isOptionEqualToValue={(option, value) =>
													option?.name === value?.name
												}
												onChange={handleUserInputChange}
												disableCloseOnSelect
												renderInput={params => (
													<TextField
														{...params}
														placeholder='Select Checks'
													/>
												)}
												renderTags={(value, getTagProps) =>
													value.map((option, index) => (
														<Chip
															variant='outlined'
															label={option.name}
															{...getTagProps({ index })}
															deleteIcon={
																<CancelIcon style={{ color: 'white' }} />
															}
															sx={{
																backgroundColor: '#2066DF',
																color: 'white',
																'&:hover': {
																	backgroundColor: 'darkblue',
																},
															}}
														/>
													))
												}
											/>
										</div>

										<div className='col-md-12'>
											<Grid
												container
												spacing={1}
											>
												<Grid
													item
													xs={10}
												>
													<h3 className='text-secondary'>Features</h3>
												</Grid>
											</Grid>
										</div>

										<div className='col-md-12'>
											<Grid
												container
												spacing={4}
											>
												<Grid
													item
													xs={6}
												>
													<h4
														style={{
															color: 'black',
															fontWeight: 'bold',
														}}
													>
														Lead Generation
													</h4>
												</Grid>
												<Grid
													item
													xs={6}
												>
													<h4
														style={{
															color: 'black',
															fontWeight: 'bold',
														}}
													>
														SMS
													</h4>
												</Grid>
											</Grid>
										</div>

										<div className='col-md-12'>
											<Grid
												container
												spacing={4}
											>
												<Grid
													item
													xs={6}
												>
													<Box
														style={{
															backgroundColor: '#ECECEC', // Replace with the desired background color
															padding: '10px',
															border: '2px solid #D4D4D4', // Replace with the desired border color
															borderRadius: '12px', // Replace with the desired border radius
														}}
													>
														<table className='noborder'>
															<tbody>
																<tr>
																	<td className='client-info1'>
																		Looking For Job
																		<CustomToolTip content='Determines if the client account Lead Generation is active or not' />
																	</td>
																	<td className='pl-5'>
																		<span className='material-switch'>
																			<input
																				autoComplete='new-password'
																				id='someSwitchOptionDefault1'
																				name='someSwitchOption002'
																				checked={isLeadGenerationJob}
																				onChange={leadGenerationJobCheckBox}
																				type='checkbox'
																			/>
																			<label
																				htmlFor='someSwitchOptionDefault1'
																				className='label-info'
																			></label>
																		</span>
																	</td>
																</tr>
															</tbody>
														</table>
														<table className='noborder'>
															<tbody>
																<tr>
																	<td className='client-info1'>
																		Looking to Hire
																		<CustomToolTip content='Determines if the client account Lead Generation is active or not' />
																	</td>
																	<td className='pl-5'>
																		<span className='material-switch'>
																			<input
																				autoComplete='new-password'
																				id='someSwitchOptionDefault2'
																				name='someSwitchOption003'
																				checked={isLeadGenerationCandidate}
																				onChange={
																					leadGenerationCandidateCheckBox
																				}
																				type='checkbox'
																			/>
																			<label
																				htmlFor='someSwitchOptionDefault2'
																				className='label-info'
																			></label>
																		</span>
																	</td>
																</tr>
															</tbody>
														</table>
													</Box>
												</Grid>
												<Grid
													item
													xs={6}
												>
													<Box
														style={{
															backgroundColor: '#ECECEC', // Replace with the desired background color
															padding: '10px',
															border: '2px solid #D4D4D4',
															borderRadius: '12px',
														}}
													>
														<table className='noborder'>
															<tbody>
																<tr>
																	<td className='client-info1'>
																		Activate
																		<CustomToolTip content='Determines if the client account SMS is active or not' />
																	</td>
																	<td className='pl-5'>
																		<span className='material-switch'>
																			<input
																				autoComplete='new-password'
																				id='someSwitchOptionDefault4'
																				name='someSwitchOption005'
																				checked={isSMSAllow}
																				onChange={smsAllowCheckBox}
																				type='checkbox'
																			/>
																			<label
																				htmlFor='someSwitchOptionDefault4'
																				className='label-info'
																			></label>
																		</span>
																	</td>
																</tr>
															</tbody>
														</table>
													</Box>
												</Grid>
											</Grid>
										</div>

										<div className='col-md-12'>
											<div className='col-md-12 mt3 pb2 text-center'>
												<LoadingButton
													onClick={createOrganization}
													loading={loading}
													variant='contained'
													color='secondary'
												>
													Save
												</LoadingButton>
												<Link
													to={'/super-admin/clients'}
													className='btn-plain'
												>
													Close
												</Link>
												<div
													className='notes'
													id='clientCreateError'
													style={{ display: `none` }}
												>
													Client Not Created !
												</div>
												<div
													className='notes'
													id='clientDeleteError'
													style={{ display: `none` }}
												>
													Client Not Deleted !
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
				{tab === 'EMAIL SETTINGS' && <EmailSettings />}
				{tab === 'CUSTOM BRANDING' && <CustomBranding />}
				{tab === 'PRICING' && <Pricing />}
			</div>
		</div>
	);
};

export default SuperAdminEditClientInfo;
