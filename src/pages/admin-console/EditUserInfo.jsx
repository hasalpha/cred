import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PhoneInput from '../../components/PhoneNumberInput';
import {
	EditClientUsers,
	ForgetPassword,
	GetClientObjectUUID,
} from '../../apis';
import { CustomToolTip } from '../../components/CustomToolTip';
import { SuperAdminContext } from '../../contexts';
import { TextField, Switch } from '@mui/material';
import { GoBackLink } from '../../components';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { EditPermissionUser } from 'apis/admin.api';
import { toast } from 'react-toastify';

const EditUserInfo = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [PhoneNumber, setPhoneNumber] = useState('');
	const [Email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [isActive, setActive] = useState(true);
	const [clientId, setClientId] = useState('');
	const [Organization, setOrganization] = useState('');
	const [Id, setId] = useState('');
	const [isClientActive, setIsClientActive] = useState(true);
	const { fetchallusers, users, fetchClients } = useContext(SuperAdminContext);
	const EMAIL_REGEX =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const [userPermission, setUserPermission] = React.useState('CLIENT_USER');
	const [clientUserId, setClientUserId] = React.useState('');

	const handleChangeUserPermission = event => {
		setUserPermission(event.target.value);
	};

	const handleSave = async e => {
		e.preventDefault();
		let text = firstName + lastName;
		const patternNum = /[0-9]/;
		let patternOthers = /[A-Za-z]/;

		let result = patternNum.test(text);
		let result2 = patternOthers.test(text);
		let error = false;
		if (firstName === '') {
			const x = document.getElementById('firstNameError');
			x.style.display = 'block';
			error = true;
		}
		if (lastName === '') {
			const x = document.getElementById('lastNameError');
			x.style.display = 'block';
			error = true;
		}
		if (firstName.length < 2 && lastName.length < 2 && result === false) {
			const x = document.getElementById('lengthError');
			x.style.display = 'block';
			return false;
		}

		if (result === true) {
			const x = document.getElementById('numberError');
			x.style.display = 'block';
			return false;
		}
		if (result2 === false) {
			const x = document.getElementById('emptySpaces');
			x.style.display = 'block';
			return false;
		}
		if (Email === '') {
			const x = document.getElementById('emailError');
			x.style.display = 'block';
			error = true;
		}
		if (Email) {
			if (!Email.match(EMAIL_REGEX)) {
				const x = document.getElementById('invalidEmailError');
				x.style.display = 'block';
				error = true;
			}
		}
		if (PhoneNumber === '') {
			const x = document.getElementById('phnNumError');
			x.style.display = 'block';
			error = true;
		}
		if (error) return false;
		setLoading(true);
		const resp = await EditClientUsers({
			id: Id,
			email: Email,
			username: username,
			firstName: firstName,
			lastName: lastName,
			phoneNumber: PhoneNumber,
			is_active: isActive,
			clientObjectUUID: clientId
				? clientId
				: 'ff638fd1-ea00-4163-b259-ef12adf48e7e',
			user_type: 'CLIENT_USER',
		});
		if (resp.status === 200) {
			const permissionResp = EditPermissionUser({
				user_id: clientUserId,
				new_role: userPermission,
			});
			console.log(permissionResp);
			if (resp.status === 200) {
				navigate(-1);
				await fetchallusers();
			} else if (resp.status === 400) {
				toast.error(resp.message ?? 'Unable to update account type');
			}
		}
		if (resp.status === 406) {
			const x = document.getElementById('userExistsError');
			x.style.display = 'block';
		}
		if (resp.status === 400) {
			const x = document.getElementById('userCreateError');
			x.style.display = 'block';
		}
		setLoading(false);
	};

	const handleReset = async e => {
		e.preventDefault();
		const resp = await ForgetPassword({
			email: Email,
			redirect_url: `${import.meta.env.VITE_WEB_URL}/reset-password`,
		});
		if (resp.status === 200) {
			await fetchallusers();
			navigate(-1);
		}

		if (resp.status === 400) {
			const x = document.getElementById('adminResetError');
			x.style.display = 'block';
		}
		setLoading(false);
	};

	const handlePhoneNumberChange = value => {
		const currentPhoneNumberLength = value
			?.split?.(' ')
			?.slice?.(1)
			?.join('')?.length;
		if (currentPhoneNumberLength && currentPhoneNumberLength > 10) return;
		return setPhoneNumber(value);
	};

	const activeCheckBox = () => {
		setActive(!isActive);
	};

	useEffect(() => {
		fetchClients();

		const fetchclients = async uuid => {
			const resp = await GetClientObjectUUID(uuid);
			return resp;
		};

		let path = window.location.pathname;
		var userEmail = path.substring(path.lastIndexOf('/') + 1, path.length);
		let clientUsers = users?.filter(val => val.email === userEmail);
		if (clientUsers[0]) {
			setFirstName(clientUsers[0]?.firstName);
			setLastName(clientUsers[0]?.lastName);
			setPhoneNumber(clientUsers[0]?.phoneNumber);
			setEmail(clientUsers[0]?.email);
			setId(clientUsers[0].id);
			setActive(clientUsers[0]?.is_active);
			setUsername(clientUsers[0]?.username);
			setClientId(clientUsers[0]?.clientObjectUUID);
			setOrganization(clientUsers[0]?.organization);
			setClientUserId(clientUsers[0]?.clientUser);
			const client = fetchclients(clientUsers[0].clientObjectUUID);
			client.then(function (result) {
				setIsClientActive(result.data.is_active);
			});
		}
	}, [users]);

	return (
		<div className='content'>
			<GoBackLink route='/super-admin/users' />
			<div className='container-fluid'>
				<div className='card-plain'>
					<div className='card-body'>
						<div className='row'>
							<div className='col-md-12'>
								<div className='card-plain bb10'>
									<div className='row'>
										<div className='col-md-4'>
											<h3> Edit User</h3>
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
									<div className='col-md-12 pb2 text-right'>
										<button
											className='btn btn-primary outline-focus'
											onClick={handleReset}
											disabled={loading}
										>
											Reset Password
										</button>
									</div>
								</div>

								<div className='row pt1'>
									<div className='col-md-6'>
										<div className='form-group'>
											<TextField
												id='standard-basic'
												label='First Name'
												variant='standard'
												value={firstName}
												onChange={evt => {
													setFirstName(evt.target.value);
													const x = document.getElementById('firstNameError');
													x.style.display = 'none';
												}}
												fullWidth
											/>
											<div
												className='notes'
												id='firstNameError'
												style={{ display: `none` }}
											>
												First Name is required
											</div>
										</div>
									</div>

									<div className='col-md-6'>
										<div className='form-group'>
											<TextField
												id='standard-basic'
												label='Last Name'
												variant='standard'
												value={lastName}
												onChange={evt => {
													setLastName(evt.target.value);
													const x = document.getElementById('lastNameError');
													x.style.display = 'none';
												}}
												fullWidth
											/>
											<div
												className='notes'
												id='lastNameError'
												style={{ display: `none` }}
											>
												Last Name is required
											</div>
										</div>
									</div>

									<div className='col-md-6'>
										<div className='form-group'>
											<TextField
												disabled
												id='standard-basic'
												label='Client'
												variant='standard'
												value={Organization}
												fullWidth
											/>
										</div>
									</div>

									<div className='col-md-6'>
										<div
											className='form-group'
											autoComplete='new-password'
										>
											<PhoneInput
												{...{
													phoneNumber: PhoneNumber,
													handlePhoneNumberChange,
													defaultCountry: 'Canada',
												}}
											/>
											<div
												className='notes'
												id='phnNumError'
												style={{ display: `none` }}
											>
												Phone# is required
											</div>
										</div>
									</div>

									<div className='col-md-6'>
										<div className='form-group'>
											<TextField
												disabled
												id='standard-basic'
												label='Email Address'
												variant='standard'
												value={Email}
												fullWidth
											/>
										</div>
									</div>
								</div>

								<div className='row pt1'>
									<div className='col-md-6'>
										<table className='noborder'>
											<tbody>
												<tr>
													<td className='client-info1'>
														<b>Active</b>
														<CustomToolTip content='Determines if the client account is accessible or not' />
													</td>
													<td>
														<Switch
															id='someSwitchOptionDefault'
															name='someSwitchOption001'
															checked={isActive}
															onChange={activeCheckBox}
														/>
													</td>
												</tr>
												{!isClientActive && (
													<tr>
														{' '}
														<span className='notes'> Client is InActive</span>
													</tr>
												)}
											</tbody>
										</table>
									</div>

									<div className='col-md-6'>
										<Box sx={{ minWidth: 120 }}>
											<FormControl fullWidth>
												<InputLabel id='demo-simple-select-label'>
													Account Type
												</InputLabel>
												<Select
													labelId='demo-simple-select-label'
													id='demo-simple-select'
													value={userPermission}
													label='Account Type'
													onChange={handleChangeUserPermission}
												>
													<MenuItem value={'CLIENT_ADMIN'}>Admin</MenuItem>
													<MenuItem value={'CLIENT_USER'}>User</MenuItem>
												</Select>
											</FormControl>
										</Box>
									</div>

									<div className='col-md-12 mt3 pb2 text-center'>
										<button
											className='btn btn-primary mt2 outline-focus'
											onClick={handleSave}
											disabled={loading}
										>
											Save
										</button>
										<Link
											to={'/super-admin/users'}
											className='btn-plain'
										>
											Close
										</Link>
										<div
											className='notes'
											id='userCreateError'
											style={{ display: `none` }}
										>
											User Not Created !
										</div>
										<div
											className='notes'
											id='adminResetError'
											style={{ display: `none` }}
										>
											Reset Password Not Send !
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

export default EditUserInfo;
