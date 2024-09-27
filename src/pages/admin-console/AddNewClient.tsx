import { useCallback, useEffect, useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import stateJSON from '../../assets/json/state.json';
import { useNavigate, Link, useLoaderData } from 'react-router-dom';
import { CustomToolTip } from '../../components/CustomToolTip';
import { PostClientObject } from '../../apis';
import { GoBackLink } from '../../components';
import { toast } from 'react-toastify';
import { useSuperAdminContext } from 'contexts/SuperAdminContext';
import {
	Autocomplete,
	Box,
	Chip,
	Grid,
	Stack,
	TextField,
	Typography,
	Switch,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { Check } from 'apis/super_admin.api';
import { useImmer } from 'use-immer';
import { usePostBillingInformation } from 'pages/user/billing/hooks';
const SPECIAL_REGEX_ORG = /[`~!@#$%^&()+=_}{"':?><|/;|\]\\"["]/;

const SuperAdminAddNewClient = () => {
	const mutation = usePostBillingInformation();
	const { fetchClients } = useSuperAdminContext();
	const allChecks = useLoaderData() as Array<Check>;
	const navigate = useNavigate();

	const [countryList, setCountryList] = useState<
		Array<{
			country: string;
			states: string[];
		}>
	>([]);
	const [stateList, setStateList] = useState<Array<string>>([]);
	const [loading, setLoading] = useState(false);
	const [state, setState] = useState('');
	const [country, setCountry] = useState('');
	const [organization, setOrganization] = useState('');
	const [noOfStaff, setNoOfStaff] = useState('');
	const [isActive, setActive] = useState(true);
	const [isLeadGenerationJob, setLeadGenerationJob] = useState(true);
	const [isLeadGenerationCandidate, setLeadGenerationCandidate] =
		useState(true);
	const [isBackGroundCheck] = useState(true);
	const [checks, setChecks] = useState<Array<Check>>(
		() => allChecks as Array<Check>
	);
	const [allowSMS, setAllowSMS] = useState(true);
	const [email, setEmail] = useImmer('');
	const [address, setAddress] = useImmer('');
	const [city, setCity] = useImmer('');
	const [zip, setZip] = useImmer('');

	const smsAllowCheckBox = useCallback(() => {
		setAllowSMS(!allowSMS);
	}, [allowSMS]);

	const handleUserInputChange = (_event: any, newChecks: any) => {
		setChecks(newChecks);
	};

	useEffect(() => {
		setCountryList(() => {
			const usaCanada: Array<{
				country: string;
				states: string[];
			}> = [];
			const countries = stateJSON.filter(val => {
				if (val.country === 'United States' || val.country === 'Canada') {
					usaCanada.push(val);
					return false;
				}
				return true;
			});
			return [...usaCanada, ...countries];
		});
	}, []);

	const renderState = (country: string) => {
		for (let i = 0; i < countryList.length; i++) {
			if (countryList[i].country === country) {
				setStateList(countryList[i].states);
			}
		}
		setState('');
	};

	const handleSubmit = async () => {
		if (country === '') {
			const x = document.getElementById('countryError')!;
			x.style.display = 'block';
			return false;
		}
		if (state === '') {
			const x = document.getElementById('stateError')!;
			x.style.display = 'block';
			return false;
		}
		setLoading(true);
		const selectedCheckUuid = checks.map((check: any) => check.uuid);
		const resp = await PostClientObject({
			country,
			state,
			organization,
			noOfStaff,
			is_lead_generation_job: isLeadGenerationJob,
			is_lead_generation_candidate: isLeadGenerationCandidate,
			is_active: isActive,
			is_background_check: isBackGroundCheck,
			is_sms_allow: allowSMS,
			checks: selectedCheckUuid,
		});
		if (resp.status === 400) {
			toast.error(resp.statusText ?? 'Error creating client');
			const x = document.getElementById('clientCreateError')!;
			x.style.display = 'block';
		} else if (resp.status === 200) {
			await mutation.mutateAsync({
				account_emails: [email],
				company_name: organization,
				city: city,
				state: state,
				zip_code: zip,
				country: country,
				client_id: resp.data.uuid,
				business_number: '',
				street_address: address,
			});
			toast.success('Client created successfully!');
			await fetchClients();
			navigate(`/super-admin/clients/edit-client-info/${resp.data.uuid}`, {
				replace: true,
				state: { tab: 'PRICING' },
			});
		}
		setLoading(false);
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

	return (
		<div className='content'>
			<GoBackLink route='/super-admin/clients' />
			<div className='container-fluid'>
				<div className='card-plain'>
					<div className='card-body'>
						<div className='row'>
							<div className='col-md-12'>
								<div className='card-plain bb10'>
									<div className='row'>
										<div className='col-md-4'>
											<h3> Adding New Client</h3>
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
							<div className='row absolute right-4 top-4'>
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

							<div className='client-box pt-8'>
								<Typography
									variant='h3'
									color='primary'
								>
									Billing Information
								</Typography>
								<div className='row pt1'>
									<div className='col-md-6'>
										<div className='form-group'>
											<label className='bmd-label-floating'>
												Organization
												<span className='sup_char'>
													<sup>*</sup>
												</span>
											</label>
											<input
												type='text'
												className='form-control'
												value={organization}
												maxLength={100}
												onChange={evt => {
													if (
														SPECIAL_REGEX_ORG.test(evt.target.value) === false
													) {
														setOrganization(evt.target.value);
														const x = document.getElementById('orgError')!;
														x.style.display = 'none';
														const y =
															document.getElementById('orgErrorInvalid')!;
														y.style.display = 'none';
													} else {
														const x =
															document.getElementById('orgErrorInvalid')!;
														x.style.display = 'block';
													}
												}}
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
												value={noOfStaff}
												onChange={evt => {
													setNoOfStaff(evt.target.value);
													const x = document.getElementById('noOfStaffError')!;
													x.style.display = 'none';
												}}
											>
												<option value=''>Select Size</option>
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
												value={country}
												onChange={evt => {
													setCountry(evt.target.value);
													renderState(evt.target.value);
													const x = document.getElementById('countryError')!;
													x.style.display = 'none';
												}}
											>
												<option value=''>Select Country</option>
												{countryList.map(localState => (
													<option key={localState.country}>
														{localState.country}
													</option>
												))}
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
												value={state}
												onChange={evt => {
													setState(evt.target.value);
													const x = document.getElementById('stateError')!;
													x.style.display = 'none';
												}}
											>
												<option value=''>Select State/Province</option>
												{stateList.map(localState => (
													<option key={localState}>{localState}</option>
												))}
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

									<TextField
										variant='standard'
										label='Accounting Email'
										fullWidth
										size='small'
										name='account_emails'
										value={email}
										onChange={e => setEmail(e.currentTarget.value)}
										className='mx-3'
									/>
									<Stack
										direction='row'
										columnGap={4}
										className='col-md-12 my-3'
									>
										<TextField
											variant='standard'
											label='Street Address'
											fullWidth
											size='small'
											name='street_address'
											value={address}
											onChange={e => setAddress(e.currentTarget.value)}
										/>
										<TextField
											variant='standard'
											label='City'
											fullWidth
											size='small'
											name='city'
											value={city}
											onChange={e => setCity(e.currentTarget.value)}
										/>
									</Stack>
									<Stack
										direction='row'
										columnGap={4}
										className='col-md-6'
									>
										<TextField
											variant='standard'
											label='Postal Code/Zip Code'
											size='small'
											fullWidth
											value={zip}
											onChange={e => setZip(e.currentTarget.value)}
										/>
									</Stack>

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
											options={allChecks}
											getOptionLabel={(option: any) => option?.name}
											value={checks.map((option: any) => option)}
											isOptionEqualToValue={(option, value) =>
												option?.name === value?.name
											}
											onChange={handleUserInputChange}
											disableCloseOnSelect
											renderInput={params => (
												<TextField
													{...params}
													placeholder='Select Checks'
													required
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
																			onChange={leadGenerationCandidateCheckBox}
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
																			checked={allowSMS}
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
												onClick={handleSubmit}
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
			</div>
		</div>
	);
};

export default SuperAdminAddNewClient;
