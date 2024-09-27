import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
	EditClientUsers,
	ForgetPassword,
	GetClientObjectUUID,
} from '../../apis';
import { CustomToolTip } from '../../components/CustomToolTip';
import PhoneInput from '../../components/PhoneNumberInput';
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

export default function EditAdminInfo() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	var patternNum = /[0-9]/;

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
	const { admins, fetchAllUsers, fetchClients } = useContext(SuperAdminContext);
	const EMAIL_REGEX =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const [userPermission, setUserPermission] = React.useState('CLIENT_ADMIN');
	const [clientAdminId, setClientAdminId] = React.useState('');

	const handleChangeUserPermission = event => {
		setUserPermission(event.target.value);
	};

	const handleSave = async e => {
		e.preventDefault();
		let text = firstName + lastName;
		let result = patternNum.test(text);
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
			var x = document.getElementById('lengthError');
			if (x) x.style.display = 'block';
			error = true;
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
			user_type: 'CLIENT_ADMIN',
		});
		if (resp.status === 200) {
			const permissionResp = EditPermissionUser({
				user_id: clientAdminId,
				new_role: userPermission,
			});
			console.log(permissionResp);
			if (resp.status === 200) {
				navigate(-1);
				await fetchAllUsers();
			} else if (resp.status === 400) {
				toast.error(resp.message ?? 'Unable to update account type');
			}
		}
		if (resp.status === 406) {
			const x = document.getElementById('userExistsError');
			x.style.display = 'block';
		}
		if (resp.status === 400) {
			const x = document.getElementById('adminCreateError');
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
			await fetchAllUsers();
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
		let clientAdmins = admins?.filter(val => val.email === userEmail);
		if (clientAdmins[0]) {
			setFirstName(clientAdmins[0]?.firstName);
			setLastName(clientAdmins[0]?.lastName);
			setPhoneNumber(clientAdmins[0]?.phoneNumber);
			setEmail(clientAdmins[0]?.email);
			setId(clientAdmins[0].id);
			setActive(clientAdmins[0]?.is_active);
			setUsername(clientAdmins[0]?.username);
			setClientId(clientAdmins[0]?.clientObjectUUID);
			setOrganization(clientAdmins[0]?.organization);
			setClientAdminId(clientAdmins[0]?.clientAdmin);
			const client = fetchclients(clientAdmins[0].clientObjectUUID);
			client.then(function (result) {
				setIsClientActive(result.data.is_active);
			});
		}
	}, [admins]);

	return (
		<div className='content'>
			<GoBackLink route='/super-admin/admins' />
			<div className='container-fluid'>
				<div className='card-plain'>
					<div className='card-body'>
						<div className='row'>
							<div className='col-md-12'>
								<div className='card-plain bb10'>
									<div className='row'>
										<div className='col-md-4'>
											<h3> Edit Admin</h3>
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
									{/* <div className='col-md-6  '>
                    <label className='label-static'>
                      Client
                      <span className='sup_char'>
                        <sup>*</sup>
                      </span>
                    </label>
                    <div className='form-group'> */}
									{/* <select
                        className='form-control select-top'
                        value={clientId}
                        onChange={evt => {
                          let uuid = clients.find(
                            val => val.organization === evt.target.value
                          )?.uuid;
                          setClientId(uuid);
                          var x = document.getElementById("clientError");
                          x.style.display = "none";
                        }}
                      > */}
									{/* <option selected disabled value={Organization}>{Organization}</option> */}
									{/* {clients.map(val => (
                          val.organization !== Organization?
                          <option
                            key={val.uuid}
                            value={val.organization}
                          >
                            {val.organization}
                          </option>
                          :
                          null
                        ))} */}
									{/* </select> */}

									{/* <span className='fa fa-fw fa-angle-down field_icon eye'></span>
                      <div
                        className='notes'
                        id='clientError'
                        style={{ display: `none` }}
                      >
                        Client is required
                      </div>
                    </div>
                  </div> */}

									<div className='col-md-6'>
										<div
											className='form-group'
											autoComplete='new-password'
										>
											{/* <label className='bmd-label-floating'>
                          Phone#
                          <span className='sup_char'>
                            <sup>*</sup>
                          </span>
                        </label> */}
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

								<div className='row'>
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
											to={'/super-admin/admins'}
											className='btn-plain'
										>
											Close
										</Link>
										<div
											className='notes'
											id='adminCreateError'
											style={{ display: `none` }}
										>
											Admin Not Updated !
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
}
