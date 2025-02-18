import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { CreateUser } from '../../apis';
import { CustomToolTip } from '../../components/CustomToolTip';
import PhoneInput from '../../components/PhoneNumberInput';
import { SPECIAL_REGEX_NAME } from '../../components/JobInformation';
import { Switch } from '@mui/material';

const AddNewUser = () => {
	const [showPass, setShowPass] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const time = new Date().toString().slice(4, 25);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [PhoneNumber, setPhoneNumber] = useState('');
	const [Email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [isActive, setActive] = useState(true);

	const EMAIL_REGEX =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
		const resp = await CreateUser({
			email: Email,
			username: username,
			firstName: firstName,
			lastName: lastName,
			phoneNumber: PhoneNumber,
			is_active: isActive,
		});
		if (resp.status === 201) {
			navigate(-1);
		}
		if (resp.status === 406) {
			const x = document.getElementById('userExistsError');
			x.style.display = 'block';
		}
		setLoading(false);
	};

	const handlePhoneNumberChange = value => {
		const currentPhoneNumberLength = value
			?.split?.(' ')
			?.slice?.(1)
			?.join('')?.length;
		if (currentPhoneNumberLength && currentPhoneNumberLength >= 14) return;
		return setPhoneNumber(value);
	};

	const activeCheckBox = () => {
		setActive(!isActive);
	};
	return (
		<div className='content p-0'>
			<div className='container-fluid p-0'>
				<div className='card-plain p-0'>
					<div className='card-body p-0'>
						<div className='row p-0'>
							<div className='col-md-12'>
								<div className='card-plain bb10'>
									<div className='row'>
										<div className='col-md-4'>
											<h3>Adding New Users</h3>
										</div>
										<div className='col-md-8 text-right'>
											<p className='login_info'>
												{' '}
												Logged in as <strong>Admin</strong> on{' '}
												<span className='text-secondary'>{time?.current}</span>
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='row p-0'>
					<div className='col-md-12 lrpad p-0'>
						<form onSubmit={e => handleSave(e)}>
							<div className='card mt_zero p-0'>
								<div className='client-box'>
									<div className='row pt1 p-0'>
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
													autoComplete='new-password'
													onChange={evt => {
														if (SPECIAL_REGEX_NAME.test(evt.target.value)) {
															const element =
																document.getElementById('firstNameInvalid');
															if (element) element.style.display = 'block';
															return;
														}
														setFirstName(evt.target.value);
														const x = document.getElementById('firstNameError');
														x.style.display = 'none';
														const y =
															document.getElementById('firstNameInvalid');
														y.style.display = 'none';
													}}
													className='form-control'
												/>
												<div
													className='notes'
													id='firstNameInvalid'
													style={{ display: `none` }}
												>
													Please don't use numbers/special characters in names
												</div>
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
											<div
												autoComplete='new-password'
												className='form-group'
											>
												<label className='bmd-label-floating'>
													Enter Last Name
													<span className='sup_char'>
														<sup>*</sup>
													</span>
												</label>
												<input
													type='text'
													value={lastName}
													autoComplete='new-password'
													onChange={evt => {
														if (SPECIAL_REGEX_NAME.test(evt.target.value)) {
															const element =
																document.getElementById('lastNameInvalid');
															if (element) element.style.display = 'block';
															return;
														}
														setLastName(evt.target.value);
														const x = document.getElementById('lastNameError');
														x.style.display = 'none';
														const y =
															document.getElementById('lastNameInvalid');
														y.style.display = 'none';
													}}
													className='form-control'
												/>
												<div
													className='notes'
													id='lastNameInvalid'
													style={{ display: `none` }}
												>
													Please don't use numbers/special characters in names
												</div>
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

										{/* <div className="col-md-6">
                      <label className="label-static">
                        Default user language
                        <span className="sup_char">
                          <sup>*</sup>
                        </span>
                      </label>
                      <div className="form-group">
                        <select className="form-control select-top">
                          <option>Select language</option>
                          <option selected="">English</option>
                          <option>French</option>
                        </select>
                        <span className="fa fa-fw fa-angle-down field_icon eye"></span>
                      </div>
                    </div> */}

										<div className='col-md-6'>
											<div
												autoComplete='new-password'
												className='form-group'
											>
												<label className='bmd-label-floating'>
													Email Address
													<span className='sup_char'>
														<sup>*</sup>
													</span>
												</label>
												<input
													type='email'
													value={Email}
													autoComplete='new-password'
													/* value={username} */
													onChange={evt => {
														setEmail(evt.target.value);
														setUsername(evt.target.value);
														const x = document.getElementById('emailError');
														x.style.display = 'none';
														const y =
															document.getElementById('invalidEmailError');
														y.style.display = 'none';
														const z =
															document.getElementById('userExistsError');
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
												{/* <input
                                    type="text"
                                    value={PhoneNumber}
                                    onChange={(evt) => {
                                      if (/^\d*$/.test(evt.target.value)) {
                                        setPhoneNumber(evt.target.value);
                                      }
                                      const x =
                                        document.getElementById("phnNumError");
                                      x.style.display = "none";
                                    }}
                                    className="form-control"
                                    maxlength="10"
                                  /> */}
												{/* <NumberFormat
                          className='form-control'
                          format='(###) ###-####'
                          value={PhoneNumber}
                          onChange={evt => {
                            setPhoneNumber(evt.target.value);
                            const x = document.getElementById("phnNumError");
                            x.style.display = "none";
                          }}
                          autoComplete='new-password'
                        /> */}
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
										{/* <div className="col-md-6">
                      <label className="label-static">
                        Country
                        <span className="sup_char">
                          <sup>*</sup>
                        </span>
                      </label>
                      <div className="form-group">
                        <select
                          className="form-control select-top"
                          id="selectCountry"
                          name="selectCountry"
                          value={Country}
                          onChange={(evt) => {
                            setCountry(evt.target.value);
                            renderState(evt.target.value);
                            const x = document.getElementById("countryError");
                            x.style.display = "none";
                          }}
                        >
                          <option value="">Select Country</option>
                          {countryList.map((localState) => (
                            <option key={localState.country}>
                              {localState.country}
                            </option>
                          ))}
                        </select>

                        <span className="fa fa-fw fa-angle-down field_icon eye"></span>
                        <div
                          className="notes"
                          id="countryError"
                          style={{ display: `none` }}
                        >
                          Country is required
                        </div>
                      </div>
                    </div> */}
										{/* <div className="col-md-6">
                      <label className="label-static">
                        State/Province
                        <span className="sup_char">
                          <sup>*</sup>
                        </span>
                      </label>
                      <div className="form-group">
                        <select
                          className="form-control select-top"
                          value={State}
                          onChange={(evt) => {
                            setState(evt.target.value);
                            const x = document.getElementById("stateError");
                            x.style.display = "none";
                          }}
                        >
                          <option value="">Select State/Province</option>
                          {stateList.map((localState) => (
                            <option key={localState}>{localState}</option>
                          ))}
                        </select>
                        <span className="fa fa-fw fa-angle-down field_icon eye"></span>
                        <div
                          className="notes"
                          id="stateError"
                          style={{ display: `none` }}
                        >
                          State/Province is required
                        </div>
                      </div>
                    </div> */}
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
												</tbody>
											</table>
										</div>

										{/* <div className="col-md-6">
                                    <table className="noborder  ">
                                    <tbody>
                                        <tr>
                                            <td className="client-info1"><b>Had access</b>                                 
                                                <a id="pop" 
                                                href="#" 
                                                className="help_txt" 
                                                data-toggle="popover" 
                                                data-content="Had access is available for this account">
                                                <i className="material-icons icon_info text-secondary">info</i>
                                                </a></td>
                                            <td>
                                                <div className="material-switch">
                                                    <input id="someSwitchOptionDefault1" name="someSwitchOption002" checked type="checkbox"/>
                                                    <label for="someSwitchOptionDefault1" className="label-info"></label>
                                                </div>		                                 	
                                            </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>  */}

										<div className='col-md-12 mt3 pb2 p-0 text-center'>
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
												to={'/admin/'}
												className='btn-plain'
											>
												Close
											</Link>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddNewUser;
