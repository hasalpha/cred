import Cookies from 'js-cookie';
import { Api, baseURL } from './index';
import { toast } from 'react-toastify';
import { EmailType } from './types/super-admin.types';
import { ClientObject } from '../pages/admin-console/Types';

type ApiError = any;

export const GetClients = async () => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const result = await Api.get('/auth/clientObject');
	return result;
};

export const GetAllUsers = async () => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	if (Cookies.get('type') === 'super-admin') {
		const result = await Api.get('/auth/super-admin/get-users').catch(e => {
			return e.response;
		});
		return result;
	}
	return false;
};

export const GetClientObjectUUID = async (uuid: string) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const result = await Api.get('/auth/clientObject/' + uuid)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});
	return result;
};

const sampleNewClient = {
	uuid: 'd2c507a4-3e8e-4b43-a6b0-de4680d0242d',
	created_at: '2024-04-28T18:03:09.024795Z',
	updated_at: '2024-04-28T18:03:09.025167Z',
	country: 'Albania',
	state: 'Berat',
	address_line1: '',
	postal_code: '',
	organization: 'a',
	noOfStaff: '1-20',
	is_active: true,
	is_lead_generation_job: true,
	is_lead_generation_candidate: true,
	is_background_check: true,
	app_logo: null,
	app_domain: '',
	app_title: '',
	primary_btn_bg_color: '',
	secondry_btn_bg_color: '',
	primary_btn_txt_color: '',
	secondry_btn_txt_color: '',
	brand_primary_color: '',
	brand_secondry_color: '',
	brand_tertiary_color: '',
	link_txt: '',
	white_label_enabled: false,
	is_archived: false,
	archived_at: '2024-04-28T18:03:09.024875Z',
	is_bgcheck_allow_pay: false,
	is_sms_allow: true,
	last_month_invoice: false,
	invoices: null,
	customer_id: null,
	subscription_id: null,
	billing: null,
	payment_card: null,
};

export type Client = typeof sampleNewClient;

export const postClientObject = async (body: any) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const result = await Api.post<Client>('/auth/clientObject', body);
	return result;
};

export const CreateClientUsers = async (body: any) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const result = await Api.post('/auth/super-admin/user', body)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});

	return result;
};

export const EditClientUsers = async (body: any) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const userId = body.id;
	delete body.id;
	const result = await Api.put(
		'/auth/super-admin/user/' + userId.toString(),
		body
	)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});

	return result;
};

export const EditClient = async (body: any) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const uuid = body.uuid;
	delete body.uuid;
	const result = await Api.put('/auth/clientObject/' + uuid.toString(), body)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});

	return result;
};

export const DeleteClient = async (body: any) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	console.log(body);
	const uuid = body.uuid;
	delete body.uuid;
	const result = await Api.delete('/auth/clientObject/' + uuid.toString())
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});

	return result;
};

export const FilterUser = async (body: any) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	let request_url = `/auth/super-admin/user?user_type=${body.user_type}`;
	console.log('Enter,,,,', body.is_active);
	if (body.is_active !== '') {
		request_url = request_url + `&is_active=${body.is_active}`;
	}
	if (body.organization !== null) {
		request_url = request_url + `&organization=${body.organization}`;
	}

	const result = await Api.get(request_url)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});

	return result;
};

export const FilterClients = async (body: any) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const result = await Api.get(`/auth/clientObject?is_active=${body.is_active}`)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});

	return result;
};

export const GetReports = async (
	startDate: String,
	endDate: String,
	clientId: any
) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const result = await Api.get(
		`/api/get-requested-report/?start_date=${startDate}&end_date=${endDate}&clientId=${clientId}`
	)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});

	return result;
};

export async function getEmailTypes(): Promise<EmailType[]> {
	try {
		const response = await Api.get(`/auth/emailTypes`);
		return response.data.results;
	} catch (e: any) {
		toast.error(e.message ?? 'Error fetching email types');
		return [];
	}
}

type EmailTemplate = {
	subject: string;
	body: string;
	emailSendFunction: string;
	clientObject: string;
};

type EditEmailTemplate = Pick<EmailTemplate, 'subject' | 'body'> & {
	isEdit: boolean;
	templateUUID: string;
};

export async function saveEmailTemplate(
	data: EmailTemplate | EditEmailTemplate
) {
	if ('isEdit' in data) {
		const response = await Api.put(
			`/auth/customEmailTemplate/${data.templateUUID}`,
			data
		);
		return response;
	}
	const response = await Api.post(`/auth/customEmailTemplate`, data);
	return response;
}

export async function getEmailsForClient(uuid: string) {
	try {
		const response = await Api.get(`/auth/customEmailTemplate`, {
			params: { clientObject: uuid },
		});
		return response;
	} catch (e: any) {
		toast.error(e.message ?? 'Error getting email templates');
		return e;
	}
}

export async function postPreviewEmail({
	email,
	uuid,
	subject,
	body,
}: {
	email: string;
	uuid: string;
	subject: string;
	body: string;
}) {
	const response = await Api.post(`/auth/preview-email/${uuid}/`, {
		email,
		subject,
		body,
	});
	return response;
}

export async function deleteEmailTemplate(uuid: string) {
	return await Api.delete(`/auth/customEmailTemplate/${uuid}`);
}

export async function updateClient({
	uuid,
	data,
}: {
	uuid: string;
	data: Partial<ClientObject>;
}) {
	return await Api.put(`/auth/clientObject/${uuid}`, data);
}

export async function updateClientLogo({
	uuid,
	data,
}: {
	uuid: string;
	data: Blob;
}) {
	const formData = new FormData();
	formData.append('app_logo', data);
	return await Api.put(`/auth/clientObject/${uuid}`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
}

export async function downloadcsvreport({
	start_date,
	end_date,
}: {
	start_date: string;
	end_date: string;
}) {
	return await fetch(
		`${baseURL}/api/generate_report_csv_cron?csv=true&start_date=${start_date}&end_date=${end_date}`
	);
}
export const GetFlags = async () => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const result = await Api.get(`/api/flag/`)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});

	return result;
};

export const EditFlag = async (body: any) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const uuid = body.uuid;
	delete body.uuid;
	const result = await Api.put('/api/flag/' + uuid + '/', body)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});

	return result;
};

const check = {
	uuid: '',
	created_at: '',
	updated_at: '',
	name: '',
	value: '',
	description: '',
	is_active: true,
	priority: 0,
	stripe_product_id: '',
	default_price: 0,
};

export type Check = typeof check;

export const GetAllChecks = async () => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const result = await Api.get<{ results: Array<Check> }>('/api/checkType');
	return result;
};

export const GetClientChecks = async (body: any) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const uuid = body.uuid;
	const result = await Api.get('/api/checks-not-allowed?clientObject=' + uuid)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});

	return result;
};

export const UpdateClientChecks = async (body: any) => {
	Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
	const uuid = body.uuid;
	delete body.uuid;
	const result = await Api.put('/api/checks-not-allowed/' + uuid, body)
		.then(response => {
			return response;
		})
		.catch(e => {
			return e.response;
		});

	return result;
};

// Announcement Banner API Calls | Super Admin...
export const bannerGetAPI = async () => {
	try {
		Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
		const response = await Api.get(`/auth/announcements`);
		return response;
	} catch (e: ApiError) {
		return e.response;
	}
};

export const bannerPostAPI = async (
	title: string,
	description: string,
	isBannerActive: boolean
) => {
	try {
		Api.defaults.headers['Authorization'] = `Bearer  ${Cookies.get('access')}`;
		const response = await Api.post('auth/announcements', {
			title: title,
			description: description,
			is_active: isBannerActive,
		});
		return response;
	} catch (e: ApiError) {
		return e.response;
	}
};

export const bannerPutAPI = async (uuid: string, isBannerActive: boolean) => {
	try {
		Api.defaults.headers['Authorization'] = `Bearer ${Cookies.get('access')}`;
		const response = await Api.put(`auth/announcements/${uuid}`, {
			is_active: isBannerActive,
		});
		return response;
	} catch (e: ApiError) {
		return e.response;
	}
};
