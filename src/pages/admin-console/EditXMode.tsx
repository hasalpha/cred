import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EditFlag } from '../../apis';
import { TextField, Autocomplete, Box, Chip } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { GoBackLink } from '../../components';
import { toast } from 'react-toastify';
import { Client, useSuperAdminContext } from 'contexts/SuperAdminContext';

export default function SuperAdminEditXMode() {
	const { flags, fetchFlags, clients, users, admins } = useSuperAdminContext();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState('');
	const [permissions, setPermissions] = useState('');
	const [userList, setUserList] = useState([{}]);
	const [organizationList, setOrganizationList] = useState<Array<Client>>([]);
	const [allUserList, setAllUserList] = useState([{}]);
	const [note, setNote] = useState('');
	const [currFlagId, setCurrFlagId] = useState('');

	useEffect(() => {
		const usersList = [...users, ...admins];
		setAllUserList(usersList);

		let path = window.location.pathname;
		var pathUuid = path.substring(path.lastIndexOf('/') + 1, path.length);
		setCurrFlagId(pathUuid);
		let flag = flags.filter((val: any) => val.uuid === pathUuid);
		if (flag && flag.length > 0) {
			setName(flag[0].name);
			setNote(flag[0].note);
			setPermissions(
				flag[0]?.everyone === false
					? 'No One'
					: flag[0]?.everyone === true
						? 'EveryOne'
						: 'User Specific'
			);
			let userList = flag[0].users;
			let userObjList = userList.map((userid: any) =>
				usersList?.find((val: any) =>
					val?.clientAdmin ? val?.clientAdmin : val?.clientUser === userid
				)
			);
			setUserList(userObjList);
			const orgList = flag[0].companies;
			const orgObjList = orgList.flatMap(v => {
				const organization = clients.find(client => client.uuid === v);
				if (!organization) {
					return [];
				}
				return organization;
			});
			setOrganizationList(orgObjList);
		}
	}, [admins, clients, flags, users]);

	const editFlag = async () => {
		setLoading(true);
		let everyone;
		if (permissions === 'No One') {
			everyone = false;
		} else if (permissions === 'EveryOne') {
			everyone = true;
		} else if (permissions === 'User Specific') {
			everyone = null;
		}

		const users = userList.map((user: any) =>
			user?.clientAdmin
				? user?.clientAdmin?.toString()
				: user.clientUser.toString()
		);
		const companies = organizationList.map((org: any) => org?.uuid);

		const resp = await EditFlag({
			uuid: currFlagId,
			name: name,
			note: note,
			everyone: everyone,
			users: users,
			companies: companies,
		});
		if (resp.status === 200) {
			await fetchFlags();
			navigate(-1);
			toast.success('Flag Changed successfully');
		}
		if (resp.status === 400) {
			toast.success('Something went wrong!');
		}
		setLoading(false);
	};

	const handleOrgInputChange = (
		_event: React.SyntheticEvent<Element, Event>,
		newValuesArray: string[]
	) => {
		const newOrganizationList = newValuesArray.map(
			v => clients.find(val => val.organization === v)!
		);
		return setOrganizationList(newOrganizationList);
	};

	const handleUserInputChange = (_event: any, newUser: any) => {
		setUserList(newUser);
	};

	return (
		<div className='content'>
			<GoBackLink route='/super-admin/xmode' />
			<div className='container-fluid'>
				<div className='card-plain'>
					<div className='card-body'>
						<div className='row'>
							<div className='col-md-12'>
								<div className='card-plain bb10'>
									<div className='row'>
										<div className='col-md-4'>
											<h3> Edit X-Mode</h3>
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
							<div className='client-box'>
								<div className='row pt1'>
									<div className='col-md-6'>
										<div className='form-group'>
											<TextField
												id='standard-basic'
												label='Feature Name'
												variant='standard'
												value={name}
												fullWidth
												disabled
											/>
										</div>
									</div>

									<div className='col-md-6'>
										<label className='bmd-label-floating'>
											Permission
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<div className='form-group'>
											<select
												className='form-control select-top'
												value={permissions}
												onChange={evt => {
													setPermissions(evt.target.value);
												}}
											>
												<option value='User Specific'>User Specific</option>
												<option value='EveryOne'>EveryOne</option>
												<option value='No One'>No One</option>
											</select>
											<span className='fa fa-fw fa-angle-down field_icon eye'></span>
										</div>
									</div>
								</div>
								<div className='row pt1'>
									<div className='col-md-12'>
										<label className='bmd-label-floating'>Note</label>
										<TextField
											placeholder='Add the Notes...'
											multiline
											value={note}
											minRows={2}
											maxRows={4}
											fullWidth
											onChange={evt => {
												setNote(evt.target.value);
											}}
										/>
									</div>
								</div>
								<div className='row pt1'>
									<div className='col-md-12'>
										<h5>User Specific</h5>
									</div>
								</div>
								<div className='row pt1'>
									<Box
										className='col-md-6'
										display='flex'
										justifyContent='space-between'
										alignItems='center'
									>
										<label className='bmd-label-floating'>Users</label>
										<span>{userList.length} user selected</span>
									</Box>

									<Box
										className='col-md-6'
										display='flex'
										justifyContent='space-between'
										alignItems='center'
									>
										<label className='bmd-label-floating'>Clients</label>
										<span>{organizationList.length} client selected</span>
									</Box>
								</div>

								<div className='row pt1'>
									<div className='col-md-6'>
										<Autocomplete
											multiple
											options={allUserList}
											getOptionLabel={(option: any) => option?.email}
											value={userList.map((option: any) => option)}
											isOptionEqualToValue={(option, value) =>
												option?.email === value?.email
											}
											onChange={handleUserInputChange}
											disableCloseOnSelect
											renderInput={params => (
												<TextField
													{...params}
													placeholder='Select Users'
												/>
											)}
											renderTags={(value, getTagProps) =>
												value.map((option, index) => (
													<Chip
														variant='outlined'
														label={option?.email}
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
									<div className='col-md-6'>
										<Autocomplete
											multiple
											options={[...new Set(clients.map(v => v.organization))]}
											value={organizationList.map(v => v.organization)}
											disableCloseOnSelect
											renderInput={params => (
												<TextField
													{...params}
													placeholder='Select Clients'
												/>
											)}
											renderTags={(value, getTagProps) =>
												value.map((option, index) => (
													<Chip
														variant='outlined'
														label={option}
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
											onChange={handleOrgInputChange}
										/>
									</div>
								</div>

								<div className='col-md-12'>
									<div className='col-md-12 mt3 pb2 text-center'>
										<button
											className='btn btn-primary mt2 outline-focus'
											onClick={editFlag}
											disabled={loading}
										>
											Save
										</button>
										<Link
											to={'/super-admin/xmode'}
											className='btn-plain'
										>
											Close
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
