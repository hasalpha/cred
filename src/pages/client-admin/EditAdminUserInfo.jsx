import { Switch, TextField } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EditAdminUser } from '../../apis';
import { CustomToolTip } from '../../components/CustomToolTip';
import PhoneInput from '../../components/PhoneNumberInput';
import { AdminContext } from '../../contexts';
import { GoBackLink } from '../../components';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { EditPermissionUser } from 'apis/admin.api';
import { toast } from 'react-toastify';

export default function EditAdminUserInfo() {
	const { admins } = useContext(AdminContext);

	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const time = new Date().toString().slice(4, 25);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [PhoneNumber, setPhoneNumber] = useState('');
	const [Email, setEmail] = useState('');
	const [, setUsername] = useState('');
	const [userId, setUserId] = useState('');
	const [isActive, setActive] = useState(true);
	const ownerEmail = useRef(localStorage.getItem('email'));

	const [userPermission, setUserPermission] = React.useState('CLIENT_ADMIN');

	const handleChangeUserPermission = event => {
		setUserPermission(event.target.value);
	};

	const handlePhoneNumberChange = value => {
		const currentPhoneNumberLength = value
			?.split?.(' ')
			?.slice?.(1)
			?.join('')?.length;
		if (currentPhoneNumberLength && currentPhoneNumberLength >= 14) return;
		return setPhoneNumber(value);
	};

	useEffect(() => {
		let path = window.location.pathname;
		var userEmail = path.substring(path.lastIndexOf('/') + 1, path.length);
		let clientUsers = admins?.filter(val => val.email === userEmail);
		if (clientUsers[0]) {
			setFirstName(clientUsers[0].firstName);
			setLastName(clientUsers[0].lastName);
			setPhoneNumber(clientUsers[0].phoneNumber);
			setEmail(clientUsers[0].email);
			setUsername(clientUsers[0].email);
			setUserId(clientUsers[0].id);
			setActive(clientUsers[0].is_active);
		}
	}, [admins]);

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
		if (PhoneNumber === '') {
			const x = document.getElementById('phnNumError');
			x.style.display = 'block';
			error = true;
		}

		if (error) return false;
		setLoading(true);
		const resp = await EditAdminUser({
			firstName: firstName,
			lastName: lastName,
			phoneNumber: PhoneNumber,
			is_active: isActive,
			userId: userId,
		});
		if (resp.status === 200) {
			const permissionResp = EditPermissionUser({
				user_id: resp.data.clientAdmin,
				new_role: userPermission,
			});
			console.log(permissionResp);
			if (resp.status === 200) {
				navigate(-1);
			} else if (resp.status === 400) {
				toast.error(resp.message ?? 'Unable to update account type');
			}
		}
		if (resp.status === 400) {
			if (resp.data.errors?.email) {
				const x = document.getElementById('userExistsError');
				x.style.display = 'block';
			}
		}
		setLoading(false);
	};

	const activeCheckBox = () => {
		setActive(!isActive);
	};

	return (
		<div className='content'>
			<GoBackLink route='/admin/admins' />
			<div className='container-fluid'>
				<div className='card-plain'>
					<div className='card-body'>
						<div className='row'>
							<div className='col-md-12'>
								<div className='card-plain bb10'>
									<div className='row'>
										<div className='col-md-4'>
											<h3>Edit Admin User</h3>
										</div>
										<div className='col-md-8 text-right'>
											<p className='login_info'>
												{' '}
												Logged in as <strong>Admin</strong> on{' '}
												<span className='text-secondary'>{time}</span>
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='row'>
					<div className='col-md-12 lrpad'>
						<form onSubmit={e => handleSave(e)}>
							<div className='card mt_zero'>
								<div className='client-box'>
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
											<div
												className='notes'
												id='numberError'
												style={{ display: `none` }}
											>
												Please dont use number in names
											</div>
											<div
												className='notes'
												id='emptySpaces'
												style={{ display: `none` }}
											>
												Please dont use empty Spaces/blanks in names
											</div>
										</div>
										<div className='col-md-6'>
											<div className='form-group'>
												{/* <label className='bmd-label-floating'>
                          Email Address
                          <span className='sup_char'>
                            <sup>*</sup>
                          </span>
                        </label> */}
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

										<div className='col-md-6'>
											<div className='form-group'>
												{/* <NumberFormat
                          className='form-control'
                          format='(###) ###-####'
                          value={PhoneNumber}
                          onChange={evt => {
                            setPhoneNumber(evt.target.value);
                            const x = document.getElementById("phnNumError");
                            x.style.display = "none";
                          }}
                        /> */}
												<PhoneInput
													{...{
														phoneNumber: PhoneNumber,
														handlePhoneNumberChange,
														defaultCountry: 'Canada',
													}}
												/>
												{/* <TextField
                          id='standard-basic'
                          label='Phone Number'
                          variant='standard'
                          value={PhoneNumber}
                          onChange={evt => {
                            setPhoneNumber(evt.target.value);
                            const x = document.getElementById("phnNumError");
                            x.style.display = "none";
                          }}
                          fullWidth
                        /> */}
												<div
													className='notes'
													id='phnNumError'
													style={{ display: `none` }}
												>
													Phone# is required
												</div>
											</div>
										</div>
									</div>

									{Email !== ownerEmail.current && (
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
										</div>
									)}
									<div className='col-md-12 mt3 pb2 text-center'>
										<button
											disabled={loading}
											type='submit'
											className='btn btn-primary'
										>
											Save
										</button>
										<br />
										<br />
										<Link
											to={'/admin/admins'}
											className='btn-plain'
										>
											Close
										</Link>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
