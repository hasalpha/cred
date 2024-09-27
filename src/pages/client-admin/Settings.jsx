import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { API } from '../../Api';
import stateJSON from '../../assets/json/state.json';

function AdminSettings() {
	const [showPass, setShowPass] = useState(false);
	const [token, setToken, deleteToken] = useCookies(['credtoken']);
	const [loginUser, setLoginUser] = useState('');
	const [firstName, setFirstName] = useState(localStorage.getItem('firstName'));
	const [lastName, setLastName] = useState(localStorage.getItem('lastName'));
	const [email, setEmail] = useState(localStorage.getItem('email'));
	const [phoneNumber, setPhone] = useState(localStorage.getItem('phoneNumber'));
	const [address1, setAddress1] = useState(localStorage.getItem('address1'));
	const [address2, setAddress2] = useState(localStorage.getItem('address2'));
	const [city, setCity] = useState(localStorage.getItem('city'));
	const [state, setState] = useState(localStorage.getItem('state'));
	const [country, setCountry] = useState(localStorage.getItem('country'));
	const [postCode, setPostCode] = useState(localStorage.getItem('postCode'));
	const [organizationName, setOrganizationName] = useState(
		localStorage.getItem('organizationName')
	);
	const [organizationCountry, setOrganizationCountry] = useState(
		localStorage.getItem('organizationCountry')
	);
	const [organizationState, setOrganizationState] = useState(
		localStorage.getItem('organizationState')
	);
	const [organizationNoOfStaff, setOrganizationNoOfStaff] = useState(
		localStorage.getItem('organizationNoOfStaff')
	);
	const [newPwd, setNewPwd] = useState('');
	const [confirmPwd, setConfirmPwd] = useState('');
	const [image, setImage] = useState('');
	const [stateList, setStateList] = useState([]);
	const [countryList, setCountryList] = useState([]);

	const EMAIL_REGEX =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const getCookie = name => {
		const cookieArr = document.cookie.split(';');
		for (var i = 0; i < cookieArr.length; i++) {
			const cookiePair = cookieArr[i].split('=');
			if (name === cookiePair[0].trim()) {
				return decodeURIComponent(cookiePair[1]);
			}
		}

		return null;
	};

	const renderState = country => {
		for (let i = 0; i < countryList.length; i++) {
			if (countryList[i].country === country) {
				setStateList(countryList[i].states);
			}
		}
		setState('');
	};

	const signOutClicked = () => {
		API.logout(token['credtoken'])
			.then(resp => {
				if (resp.message === 'success') {
					localStorage.removeItem('creduser');
					localStorage.removeItem('creduser-a');
					deleteToken(['credtoken'], { path: '/' });
				}
			})
			.catch(error => console.error(error));
	};

	useEffect(() => {
		setCountryList(stateJSON);
	}, [token]);
	const handleUpdate = () => {
		if (firstName === '') {
			const x = document.getElementById('firstNameError');
			x.style.display = 'block';
			return false;
		}
		if (lastName === '') {
			const x = document.getElementById('lastNameError');
			x.style.display = 'block';
			return false;
		}
		if (email === '') {
			const x = document.getElementById('emailError');
			x.style.display = 'block';
			return false;
		}
		if (email) {
			if (!email.match(EMAIL_REGEX)) {
				const x = document.getElementById('emailInvalidError');
				x.style.display = 'block';
				return false;
			}
		}
		if (phoneNumber === '') {
			const x = document.getElementById('phoneError');
			x.style.display = 'block';
			return false;
		}
		if (city === '') {
			const x = document.getElementById('cityError');
			x.style.display = 'block';
			return false;
		}
		if (postCode === '') {
			const x = document.getElementById('postCodeError');
			x.style.display = 'block';
			return false;
		}
		if (country === '') {
			const x = document.getElementById('countryError');
			x.style.display = 'block';
			return false;
		}
		if (state === '') {
			const x = document.getElementById('stateError');
			x.style.display = 'block';
			return false;
		}

		API.updateUserData(
			{
				email,
				firstName,
				lastName,
				phoneNumber,
				address1,
				address2,
				city,
				postCode,
				country,
				state,
			},
			`Bearer  ${localStorage.getItem('access')}`
		)
			.then(resp => {
				if (resp.id !== null && resp !== undefined) {
					localStorage.setItem('firstName', resp.firstName);
					localStorage.setItem('lastName', resp.lastName);
					localStorage.setItem('phoneNumber', resp.phoneNumber);
					localStorage.setItem('city', resp.city);
					localStorage.setItem('postCode', resp.postCode);
					localStorage.setItem('country', resp.country);
					localStorage.setItem('state', resp.state);
					localStorage.setItem('address1', resp.address1);
					localStorage.setItem('address2', resp.address2);
					setAddress1(resp.address1);
					const z = document.getElementById('profileUpdSuccess');
					z.style.display = 'block';
				}
			})
			.catch(error => console.error(error));
	};

	const handleUpdatePwd = () => {
		if (newPwd === '') {
			const x = document.getElementById('newPwdError');
			x.style.display = 'block';
			return false;
		}
		if (confirmPwd === '') {
			const x = document.getElementById('confirmPwdError');
			x.style.display = 'block';
			return false;
		}
		if (confirmPwd !== newPwd) {
			const x = document.getElementById('pwdMatchError');
			x.style.display = 'block';
			return false;
		}

		API.updatePassword({ email, password: confirmPwd }, token['access'])
			.then(resp => {
				if (!!resp) {
					const z = document.getElementById('pwdUpdSuccess');
					z.style.display = 'block';
					toast.success('Password updated successfully');
					setNewPwd('');
					setConfirmPwd('');
					setShowPass(false);
				}
			})
			.catch(error => console.error(error));
	};

	function getBase64(file, cb) {
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			cb(reader.result);
		};
		reader.onerror = function (error) {
			console.error('Error: ', error);
		};
	}

	const handleUpdateImg = () => {
		let fi = document.getElementById('cred_ProfileImg');
		let fileName = document.querySelector('#cred_ProfileImg').value;
		let extension = fileName.split('.').pop().toUpperCase();
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
				getBase64(fi.files.item(0), result => {
					profilePicture = result;
					API.updateProfileImg({ email, profilePicture }, token['credtoken'])
						.then(resp => {
							if (resp.message === 'success') {
								window.location.reload();
							}
						})
						.catch(error => console.error(error));
				});
			}
		}
	};

	return (
		<div className='wrapper'>
			<div className='content'>
				<div className='container-fluid'>
					<div className='card-plain'>
						<div className='card-body'>
							<div className='row'>
								<div className='col-md-12'>
									<div className='card-plain bb10'>
										<div className='row'>
											<div className='col-md-6'>
												<h3>Client Settings</h3>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='row pb1'>
						<div className='col info-box-thin'>
							<div className='row'>
								<div className='col'>
									<div className='thumbnail'>
										{image ? (
											<img
												src={image}
												width='60px'
												height='75px'
												alt='User'
											/>
										) : (
											<img
												src='/assets/img/user.png'
												width='60px'
												height='60px'
												alt='User'
											/>
										)}
									</div>

									<div className='user_details'>
										<h4>{organizationName}</h4>
									</div>
								</div>

								<div className='col-12 col-md-6 col-lg-8'>
									<div className='title-sm'>
										Address{' '}
										{/* <a
                        data-toggle="modal"
                        data-target="#addAddress"
                        href="javascript:;"
                      >
                        {" "}
                        (Add New){" "}
                      </a> */}
									</div>
									<p className='details'>
										{organizationState} , {organizationCountry}
										<br />
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminSettings;
