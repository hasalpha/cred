import { useEffect, useState, useContext, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreateClientUsers } from '../../apis';
import { CustomToolTip } from '../../components/CustomToolTip';
import PhoneInput from '../../components/PhoneNumberInput';
import { SuperAdminContext } from '../../contexts';
import { GoBackLink } from '../../components';
import { toast } from 'react-toastify';
import { Autocomplete, TextField, Switch } from '@mui/material';
const patternNum = /[0-9]/;

export default function SuperAdminAddNewAdmin() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [PhoneNumber, setPhoneNumber] = useState('');
	const [Email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [isActive, setActive] = useState(true);
	const [clientId, setClientId] = useState('');
	const { Allclients, fetchallusers, fetchClients } =
		useContext(SuperAdminContext);
	const EMAIL_REGEX =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const clients = useMemo(
		() =>
			Allclients.reduce((acc, v) => {
				if (acc.find(val => val.label === v.organization)) {
					return acc;
				}
				return [...acc, { label: v.organization, id: v.uuid }];
			}, []),
		[Allclients]
	);
	useEffect(() => {
		fetchClients();
	}, [fetchClients]);

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
			x.style.display = 'block';
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

		const resp = await CreateClientUsers({
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
		if (resp.status === 201) {
			toast.success('Admin created successfully!');
			await fetchallusers();
			navigate('../');
		}
		if (resp.status === 406) {
			const x = document.getElementById('userExistsError');
			x.style.display = 'block';
			toast.error(resp.message ?? 'Error creating client');
		}
		if (resp.status === 400) {
			const x = document.getElementById('adminCreateError');
			x.style.display = 'block';
			toast.error(resp.message ?? 'Error creating client');
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
											<h3> Adding New Admin</h3>
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
											<label className='bmd-label-floating'>
												Enter First Name
												<span className='sup_char'>
													<sup>*</sup>
												</span>
											</label>
											<input
												type='text'
												value={firstName}
												onChange={evt => {
													setFirstName(evt.target.value);
													const x = document.getElementById('firstNameError');
													x.style.display = 'none';
												}}
												className='form-control'
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
											<label className='bmd-label-floating'>
												Enter Last Name
												<span className='sup_char'>
													<sup>*</sup>
												</span>
											</label>
											<input
												type='text'
												value={lastName}
												onChange={evt => {
													setLastName(evt.target.value);
													const x = document.getElementById('lastNameError');
													x.style.display = 'none';
												}}
												className='form-control'
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

									<Autocomplete
										disablePortal
										clearOnBlur
										sx={{ width: '48%', mx: '1%', mt: 1 }}
										options={clients}
										renderInput={params => (
											<TextField
												{...params}
												label='Select client'
												variant='filled'
											/>
										)}
										onChange={(_e, v) => {
											setClientId(v?.id ?? '');
											const x = document.getElementById('clientError');
											x.style.display = 'none';
										}}
									/>
									<div className='form-group'>
										<div
											className='notes'
											id='clientError'
											style={{ display: `none` }}
										>
											Client is required
										</div>
									</div>

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
											<label className='bmd-label-floating'>
												Enter Email address
												<span className='sup_char'>
													<sup>*</sup>
												</span>
											</label>
											<input
												type='email'
												value={Email}
												/* value={username} */
												onChange={evt => {
													setEmail(evt.target.value);
													setUsername(evt.target.value);
													const x = document.getElementById('emailError');
													x.style.display = 'none';
													const y =
														document.getElementById('invalidEmailError');
													y.style.display = 'none';
													const z = document.getElementById('userExistsError');
													z.style.display = 'none';
												}}
												className='form-control'
											/>
											<div
												className='notes'
												id='emailError'
												style={{ display: `none` }}
											>
												Email address is required
											</div>
											<div
												className='notes'
												id='invalidEmailError'
												style={{ display: `none` }}
											>
												Email address is invalid
											</div>
											<div
												className='notes'
												id='userExistsError'
												style={{ display: `none` }}
											>
												User with this email already exists !
											</div>
										</div>
									</div>

									{/* <div className='col-md-6  '>
                    <label className='label-static'>
                      Role
                      <span className='sup_char'>
                        <sup>*</sup>
                      </span>
                    </label>
                    <div className='form-group'>
                      <select className='form-control select-top'>
                        <option>Select admin role</option>
                        <option>Super Admin</option>
                        <option>Super Client Admin</option>
                        <option>Client Admin</option>
                      </select>
                      <span className='fa fa-fw fa-angle-down field_icon eye'></span>
                    </div>
                  </div> */}
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
											</tbody>
										</table>
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
											Admin Not Created !
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
