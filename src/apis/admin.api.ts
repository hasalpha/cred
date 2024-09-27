import Cookies from 'js-cookie';
import { Api } from './index';
import { toast } from 'react-toastify';

export const CreateAdmin = async (body: unknown) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const result = await Api.post('/auth/create/admin/', body)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});

	return result;
};

export const CreateUser = async (body: unknown) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const result = await Api.post('/auth/create/user/', body)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});

	return result;
};

export const EditClientUser = async (body: any) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const userId = body.userId;
	delete body.userId;
	const result = await Api.put('/auth/edit/user/' + userId, body)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});
	return result;
};

export const EditAdminUser = async (body: any) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const userId = body.userId;
	delete body.userId;
	const result = await Api.put('/auth/edit/admin/' + userId, body)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});
	return result;
};

export const EditPermissionUser = async (body: any) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const result = await Api.post('/auth/change-user-permission', body)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});
	return result;
};

export const GetClientAdmins = async () => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	if (Cookies.get('type') === 'admin') {
		const result = await Api.get('/auth/get-client-admin')
			.then(response => {
				return response;
			})
			.catch(e => {
				return e.response;
			});

		return result;
	}
	return false;
};

export const GetClientUsers = async () => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	if (Cookies.get('type') === 'admin') {
		const result = await Api.get('/auth/get-client-user')
			.then(response => {
				return response;
			})
			.catch(e => {
				return e.response;
			});

		return result;
	}
	return false;
};

export const getAdminQuestionnaire = async (uuid: string) => {
	try {
		Api.defaults.headers.common.Authorization = `Bearer ${Cookies.get(
			'access'
		)}`;
		const { data } = await Api.get(`/question-builder/${uuid}`);
		return data;
	} catch (e: unknown) {
		if (e != null) toast.error((e as any)?.message!);
		return null;
	}
};

export async function updateClientAdminQuestionnaire({
	uuid,
	...body
}: {
	uuid: string;
	questionnaire_title?: string;
	is_active?: boolean;
}) {
	try {
		Api.defaults.headers.common.Authorization = `Bearer ${Cookies.get(
			'access'
		)}`;
		return await Api.put(`/api/questionnaire/client/${uuid}/`, body);
	} catch (e: any) {
		toast.error(e.message ?? 'Unable to update questionnaire');
		return { status: e.status ?? 500 };
	}
}
