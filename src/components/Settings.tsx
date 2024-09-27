import '../assets/css/customSettings.css';

import PasswordChecklist from 'react-password-checklist';

import { useEffect, useState } from 'react';
import { API } from '../Api';
import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PhoneInput from './PhoneNumberInput';
import { Calculate } from '@mui/icons-material';
import { isValid } from 'zod';
import Contacts from './Contacts';
import PasswordStrengthBar from 'react-password-strength-bar';

const SPECIAL_REGEX_NAME = /[0-9^`~!@#$%^&*()+=\-_}{"':?><|,./;|\]\\\\"["]/;

function Settings() {
	const [token, ,] = useCookies(['credtoken']);
	const [firstName, setFirstName] = useState<string>(
		localStorage.getItem('firstName')
			? (localStorage.getItem('firstName') as string)
			: ''
	);
	const [lastName, setLastName] = useState(
		localStorage.getItem('lastName')
			? (localStorage.getItem('lastName') as string)
			: ''
	);
	const [email, setEmail] = useState(
		localStorage.getItem('email') ? localStorage.getItem('email') : ''
	);
	const [companyName] = useState(
		localStorage.getItem('companyName')
			? localStorage.getItem('companyName')
			: ''
	);

	const [phone, setPhone] = useState<string>(
		localStorage.getItem('phoneNumber')
			? (localStorage.getItem('phoneNumber') as string)
			: ''
	);
	const [, setAddress1] = useState('');
	const [, setAddress2] = useState('');
	const [, setCity] = useState('');
	const [, setState] = useState('');
	const [, setCountry] = useState('');
	const [, setPostCode] = useState('');
	const [newPwd, setNewPwd] = useState<string>('');
	const [confirmPwd, setConfirmPwd] = useState('');
	const [, setImage] = useState('');
	const [showPass1, setShowPass1] = useState(false);
	const [showPass, setShowPass] = useState(false);
	const [isUserInputChanged, setUpdateButton] = useState(false);
	const user_email = localStorage.getItem('email') as string;
	const navigate = useNavigate();

	//NK-EDIT
	// State variables for validation rules
	const [isMinLength, setIsMinLength] = useState<boolean>(false);
	const [isSpecialChar, setIsSpecialChar] = useState<boolean>(false);
	const [isNumber, setIsNumber] = useState<boolean>(false);
	const [isCapital, setIsCapital] = useState<boolean>(false);
	const [isLowercase, setIsLowercase] = useState<boolean>(false);
	const [isMatch, setIsMatch] = useState<boolean>(false);

	const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

	const handlePhoneNumberChange = (value: string) => {
		const currentPhoneNumberLength = value
			?.split?.(' ')
			?.slice?.(1)
			?.join('')?.length;
		if (currentPhoneNumberLength && currentPhoneNumberLength >= 14) return;
		return setPhone(value);
	};

	useEffect(() => {
		if (!Cookies.get('refresh')) navigate('/signin');
	}, [navigate]);

	useEffect(() => {
		async function checkData() {
			try {
				const response1 = await API.updateClientUserData(
					{},
					`Bearer  ${localStorage.getItem('access')}`
				);
				const response2 = await API.updateUserData(
					{},
					`Bearer  ${localStorage.getItem('access')}`
				);
				const firstName = localStorage.getItem('firstName');
				if (response1 !== 'error' && response1?.firstName === firstName) {
					localStorage.setItem('firstName', response1.firstName);
					localStorage.setItem('lastName', response1.lastName);
					localStorage.setItem('phoneNumber', response1.phoneNumber);
					setPhone(response1.phoneNumber);
					setLastName(response1.lastName);
				} else if (
					response2 !== 'error' &&
					response2?.firstName === firstName
				) {
					localStorage.setItem('firstName', response2.firstName);
					localStorage.setItem('lastName', response2.lastName);
					localStorage.setItem('phoneNumber', response2.phoneNumber);
					setPhone(response2.phoneNumber);
					setLastName(response2.lastName);
				} else toast.error('Error fetching user data');
			} catch (e) {
				console.error(e);
			}
		}
		checkData();
	}, []);

	const EMAIL_REGEX =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const handleUpdate = () => {
		if (firstName === '' || firstName.trim().length <= 0) {
			const x = document.getElementById('firstNameError')!;
			x.style.display = 'block';
			return false;
		}
		if (lastName === '' || lastName.trim().length <= 0) {
			const x = document.getElementById('lastNameError')!;
			x.style.display = 'block';
			return false;
		}
		/*  if (email === "") {
				const x = document.getElementById("emailError");
				x.style.display = "block";
				return false;
			}*/
		if (email) {
			if (!email.match(EMAIL_REGEX)) {
				const x = document.getElementById('emailInvalidError');
				x!.style.display = 'block';
				return false;
			}
		}
		if (phone === '' || /[0-9]{4}/.test(phone) === false) {
			const x = document.getElementById('phoneError');
			x!.style.display = 'block';
			return false;
		}

		if (/[0-9]{4}/.test(phone) === true) {
			const x = document.getElementById('phoneError');
			x!.style.display = 'none';
		}

		API.updateClientUserData(
			{
				email,
				firstName,
				lastName,
				phoneNumber: phone,
			},
			`Bearer  ${localStorage.getItem('access')}`
		)
			.then((resp: any) => {
				if (resp !== 'error') {
					localStorage.setItem('firstName', resp.firstName);
					localStorage.setItem('lastName', resp.lastName);
					localStorage.setItem('phoneNumber', resp.phoneNumber);
					setPhone(resp.phoneNumber);
					setLastName(resp.lastName);

					const z = document.getElementById('profileUpdSuccess');
					z!.style.display = 'block';
					const x = document.getElementById('link1');
					x!.style.display = 'none';

					return;
				}
				API.updateUserData(
					{
						email,
						firstName,
						lastName,
						phoneNumber: phone,
					},
					`Bearer  ${localStorage.getItem('access')}`
				)
					.then((resp: any) => {
						if (resp !== 'error') {
							localStorage.setItem('firstName', resp.firstName);
							localStorage.setItem('lastName', resp.lastName);
							localStorage.setItem('phoneNumber', resp.phoneNumber);
							const z = document.getElementById('profileUpdSuccess');
							z!.style.display = 'block';
							const x = document.getElementById('link1');
							x!.style.display = 'none';
						}
					})
					.catch((error: any) => {
						console.log('error msg here', error);
					});
			})
			.catch((error: any) => {
				console.log('error msg here', error);
			});
	};

	const handleProfileCancel = () => {
		(document.querySelector(
			'#profileUpdSuccess'
		) as HTMLElement)!.style.display = 'none';
		const x = document.getElementById('link1');
		x!.style.display = 'none';
		const username = localStorage.getItem('creduser');
		API.getCurrentUserData(username, token['credtoken'])
			.then((data: any) => {
				setFirstName(data[0].firstName);
				setEmail(data[0].Email);
				setLastName(data[0].lastName);
				setPhone(data[0].PhoneNumber);
				setAddress1(data[0].address1);
				setAddress2(data[0].address2);
				setPostCode(data[0].postCode);
				setState(data[0].State);
				setCity(data[0].city);
				setCountry(data[0].country);
				setImage(data[0].profilePicture);
			})
			.catch((error: any) => console.error(error));
	};

	const handleUpdatePwd = async (): Promise<boolean> => {
		try {
			// if (newPwd === '') {
			// 	// const x = document.getElementById('newPwdError');
			// 	// x!.style.display = 'block';
			// 	return false;
			// }
			// if (newPwd.length < 6) {
			// 	// const x1 = document.getElementById('newPwdError1');
			// 	// x1!.style.display = 'block';
			// 	return false;
			// }
			// if (confirmPwd === '') {
			// 	const x = document.getElementById('confirmPwdError');
			// 	// x!.style.display = 'block';
			// 	return false;
			// }
			// if (confirmPwd !== newPwd) {
			// 	// const x = document.getElementById('pwdMatchError');
			// 	// x!.style.display = 'block';
			// 	return false;
			// }

			if (
				!isMinLength ||
				!isSpecialChar ||
				!isNumber ||
				!isCapital ||
				!isLowercase ||
				!isMatch
			) {
				toast.error(
					'Please ensure your password meets the required criteria. This is to ensure the security of your account.'
				);
				return false;
			}

			const resp = await API.updatePassword(
				{ password: confirmPwd },
				`Bearer  ${localStorage.getItem('access')}`
			);
			if (resp === 'Password Updated Successfully') {
				toast.success('Your new password has been updated successfully.');
				// const z = document.getElementById('pwdUpdSuccess');
				// z!.style.display = 'block';
				const x = document.getElementById('link2');
				x!.style.display = 'none';
				return true;
			} else {
				toast.error(
					'Something went wrong on our end. Please try again later or contact support if the issue persists.'
				);
				const z = document.getElementById('pwdUpdSuccess');
				z!.style.display = 'none';
				return false;
			}
		} catch (e) {
			toast.error(
				'Something went wrong on our end. Please try again later or contact support if the issue persists.'
			);
			const z = document.getElementById('pwdUpdSuccess');
			z!.style.display = 'none';
			return false;
		}
	};

	function getBase64(file: any, cb: any) {
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			cb(reader.result);
		};
		reader.onerror = function (error) {
			console.log('Error: ', error);
		};
	}

	const handleUpdateImg = () => {
		let fi = document.getElementById('cred_ProfileImg') as any;
		let fileName = (
			document.querySelector('#cred_ProfileImg')! as HTMLInputElement
		).value;
		let extension = fileName.split('.')!.pop()!.toUpperCase();
		// alert(extension);
		if (extension === 'JPG' || extension === 'PNG' || extension === 'JPEG') {
			if (fi.files.length > 0) {
				let fsize = fi.files.item(0).size;
				let file = Math.round(fsize / 1024);
				// limit image to 1mb
				if (file >= 1024) {
					return false;
				}

				let profilePicture = '';
				getBase64(fi.files.item(0), (result: any) => {
					profilePicture = result;
					API.updateProfileImg({ email, profilePicture }, token['credtoken'])
						.then((resp: any) => {
							if (resp.message === 'success') {
								window.location.reload();
							}
						})
						.catch((error: any) => console.log(error));
				});
			}
		}
	};
	// let profileUpdateCounter = 1;
	useEffect(() => {
		if (isUserInputChanged) {
			(document.querySelector('.btn-primary')! as any).style.visibility =
				'visible';
			(document.querySelector('.btn-primary')! as any).style.opacity = '1';
			setUpdateButton(false);
		}
		setUpdateButton(true);

		//it triggers according to the changes in the user input
		//so enable the button only when there is change in input
		//
		//so the problem with useEffect it runs once after the page loads
		//so let's use this problem
		//setup a counter and execute it next time
		//so the useEffect run multipletimes but this condition only executes once so see the beauty here
		//We can now implement other things now
		//so one thought can I implement a useEffect which directly observes DOM mutuation events
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [firstName, lastName, phone]);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 767);

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<>
			<div className='card-plain'>
				<div className='card-body'>
					<div className='row'>
						<div className='col-md-12'>
							<div className='card-plain bb10'>
								<div className='row'>
									<div className='col-md-6'>
										<h3>Account Settings</h3>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				className='row pb1'
				style={{ display: 'block', margin: 0 }}
			>
				<div className='col info-box-thin accountSettingsSections'>
					<div className='row'>
						<div className='col'>
							<div className='user_details accountSettingsSection-Col'>
								<div>
									<h5>
										{firstName} {lastName}
									</h5>
									<p className='details'>
										{companyName}
										<br />
										{email}
										<br />
										<span className='text-secondary'>{phone}</span>
									</p>
								</div>

								<div
									style={{
										alignContent: 'center',
										flexGrow: '1',
										position: 'relative',
									}}
								>
									<ul
										className='nav nav-pills nav-pills-primary nvpills nvpills-borderless accountSettingsMenu'
										role='tablist'
										id='nvpills-borderless'
									>
										<li
											className='nav-item'
											style={{ width: '120%' }}
										>
											<a
												className='nav-link accountSettingsBtn'
												role='tablist'
												href='#!'
												onClick={() => {
													const cardID = document.getElementById('cardID');
													cardID!.style.display = 'block';

													const y = document.getElementById('link3');
													y!.style.display = 'none';
													const z = document.getElementById('link2');
													z!.style.display = 'none';
													const x = document.getElementById('link1');
													x!.style.display = 'block';
												}}
											>
												Edit Profile
											</a>
										</li>
										<li
											className='nav-item'
											style={{ width: '120%' }}
										>
											<a
												className='nav-link accountSettingsBtn'
												href='#!'
												role='tablist'
												onClick={() => {
													const cardID = document.getElementById('cardID');
													cardID!.style.display = 'block';

													const x = document.getElementById('link1');
													x!.style.display = 'none';
													const y = document.getElementById('link3');
													y!.style.display = 'none';
													const z = document.getElementById('link2');
													z!.style.display = 'block';
													(
														document.querySelector('#profileUpdSuccess') as any
													).style.display = 'none';
													(
														document.querySelector('.new-pwd-input') as any
													).value = null;
													(
														document.querySelector(
															'.confirm-password-visible'
														) as any
													).value = null;
												}}
											>
												Change Password
											</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='row'>
				<div className='col'>
					<div
						id='cardID'
						className='card'
						style={{ display: 'none' }}
					>
						<ul style={{ display: 'none' }}></ul>
						<div className='tab-content tab-space'>
							<div
								className='tab-pane'
								id='link1'
								aria-expanded='true'
							>
								<h5>Personal Details</h5>

								<div className='row'>
									<div className='col-md-3'>
										<div className='form-group bmd-form-group is-filled'>
											<label className='bmd-label-floating'>
												First Name
												<span className='sup_char'>
													<sup>*</sup>
												</span>
											</label>
											<input
												type='text'
												value={firstName}
												onChange={evt => {
													if (!SPECIAL_REGEX_NAME.test(evt.target.value)) {
														setFirstName(evt.target.value);
														const x = document.getElementById('firstNameError');
														x!.style.display = 'none';
														const z =
															document.getElementById('profileUpdSuccess');
														z!.style.display = 'none';
													}
												}}
												className='form-control bmd-form-group is-filled'
												maxLength={30}
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
									<div className='col-md-3'>
										<div className='form-group bmd-form-group is-filled'>
											<label className='bmd-label-floating'>
												Last Name
												<span className='sup_char'>
													<sup>*</sup>
												</span>
											</label>
											<input
												type='text'
												value={lastName}
												onChange={evt => {
													if (!SPECIAL_REGEX_NAME.test(evt.target.value)) {
														setLastName(evt.target.value);
														const x = document.getElementById('lastNameError');
														x!.style.display = 'none';
														const z =
															document.getElementById('profileUpdSuccess');
														z!.style.display = 'none';
													}
												}}
												className='form-control bmd-form-group is-filled'
												maxLength={30}
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
									<div className='col-md-3'>
										<div className='form-group bmd-form-group is-filled'>
											<label className='bmd-label-floating'>
												Email address
												<span className='sup_char'>
													<sup>*</sup>
												</span>
											</label>
											<input
												disabled={true}
												type='email'
												value={user_email}
												onChange={evt => {
													setEmail(evt.target.value);
													const x = document.getElementById('emailError');
													x!.style.display = 'none';
													const y =
														document.getElementById('emailInvalidError');
													y!.style.display = 'none';
													const z =
														document.getElementById('profileUpdSuccess');
													z!.style.display = 'none';
												}}
												className='form-control bmd-form-group is-filled'
												maxLength={100}
											/>
											<div
												className='notes'
												id='emailError'
												style={{ display: `none` }}
											>
												Email is required
											</div>
											<div
												className='notes'
												id='emailInvalidError'
												style={{ display: `none` }}
											>
												Invalid Email
											</div>
										</div>
									</div>
									<div className='col-md-3'>
										<div
											className='form-group bmd-form-group is-filled'
											style={{ marginTop: '12px' }}
										>
											<PhoneInput
												{...{
													phoneNumber: phone,
													handlePhoneNumberChange,
													defaultCountry: 'Canada',
												}}
											/>
											<div
												className='notes'
												id='phoneError'
												style={{ display: `none` }}
											>
												Phone is required
											</div>
										</div>
									</div>
								</div>

								<div className='row'>
									<div className='col-md-12'>
										<div className='box-pad'>
											<a
												href='#!'
												id='hide-info'
												className='btn btn-secondary-outline'
												onClick={() => {
													handleProfileCancel();
													const cardID = document.getElementById('cardID');
													cardID!.style.display = 'none';
												}}
											>
												Cancel
											</a>
											&nbsp;
											<a
												href='#!'
												id='hide-info1'
												className='btn btn-primary col-white'
												onClick={() => {
													let isVaildEP = handleUpdate();

													if (isVaildEP !== false) {
														const cardID = document.getElementById('cardID');
														cardID!.style.display = 'none';
													}
												}}
												// style={{ visibility: 'hidden' }}
											>
												Update
											</a>
										</div>
										<div
											className='notes'
											id='profileUpdSuccess'
											style={{ display: `none` }}
										>
											Update Success
										</div>
									</div>
								</div>
							</div>

							<form>
								<div
									style={{ padding: '10px 0' }}
									className='tab-pane'
									id='link2'
									aria-expanded='false'
								>
									<h5 className='m-0'>Change Password</h5>
									<div className='row'>
										<div className='col changePassFieldSection'>
											<div className={isMobile ? 'col-md-4' : ''}>
												<div className='form-group'>
													<label className='bmd-label-floating'>
														New Password
														<span className='sup_char'>
															<sup>*</sup>
														</span>
													</label>
													<input
														autoComplete='new-password'
														type={showPass1 ? 'text' : 'password'}
														value={newPwd}
														onChange={evt => {
															setNewPwd(evt.target.value);
															const x = document.getElementById('newPwdError');
															x!.style.display = 'none';
															const x1 =
																document.getElementById('newPwdError1');
															x1!.style.display = 'none';
															const z =
																document.getElementById('pwdUpdSuccess');
															z!.style.display = 'none';
															const y =
																document.getElementById('pwdMatchError');
															y!.style.display = 'none';
														}}
														className='form-control new-pwd-input'
													/>
													<span>
														{showPass1 ? (
															<AiOutlineEye
																style={{
																	position: 'absolute',
																	marginTop: '-27px',
																	marginLeft: '90%',
																}}
																onClick={() => setShowPass1(false)}
																size={20}
																color='black'
															/>
														) : (
															<AiOutlineEyeInvisible
																style={{
																	position: 'absolute',
																	marginTop: '-27px',
																	marginLeft: '90%',
																}}
																onClick={() => setShowPass1(true)}
																size={20}
																color='black'
															/>
														)}
													</span>
												</div>
											</div>

											<div className='changePassDesktopView'>
												<PasswordChecklist
													rules={['minLength', 'specialChar', 'number']}
													minLength={6}
													value={newPwd}
													valueAgain={confirmPwd}
													onChange={(isValid, result) => {
														setIsMinLength(!result.includes('minLength'));
														setIsSpecialChar(!result.includes('specialChar'));
														setIsNumber(!result.includes('number'));
													}}
												/>
											</div>
											<PasswordStrengthBar
												className='mt-8 hidden md:block'
												password={newPwd}
											/>
										</div>

										<div className='col changePassFieldSection'>
											{/* Confirm Password */}
											<div className={isMobile ? 'col-md-4' : ''}>
												<div className='form-group'>
													<label className='bmd-label-floating'>
														Confirm Password
														<span className='sup_char'>
															<sup>*</sup>
														</span>
													</label>
													<input
														type='password'
														value={confirmPwd}
														onChange={evt => {
															setConfirmPwd(evt.target.value);
															const x =
																document.getElementById('confirmPwdError');
															x!.style.display = 'none';
															const z =
																document.getElementById('pwdUpdSuccess');
															z!.style.display = 'none';
															const y =
																document.getElementById('pwdMatchError');
															y!.style.display = 'none';
														}}
														className='form-control confirm-password-visible'
													/>
													<span
														onClick={() => {
															showPass === false
																? ((
																		document.querySelector(
																			'.confirm-password-visible'
																		) as any
																	).type = 'text')
																: ((
																		document.querySelector(
																			'.confirm-password-visible'
																		) as any
																	).type = 'password');
														}}
													>
														{showPass ? (
															<AiOutlineEye
																style={{
																	position: 'absolute',
																	marginTop: '-27px',
																	marginLeft: '90%',
																}}
																onClick={() => setShowPass(false)}
																size={20}
																color='black'
															/>
														) : (
															<AiOutlineEyeInvisible
																style={{
																	position: 'absolute',
																	marginTop: '-27px',
																	marginLeft: '90%',
																}}
																onClick={() => setShowPass(true)}
																size={20}
																color='black'
															/>
														)}
													</span>
												</div>
											</div>

											{/* Validation - Only Desktop */}
											<div className='changePassDesktopView'>
												<PasswordChecklist
													rules={['capital', 'lowercase', 'match']}
													minLength={6}
													value={newPwd}
													valueAgain={confirmPwd}
													onChange={(isValid, result) => {
														setIsCapital(!result.includes('capital'));
														setIsLowercase(!result.includes('lowercase'));
														setIsMatch(!result.includes('match'));
													}}
												/>
											</div>
										</div>

										{/* Validation - Only Mobile */}
										<div className='changePassMobileView'>
											<PasswordChecklist
												rules={[
													'minLength',
													'specialChar',
													'number',
													'capital',
													'lowercase',
													'match',
												]}
												minLength={6}
												value={newPwd}
												valueAgain={confirmPwd}
												onChange={(isValid, result) => {
													setIsMinLength(!result.includes('minLength'));
													setIsSpecialChar(!result.includes('specialChar'));
													setIsNumber(!result.includes('number'));
													setIsCapital(!result.includes('capital'));
													setIsLowercase(!result.includes('lowercase'));
													setIsMatch(!result.includes('match'));
												}}
											/>
										</div>

										{/* ACTION BTN  */}
										{/* col-md-4 */}
										<div className='col-md-4'>
											<PasswordStrengthBar
												className='block md:hidden'
												password={newPwd}
											/>
											<div className='box-pad test123123123123'>
												<a
													href='#!'
													id='hide-pass'
													className='btn btn-secondary-outline'
													onClick={() => {
														const cardID = document.getElementById('cardID');
														cardID!.style.display = 'none';

														setNewPwd('');
														setConfirmPwd('');
														const x = document.getElementById('link2')!;
														x.style.display = 'none';

														const a = document.getElementById('newPwdError')!;
														a.style.display = 'none';
														const b = document.getElementById('newPwdError1')!;
														b.style.display = 'none';
														const c =
															document.getElementById('confirmPwdError')!;
														c.style.display = 'none';
														const d = document.getElementById('pwdMatchError')!;
														d.style.display = 'none';

														(document.querySelector(
															'#pwdUpdSuccess'
														) as any)!.style.display = 'none';
													}}
												>
													Cancel
												</a>
												&nbsp;
												<a
													href='#!'
													id='hide-pass1'
													className='btn btn-primary col-white'
													onClick={async (): Promise<void> => {
														let isVaildPass = await handleUpdatePwd();
														if (isVaildPass !== false) {
															setNewPwd('');
															setConfirmPwd('');
															const cardID = document.getElementById('cardID');
															cardID!.style.display = 'none';
														}
													}}
												>
													Update
												</a>
											</div>
										</div>
									</div>
								</div>
							</form>

							<div
								className='tab-pane'
								id='link3'
								aria-expanded='false'
							>
								<div className='row'>
									<div className='col-md-6'>
										<div
											className='fileinput fileinput-new pt1'
											data-provides='fileinput'
										>
											<div>
												<div className='btn btn-upload btn-file w100'>
													<input
														className='text-primary'
														type='file'
														id='cred_ProfileImg'
														name='...'
													/>
												</div>
												<br />
												<div className='byline1'>
													Image size should be below <span>1MB</span>.
													Acceptable image formats are{' '}
													<span>.jpg and .png.</span>
												</div>
											</div>
										</div>
									</div>

									<div className='col-md-4'>
										<div className='box-pad'>
											<a
												href='#!'
												id='hide-pass'
												className='btn btn-secondary-outline'
												onClick={() => {
													const x = document.getElementById('link3');
													x!.style.display = 'none';
												}}
											>
												Cancel
											</a>
											&nbsp;
											<a
												href='#!'
												id='hide-pass1'
												className='btn btn-primary col-white'
												onClick={handleUpdateImg}
											>
												Update
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Contacts Section */}
			<Contacts />
		</>
	);
}

export default Settings;
