import Cookies from 'js-cookie';
import { getGeoInfo } from '../Common';
import { Api } from './index';
import { credibledQueryClient } from '..';
import { create } from 'zustand';

type ApiError = any;

export const useFlagStore = create<{
	flags_allowed: Array<string>;
}>(() => ({ flags_allowed: [] }));

const Login = async (body: any) => {
	delete Api.defaults.headers.common['Authorization'];
	const result = await Api.post('auth/login/user/', { ...body })
		.then(response => {
			useFlagStore.setState({ flags_allowed: response.data.flags_allowed });
			return response;
		})
		.catch(e => {
			return e.response;
		});
	return result;
};

const LoginAdmin = async (body: any) => {
	delete Api.defaults.headers.common['Authorization'];
	const result = await Api.post('auth/login/admin/', { ...body })
		.then(response => {
			useFlagStore.setState({ flags_allowed: response.data.flags_allowed });
			localStorage.setItem('access', response.data.tokens.access);
			localStorage.setItem('userType', response.data.type);
			Cookies.set('organizationUUID', response.data.orgUuid);
			return response;
		})
		.catch(e => {
			return e.response;
		});
	if (localStorage.getItem('access'))
		Api.defaults.headers.common['Authorization'] =
			`Bearer  ${localStorage.getItem('access')}`;
	else return result;
	if (localStorage.getItem('userType') !== 'SuperAdmin') {
		await Api.get('auth/self-user')
			.then(response => {
				localStorage.setItem('address1', response.data.address1);
				localStorage.setItem('phoneNumber', response.data.phoneNumber);
				localStorage.setItem('address2', response.data.address2);
				localStorage.setItem('firstName', response.data.firstName);
				localStorage.setItem('id', response.data.id);
				localStorage.setItem('postcode', response.data.postcode);
				localStorage.setItem('city', response.data.city);
				localStorage.setItem('lastName', response.data.lastName);
				localStorage.setItem('phoneCode', response.data.phoneCode);
				localStorage.setItem('loginTime', new Date().toString().slice(4, 25));

				localStorage.setItem(
					'organizationName',
					response.data.oragnization.organization
				);
				localStorage.setItem(
					'organizationCountry',
					response.data.oragnization.country
				);
				localStorage.setItem(
					'organizationState',
					response.data.oragnization.state
				);
				localStorage.setItem(
					'organizationNoOfStaff',
					response.data.oragnization.noOfStaff
				);

				getGeoInfo();
				return response;
			})
			.catch(e => {
				return e.response;
			});
	}
	return result;
};

const Register = async (body: any) => {
	const result = await Api.post('auth/register/', body)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});
	return result;
};

const RegisterClient = async (body: any) => {
	const result = await Api.post('auth/register/admin/', body)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});
	return result;
};

const RefreshToken = async () => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const result = await Api.post('auth/token/refresh/', {
		refresh: Cookies.get('refresh'),
	})
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});
	return result;
};

const Logout = async () => {
	Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get(
		'access'
	)}`;
	const result = await Api.post('auth/logout/', {
		refresh: Cookies.get('refresh'),
	})
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});

	for (let k of Object.keys(Cookies.get())) {
		Cookies.remove(k);
	}

	delete Api.defaults.headers.common['Authorization'];
	delete Api.defaults.headers['Authorization'];
	credibledQueryClient.removeQueries();
	credibledQueryClient.invalidateQueries();
	return result;
};

const ForgetPassword = async (body: any) => {
	const result = await Api.post('/auth/request-reset-email/', body)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});
	return result;
};

const CheckEmail = async (email: string) => {
	const result = await Api.get(`/auth/check-email/${email}`)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});
	return result;
};

const PasswordReset = async (body: any) => {
	const result = await Api.patch('/auth/password-reset-complete', body)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});
	return result;
};

const VerifyEmail = async (token: string) => {
	const result = await Api.get(`/auth/verify-email/?token=${token}`)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});
	return result;
};

const ReverifyEmail = async (email: string) => {
	const result = await Api.get(`/auth/reVerification/${email}`)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});
	return result;
};

const getUrl = async (UUID: string) => {
	try {
		const { data } = await Api.get(`/auth/getUrl/${UUID}`);
		return data;
	} catch (e) {
		return (e as any).response;
	}
};

const deleteClientObject = async ({
	uuid,
	params,
}: {
	uuid: string;
	params: URLSearchParams;
}) => {
	return await Api.get(`/auth/delete-client-object/approve/${uuid}/`, {
		params,
	});
};

// Contacts.tsx API Calls...
const contactsGetAPI = async () => {
	try {
		Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
		const response = await Api.get(`/auth/user-contacts`);
		return response;
	} catch (e: ApiError) {
		return e.response;
	}
};

const contactsPostAPI = async (
	name: string,
	title: string,
	email: string,
	isccresults: boolean
) => {
	try {
		Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
		const response = await Api.post('auth/user-contacts', {
			name: name,
			title: title,
			email: email,
			cc_on_results: isccresults,
		});
		return response;
	} catch (e: ApiError) {
		return e.response;
	}
};

const contactsPutAPI = async (
	uuid: string,
	name: string,
	title: string,
	email: string,
	isccresults: boolean
) => {
	try {
		Api.defaults.headers['Authorization'] = `Bearer ${Cookies.get('access')}`;
		const response = await Api.put(`auth/user-contacts/${uuid}`, {
			name: name,
			title: title,
			email: email,
			cc_on_results: isccresults,
		});
		return response;
	} catch (e: ApiError) {
		return e.response;
	}
};

const contactsDeleteAPI = async (uuid: string) => {
	try {
		Api.defaults.headers['Authorization'] = `Bearer ${Cookies.get('access')}`;
		const response = await Api.delete(`auth/user-contacts/${uuid}`);
		return response;
	} catch (e: ApiError) {
		return e.response;
	}
};

// Announcement Banner API Calls | Users...
const UserBannerGetAPI = async () => {
	try {
		Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
		const response = await Api.get(`/auth/user-announcements`);
		return response;
	} catch (e: ApiError) {
		return e.response;
	}
};

export {
	getUrl,
	Login,
	LoginAdmin,
	Register,
	RegisterClient,
	ReverifyEmail,
	RefreshToken,
	VerifyEmail,
	Logout,
	ForgetPassword,
	PasswordReset,
	CheckEmail,
	deleteClientObject,
	contactsGetAPI,
	contactsPostAPI,
	contactsPutAPI,
	contactsDeleteAPI,
	UserBannerGetAPI,
};
