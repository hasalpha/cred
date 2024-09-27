import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { Api } from './index';
import axios, { AxiosResponse, isAxiosError } from 'axios';
import { LeadPreferenceType, Tabs } from './types';
import {
	BackgroundCheckBody,
	BackgroundCheckParams,
	BackgroundUpdateParams,
	Bucket,
	BucketResponse,
	Competency,
	CompetencyResponse,
	Industry,
	IndustryResponse,
	PartialNull,
	Questionnaire,
} from './types/user-api-types';
import { publicIpv4 } from 'public-ip';
import { Question } from '../components/TemplateBuilderTypes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useConsumerPoliceStore } from 'pages/user/consumer-police-check/hooks/UseCBCIndexStore';
import { oneDay } from 'Common';
import { PoliceCheckStates } from 'pages/user/consumer-police-check/types';
import { useGetSessionContextData } from 'pages/user/consumer-police-check/context/PersonalDetailsContext';
import { CandidateSummaryData } from './radom-types';

export default function setAuthorizationBearerToken() {
	Api.defaults.headers.common.Authorization = `Bearer ${Cookies.get('access')}`;
	return null;
}

export const ipApi =
	'https://dr5uhki0g9.execute-api.us-east-1.amazonaws.com/dev/whois/';

export const createCandidate = async (body: any) => {
	const result = await Api.post('/api/candidate', body);
	return result;
};

export const getCandidatesList = async (status: Tabs) => {
	Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get(
		'access'
	)}`;
	const result = await Api.get(`api/get-candidate/${status}?page_size=100`)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	return result;
};

export const getCandidatesListPaginated = async (pageParam: string) => {
	Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get(
		'access'
	)}`;
	const result = await Api.get(`api/get-candidate/${pageParam}`).catch(
		(e: { response: any; message: string }) => {
			return e.response;
		}
	);
	if (result.status === 400) {
		toast.error(result.data.Error);
		return { data: [] };
	}
	return result;
};

export const getCandidateData = async (id: any) => {
	Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get(
		'access'
	)}`;
	const result = await Api.get(`api/candidate/${id}`)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	return result;
};

export const getSummaryCount = async () => {
	Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get(
		'access'
	)}`;
	const result = await Api.get(`api/getSummary`)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	return result;
};

export const getCandidateSummary = async (id: any) => {
	const result = await Api.get<CandidateSummaryData>(
		`api/candidate/candidate-summary/${id}`
	).catch();
	return result;
};

export const getRefereeDetails = async (item: any) => {
	const result = await Api.get(`/api/jobHistory/${item}`)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	return result;
};

export const getRefereeDetails2 = async (item: any) => {
	const result = await Api.get(`/api/refree/${item}`)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	return result;
};

export const addToArchive = async (body: any) => {
	Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get(
		'access'
	)}`;
	const result = await Api.post('/api/candidateArchive', body)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	return result;
};

export const getCandidateArchieve = async (page: any) => {
	Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get(
		'access'
	)}`;
	const result = await Api.get(`api/candidate/candidateArchive/${page}`)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	return result;
};

export const getCandidateLifeCycle = async (id: any) => {
	Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get(
		'access'
	)}`;
	const result = await Api.get(`api/lifeCycle/${id}`)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	return result;
};

export const getPDF = async (JobId: string) => {
	Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get(
		'access'
	)}`;
	const result = await Api.get(`api/get-pdf/` + JobId, { responseType: 'blob' })
		.then((response: any) => {
			return response;
		})
		.catch((e: any) => {
			return e;
		});
	return result;
};

export const addJobHistory = async (body: any) => {
	const result = await Api.post('/api/jobHistory', body)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	return result;
};

export const getJobHistory = async (id: any) => {
	let result = null;
	try {
		result = await Api.get(
			`${
				import.meta.env.VITE_API_URL
			}/api/jobHistory/job-history-candidate/${id}`
		)
			.then((response: any) => {
				return response;
			})
			.catch((e: { response: any }) => {
				return e.response;
			});
	} catch (e: any) {
		return e.response;
	}
	if (result.status < 400) return result.data;
	return result;
};

export const getJobHistorybyId = async (id: any) => {
	const result = await Api.get(`api/jobHistory/${id}`)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	return result;
};

export const updateCandidateJobHistory = async (id: any, body: any) => {
	await Api.patch(`/api/jobHistory/${id}`, body)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	const result3 = await Api.get(`api/jobHistory/${id}`)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	await Api.patch(`/api/refree/${result3.data.refree}`, body)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	return { status: 200 };
	//return result;
};

export const sendRefereeDeclineMail = async (
	id: any
): Promise<Record<string & 'status', any>> => {
	try {
		const result = await Api.get(`api/jobHistory/decline/${id}`);
		return result.data;
	} catch (e) {
		return (e as any)?.response;
	}
};
export const removeJobHistory = async (id: any) => {
	const result = await Api.delete(`/api/jobHistory/${id}`)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	return result;
};

export const sendEmail = async (id: any) => {
	const result = await Api.post(`/api/jobHistory/job-history-mail/${id}`)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	return result;
};

export const addQuestionnaireResponse = async (body: any) => {
	//   Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get('access')}`
	const result = await Api.post(`/api/questionaire-response`, body)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	return result;
};

export const getQuestionnaireResponse = async (id: any) => {
	Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get(
		'access'
	)}`;
	const result = await Api.get(`api/questionaire-response/get-response/${id}`)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	return result;
};

export const sendCompleteEmail = async (userType: any, id: any) => {
	const result = await Api.post(`/api/referenceCompleted/${userType}/${id}`)
		.then((response: any) => {
			return response;
		})
		.catch((e: { response: any }) => {
			return e.response;
		});
	return result;
};

export const updateLifeCycle = async (body: any) => {
	const result = await Api.post(`api/lifeCycle`, body);
	return result;
};

export const getAdminSummary = async () => {
	Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get(
		'access'
	)}`;
	try {
		const { data } = await Api.get(`api/get-admin-summary`);
		return data;
	} catch (e) {
		return e;
	}
};

export const getAdminReport = async (status: any) => {
	Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get(
		'access'
	)}`;
	try {
		const { data } = await Api.get(`api/adminReport?candidateStatus=${status}`);
		return data;
	} catch (e) {
		return e;
	}
};

export const filterByAdminReport = async (status: any, recruiterId: any) => {
	Api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
		'access'
	)}`;
	try {
		const { data } = await Api.get(
			`api/adminReport?candidateStatus=${status}&recruiter_id=${recruiterId}`
		);
		return data;
	} catch (e) {
		return e;
	}
};

export const getAllUserAdmin = async () => {
	Api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
		'access'
	)}`;
	try {
		const { data } = await Api.get(`auth/all-user-admin`);
		return data;
	} catch (e) {
		return e;
	}
};

export const getQuestionnaires = async (): Promise<Array<Questionnaire>> => {
	Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get(
		'access'
	)}`;
	try {
		const { data } = await Api.get(`api/questionnaire`);
		return data.results;
	} catch (e: any) {
		return e.response;
	}
};

export const getClientAdminQuestionnaires = async (): Promise<
	Array<Questionnaire>
> => {
	Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get(
		'access'
	)}`;
	try {
		const { data } = await Api.get(`api/questionnaire/getclient/`);
		return data;
	} catch (e: any) {
		return e.response;
	}
};

//written by vijaykumar on 26th Oct 2022 to pull the ISP details from external API
export const getISP = async (ipaddress: any) => {
	//const ispURL = "http://ip-api.com/json/${ipaddress}";
	Api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
		'access'
	)}`;
	try {
		const {
			data: { results },
		} = await Api.get(`api/request-builder?ip=${ipaddress}`);
		return results;
	} catch (e: any) {
		return e.response;
	}
};
//written by vijaykumar on 14th Oct 2022 to pull the search result for template builder page
export const getQuestionsBySearchQuery = async (query: any) => {
	Api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
		'access'
	)}`;
	try {
		const {
			data: { results },
		} = await Api.get(`api/question-builder?search=${query}`);
		return results;
	} catch (e: any) {
		return e.response;
	}
};

//written by vijaykumar on 14th Oct 2022 to pull the questions based on the given bucket type for template builder page

export const getQuestionsByBucketType = async (id: string) => {
	Api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
		'access'
	)}`;
	try {
		const { data } = await Api.get(`api/question-builder?bucket=${id}`);
		return data;
	} catch (e: any) {
		return e.response;
	}
};

export const getQuestionsByCompetencyType = async (id: string) => {
	Api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
		'access'
	)}`;
	try {
		const { data } = await Api.get(`api/competencyFilter?competency=${id}`);
		return data;
	} catch (e: any) {
		return e.response;
	}
};

export const getIndustries = async (page: number): Promise<Industry[]> => {
	try {
		Api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
			'access'
		)}`;
		const {
			data: { results },
		} = (await Api.get(
			`api/industry?page=${page}`
		)) as AxiosResponse<IndustryResponse>;
		return results;
	} catch (e: any) {
		return e.response;
	}
};

export const getCompetencies = async (page: number): Promise<Competency[]> => {
	Api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
		'access'
	)}`;
	try {
		const {
			data: { results },
		} = (await Api.get(
			`api/competency?page=${page}`
		)) as AxiosResponse<CompetencyResponse>;
		return results;
	} catch (e: any) {
		return e.response;
	}
};

export const getBuckets = async (page: number): Promise<Bucket[]> => {
	Api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
		'access'
	)}`;
	try {
		const {
			data: { results },
		} = (await Api.get(
			`api/bucket?page=${page}`
		)) as AxiosResponse<BucketResponse>;
		return results;
	} catch (e: any) {
		return e.response;
	}
};

export const buildQuestionnaire = async (body: any) => {
	Api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
		'access'
	)}`;
	try {
		return await Api.post(`api/build-questionnaire`, body);
	} catch (e: any) {
		return e.response;
	}
};

type TemplateBuilderQuestionnaire = {
	industry: string;
	job_title: string;
	questionnaire_title: string;
	questionList: string[];
};

export const createQuestionnaire = async (
	body: TemplateBuilderQuestionnaire
) => {
	Api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
		'access'
	)}`;
	try {
		return await Api.post(`api/questionnaire`, body);
	} catch (e: any) {
		return e.response;
	}
};

export const createClientAdminQuestionnaire = async (
	body: TemplateBuilderQuestionnaire
) => {
	Api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
		'access'
	)}`;
	try {
		return await Api.post(`/api/questionnaire/client/`, body);
	} catch (e: any) {
		return e.response;
	}
};

export const getQuestionnaireForReferee = async (jobId: any) => {
	try {
		const { data } = await Api.get(`api/get-questionnaire/${jobId}`);
		return data;
	} catch (e: any) {
		return e.response;
	}
};

export const archiveQuestionnaire = async (id: any, result = true) => {
	Api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
		'access'
	)}`;
	try {
		return await Api.patch(`api/questionnaire/${id}`, { is_archived: result });
	} catch (e: any) {
		return e.response;
	}
};

export const getAllQuestions = async () => {
	const token = Cookies.get('access');
	if (!token) return [];
	Api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
		'access'
	)}`;
	try {
		const { data } = await Api.get(`api/question-builder`);
		return data;
	} catch (e: any) {
		return [];
	}
};

export const addCustomQuestion = async (question: any) => {
	Api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
		'access'
	)}`;
	try {
		const { data } = await Api.post(`api/custom-questions`, question);
		return data;
	} catch (e: any) {
		toast.error(e.response);
	}
};

export const getCustomQuestionsForThisUser = async (): Promise<
	Question[] | undefined
> => {
	Api.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(
		'access'
	)}`;
	const response = await Api.get(`api/custom-questions`).catch(() => {});
	if (response) {
		const { data } = response;
		return data as Question[];
	}
};

export const getIP = async () => {
	let ip = localStorage.getItem('Ip');
	ip ||= await publicIpv4({ onlyHttps: true });
	return ip;
};

export const getISPDetails = async (
	ip: string | null | undefined,
	signal: AbortSignal | undefined
) => {
	try {
		const { data } = await axios.get(ipApi + ip, { signal });
		let idx1 = data?.indexOf('netname:');
		let idx2 = data?.indexOf('descr:');
		const isp = data
			?.substring(idx1, idx2)
			?.split(' ')
			?.filter((val: string | any[]) => val?.length !== 0)?.[1]
			?.trim();
		return isp;
	} catch (e) {
		console.error(e);
	}
};

export const unarchiveRequest = async (body: { archive_uuid: string }) => {
	try {
		Api.defaults.headers.common.Authorization = `Bearer ${Cookies.get(
			'access'
		)}`;
		const response = await Api.post('/api/candidateArchive/unarchive/', body);
		if (response.status >= 200 && response.status < 300)
			toast.success('Request has been unarchived successfully!');
		return response;
	} catch (e) {
		if (
			typeof e === 'object' &&
			'message' in e! &&
			typeof e.message === 'string'
		)
			toast.error(e.message);
		return { status: 400 };
	}
};

export const checkRequestArchiveStatus = async (id: string) => {
	try {
		const response = await Api.get(`/api/candidateMore/${id}`);
		return response.status;
	} catch (e) {
		console.log({ e });
		if (axios.isAxiosError(e)) {
			return e.response?.status ?? 404;
		}
	}
};

export const checkJobHistoryArchive = async (id: string) => {
	try {
		const response = await Api.get(`/api/jobHistory/${id}`);
		return response.status;
	} catch (e) {
		if (isAxiosError(e)) {
			return e.response?.status ?? 404;
		}
		return 404;
	}
};

export async function getLeadInfo(
	id: string
): Promise<LeadPreferenceType | void> {
	try {
		const response = await Api.get(`/api/get-lead-info/${id}`);
		return response.data;
	} catch (e) {
		toast.error('Error fetching referee info');
	}
}

export async function doBackgroundCheck(body: BackgroundCheckBody) {
	try {
		const response = await Api.post(`/api/backgoundCheck`, body);
		return response.data;
	} catch (e) {
		return e;
	}
}
const allowedCheckTypeResult = [
	{
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
		type: '0',
		club: '',
	},
];

type AllowedCheckTypes = typeof allowedCheckTypeResult;

export async function getAllowedCheckTypes() {
	const response = await Api.get<AllowedCheckTypes>(`/api/get-checks-allowed`);
	return response.data;
}

const checkTypeApiResponse = {
	count: 12,
	next: null,
	previous: null,
	results: [
		{
			uuid: '7317277b-00df-4020-affa-71ee40f664fa',
			created_at: '2023-04-04T11:45:14Z',
			updated_at: '2024-05-28T13:43:59.658926Z',
			name: 'Canadian Criminal Record Check',
			value: 'request_criminal_record_check',
			description:
				'A Canadian police information check includes a search of the Canadian Police Information Centre (“CPIC”) database and locally held police information centres for: charges, warrants, peace bonds, prohibition orders, release conditions, probation orders, summary convictions, recent convictions not yet registered in the national repository.',
			is_active: true,
			priority: 0,
			stripe_product_id: 'prod_Ppm1R9JHNUGQiI',
			default_price: 24,
			type: 'CA',
			club: '3b32ce83-e316-4e22-b75c-29e2cb1565ce',
		},
	],
};

export type CheckTypeApiResponse = typeof checkTypeApiResponse;

export async function getAllCheckType() {
	const response = await Api.get<CheckTypeApiResponse>(`/api/checkType`);
	return response.data;
}

export async function getBackgroundCheck(
	params: Partial<PartialNull<BackgroundCheckParams>>
): Promise<any> {
	const response = await Api.get(`/api/backgoundCheck`, { params });
	return response.data;
}

export async function doUpdateBackgroundCheck({
	uuid,
	body,
}: BackgroundUpdateParams) {
	try {
		const response = await Api.put(`/api/backgoundCheck/${uuid}`, body);
		return response.data;
	} catch (e) {
		return e;
	}
}

export async function getReport(uuid: string) {
	try {
		const response = await Api.get(`/api/backgoundCheck/report/${uuid}/pdf/`, {
			responseType: 'blob',
		});
		return response.data;
	} catch (e) {
		return e;
	}
}

export async function getReportHTML(uuid: string): Promise<{ html: string }> {
	const response = await Api.get(`/api/backgoundCheck/report/${uuid}/web/`);
	return response.data;
}

export async function searchRequests({
	tab,
	searchParam,
}: {
	tab: Tabs;
	searchParam: string;
}) {
	try {
		Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get(
			'access'
		)}`;
		const result = await Api.get(`api/get-candidate/${tab}`, {
			params: { search: searchParam },
		}).catch((e: { response: any }) => {
			return e.response;
		});
		return result;
	} catch (e) {
		return e;
	}
}

export async function filterRequests({
	start_date,
	tab,
}: {
	tab: Tabs;
	start_date: string;
}) {
	try {
		Api.defaults.headers.common['Authorization'] = `Bearer  ${Cookies.get(
			'access'
		)}`;
		const result = await Api.get(`api/get-candidate/${tab}`, {
			params: {
				start_date,
				end_date: new Date().toISOString(),
				page_size: 1000,
			},
		}).catch((e: { response: any }) => {
			return e.response;
		});
		return result;
	} catch (e) {
		return e;
	}
}

export const sampleBGCheckResponse = {
	uuid: 'f42117c4-28e5-4fa7-90c0-5ea1aece15eb',
	created_at: '2023-10-10T17:55:34.257687Z',
	updated_at: '2023-10-10T17:55:34.275651Z',
	is_criminal_and_judicial_check: false,
	state: 'NONE',
	lead_source: 'DASHBOARD',
	active: true,
	is_over_18: true,
	is_policy_accepted: true,
	is_newsletter: true,
	is_biometric_consent: false,
	bgCheck: null,
	personal_info: '',
	veriff_check: null,
	address_list: [] as Array<string>,
	criminal_and_judicial_check: [] as Array<string>,
};

export interface BgCheckResponseInterface {
	uuid: string;
	created_at: string;
	updated_at: string;
	is_criminal_and_judicial_check: boolean;
	state: string;
	lead_source: string;
	active: boolean;
	is_over_18: boolean;
	is_policy_accepted: boolean;
	is_newsletter: boolean;
	is_biometric_consent: boolean;
	bgCheck: null | string;
	personal_info: null | string;
	veriff_check: null | string;
	address_list: null | Array<string>;
	criminal_and_judicial_check: null | Array<string>;
	final_price: number;
	preview: string;
}

export function useStartSessionMutation() {
	return useMutation({ mutationFn: startSession });
}

export function useGetSessionQuery() {
	const uuid = useConsumerPoliceStore(select => select.uuid);
	return useQuery({
		queryKey: [uuid],
		queryFn: () => getSession(uuid),
		enabled: !!uuid,
	});
}

export function useAddPersonalDetailsMutation() {
	const uuid = useConsumerPoliceStore(select => select.uuid);
	return useMutation({
		mutationFn(body: PersonalDetails) {
			return addPersonalDetails({ uuid, ...body });
		},
	});
}

const startSessionPayload = {
	is_over_18: true,
	is_policy_accepted: true,
	is_newsletter: true,
};

async function startSession(data: typeof startSessionPayload) {
	return await Api.post<BgCheckResponseInterface>('api/internal-bgcheck', data);
}

const sampleBiometricPayload = {
	state: PoliceCheckStates.BIOMETRIC,
	is_biometric_consent: true,
};

export function useBiometricConsentMutation() {
	const uuid = useConsumerPoliceStore(select => select.uuid);
	return useMutation({
		mutationFn(body: typeof sampleBiometricPayload) {
			return addBiometricConsent({ uuid, ...body });
		},
	});
}

async function addBiometricConsent({
	uuid,
	...data
}: Data<typeof sampleBiometricPayload>) {
	return await Api.patch<BgCheckResponseInterface>(
		`api/internal-bgcheck/${uuid}`,
		data
	);
}

async function getSession(uuid: string) {
	const { data } = await Api.get<BgCheckResponseInterface>(
		`api/internal-bgcheck/${uuid}`
	);
	return data;
}

const samplePersonalDetailsInput = {
	state: 'PERSONAL' as const,
	personal: {
		first_name: 'test',
		middle_name: 'Middle',
		last_name: 'last',
		email: 'prajjwal@gmal.com',
		city: 'city',
		country: 'country',
		birth_last_name: 'birth_last_name',
		other_name: 'other_name',
		sex: 'MALE',
		dob: '2000-09-13T10:22:47.647776Z',
		phone: '9738683783',
		is_email_allowed: true,
	},
};

const samplePersonalDetailsResponse = {
	uuid: '647fe06a-c9f3-48f8-82ef-1aba475b62be',
	created_at: '2023-10-13T18:17:22.951500Z',
	updated_at: '2023-10-13T18:25:52.656300Z',
	is_criminal_and_judicial_check: false,
	state: 'PERSONAL',
	lead_source: 'DASHBOARD',
	active: true,
	is_over_18: true,
	is_policy_accepted: true,
	is_newsletter: true,
	is_biometric_consent: true,
	bgCheck: null,
	personal_info: 'ebed4f05-d7c1-4c5a-b464-798a01814e50',
	veriff_check: null,
	preview: null,
	address_list: [],
	criminal_and_judicial_check: [],
	personalInfo: {
		uuid: 'ebed4f05-d7c1-4c5a-b464-798a01814e50',
		created_at: '2023-10-13T18:25:52.651941Z',
		updated_at: '2023-10-13T18:25:52.652163Z',
		first_name: 'mehfouz',
		middle_name: 'fewijfoew',
		last_name: 'jalal',
		email: 'hasan.arshad18@gmail.com',
		city: 'Buffalo',
		country: 'India',
		birth_last_name: 'fdsfds',
		other_name: 'fewfew',
		sex: 'MALE',
		dob: '2023-10-17T00:00:00Z',
		phone: '+234 3242342342',
		is_email_allowed: true,
	},
};

type PersonalDetails = typeof samplePersonalDetailsInput;

async function addPersonalDetails({ uuid, ...data }: Data<PersonalDetails>) {
	return await Api.patch<typeof samplePersonalDetailsResponse>(
		`api/internal-bgcheck/${uuid}`,
		data
	);
}

export function useAddAddressDetailsMutation() {
	return useMutation({
		mutationFn: addAddressDetails,
	});
}

export const sampleAddress = {
	state: 'ADDRESS' as const,
	address: ['jfieowjio'],
};

export async function commitAddressToSession({
	uuid,
	...data
}: Data<typeof sampleAddress>) {
	return await Api.patch(`api/internal-bgcheck/${uuid}`, data);
}

export async function commitCjmrcToSession({
	uuid,
	...data
}: Data<typeof sampleCJMRCDetails>) {
	return await Api.patch(`api/internal-bgcheck/${uuid}`, data);
}

const newSampleAddress = {
	uuid: '7c43c29d-de24-4a64-8eed-e20e4b7b78cc',
	created_at: '2023-10-31T11:21:00.371466Z',
	updated_at: '2023-10-31T11:27:14.546195Z',
	country: 'canada',
	street_number: '32',
	street_name: 'few',
	apt_or_unit: 'few',
	city: 'few',
	province: 'ca',
	postal_name: '32',
	date_moved_in: '2017-05-13',
	is_office: false,
};

export type NewSampleAddress = typeof newSampleAddress & {
	address_type: 'OLD' | 'CURRENT';
};

async function addAddressDetails(
	data: Omit<NewSampleAddress, 'uuid' | 'created_at' | 'updated_at'>
) {
	return await Api.post<NewSampleAddress>(`api/addressHistory`, data);
}

export function useAddIdentityDetailsMutation() {
	return useMutation({ mutationFn: addIdentityDetails });
}

async function addIdentityDetails({
	uuid,
	data,
}: {
	uuid: string;
	data: typeof sampleIdentityDetails;
}) {
	return await Api.patch(`api/internal-bgcheck/${uuid}`, data);
}

const sampleIdentityDetails = {
	state: 'IDENTITY' as const,
	veriff_id: '1a0821e9-2d42-4da3-829c-ce4afc73f557',
};

export function useAddCJMRCNoDetails() {
	return useMutation({ mutationFn: addCJMRCNoDetails });
}

export async function addCJMRCNoDetails({
	uuid,
	...data
}: Data<typeof sampleCJMRCNoDetails>) {
	return await Api.patch(`api/internal-bgcheck/${uuid}`, data);
}

const sampleCJMRCNoDetails = {
	state: 'CRJMC' as const,
	is_cjmrc: false,
};

export function useAddCrjmcDetails() {
	return useMutation({ mutationFn: addCrjmcDetails });
}

async function addCrjmcDetails({
	uuid,
	data,
}: {
	uuid: string;
	data: typeof sampleCJMRCDetails;
}) {
	return Api.patch(`api/internal-bgcheck/${uuid}`, data);
}

const sampleCJMRCDetails = {
	state: 'CRJMC' as const,
	is_cjmrc: true,
	cjmrc: ['jfioewjio'],
};

const samplePreviewDetails = {
	state: 'PREVIEW' as const,
	preview: 'Confirmed' as const,
	is_term_accpeted: true as const,
	signature: new Blob(),
};

async function addPreviewDetails({
	uuid,
	data,
}: {
	uuid: string;
	data: typeof samplePreviewDetails;
}) {
	const formData = new FormData();
	for (let key of Object.keys(data)) {
		formData.set(key, (data as any)[key]);
	}
	return Api.patch(`api/internal-bgcheck/${uuid}`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
}

export function useAddPreviewDetailsMutation() {
	return useMutation({ mutationFn: addPreviewDetails });
}

const samplePaymentDetails = {
	state: 'PAYMENT' as const,
	payment: {
		card_number: '5100000010001004',
		expiry_date: '02',
		expiry_year: '24',
		cvd: '123',
		amount: '34',
		name_on_card: 'Name',
	},
};

type Data<T> = {
	uuid: string;
} & T;

export type Payment = (typeof samplePaymentDetails)['payment'];

async function addPaymentDetails({
	uuid,
	...data
}: Data<typeof samplePaymentDetails>) {
	return Api.patch(`api/internal-bgcheck/${uuid}`, data);
}

export function useAddPaymentDetailsMutation() {
	return useMutation({ mutationFn: addPaymentDetails });
}

export const sampleVeriffInput = {
	redirect_url: import.meta.env.VITE_WEB_URL,
	internal_bgcheck_id: '3a62447d-252c-4f52-b606-f6722ef5aaf8',
};

const sampleVeriffResponse = {
	uuid: '901d42e4-961d-4d81-be91-de9948e48afe',
	created_at: '2023-10-24T13:43:42.187926Z',
	updated_at: '2023-10-24T13:43:42.188201Z',
	status: 'STARTED',
	url: 'https://alchemy.veriff.com/v/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTgxNTUwMjIsInNlc3Npb25faWQiOiI4NDJiNzUzZS0wYmEzLTRiYmItOWFkNy1iYTJjOTg5YzBkNDQiLCJpaWQiOiJjNGU5MWU0Ny0yMjc0LTQyZWQtYTk4NS0wNjg5OTRlYjhlNTYifQ.qxLlVVmvLgIpmGqNZbgEEzwM2Dm_CmnRuDlFHVOmXa4',
	seesion_id: '842b753e-0ba3-4bbb-9ad7-ba2c989c0d44',
	callback_url: 'https://app-dev.credibled.com',
	session_token:
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTgxNTUwMjIsInNlc3Npb25faWQiOiI4NDJiNzUzZS0wYmEzLTRiYmItOWFkNy1iYTJjOTg5YzBkNDQiLCJpaWQiOiJjNGU5MWU0Ny0yMjc0LTQyZWQtYTk4NS0wNjg5OTRlYjhlNTYifQ.qxLlVVmvLgIpmGqNZbgEEzwM2Dm_CmnRuDlFHVOmXa4',
	email: 'mohamed@credibled.com',
	score: 'None',
	application_status: null,
};

export async function createVeriffSession({
	uuid,
	config,
}: {
	uuid: string;
	config: Record<'force', boolean> | {};
}) {
	return await Api.post<typeof sampleVeriffResponse>('api/veriff-check', {
		redirect_url: import.meta.env.VITE_WEB_URL,
		internal_bgcheck_id: uuid,
		...config,
	});
}

export function useCreateVeriffSessionMutation() {
	return useMutation({ mutationFn: createVeriffSession });
}

const samplePersonalDetailsOutput = {
	uuid: '8a8ad384-99f5-4681-949b-13f24d80d98f',
	created_at: '2023-10-11T19:50:09.823052Z',
	updated_at: '2023-10-11T19:50:09.823279Z',
	first_name: 'mehfouz',
	middle_name: '',
	last_name: 'jalal',
	email: 'hasan.arshad18@gmail.com',
	city: 'Buffalo',
	country: 'India',
	birth_last_name: 'fewfae',
	other_name: 'dsfafdsa',
	sex: 'MALE',
	dob: '2023-10-04T00:00:00Z',
	phone: '+32 4398409328',
	is_email_allowed: true,
};

async function getPersonalDetails(uuid: string | null) {
	if (!uuid) {
		return;
	}
	return (
		await Api.get<typeof samplePersonalDetailsOutput>(
			`api/personal-info/${uuid}`
		)
	).data;
}

export function useGetPersonalDetails() {
	const { personal_info } = useGetSessionContextData();
	return useQuery({
		queryKey: ['personal-details', personal_info],
		queryFn: context => getPersonalDetails(context.queryKey[1]),
		staleTime: oneDay,
		enabled: !!personal_info,
	});
}

async function editPersonalDetails({
	uuid,
	...rest
}: Data<Partial<(typeof samplePersonalDetailsInput)['personal']>>) {
	return await Api.patch<typeof samplePersonalDetailsResponse>(
		`api/personal-info/${uuid}`,
		rest
	);
}

export function useEditPersonalDetailsMutation() {
	return useMutation({ mutationFn: editPersonalDetails });
}

const sampleAddressResponse = {
	uuid: 'e3748907-9823-4b59-8698-023068438c9f',
	created_at: '2023-10-15T09:54:22.297747Z',
	updated_at: '2023-10-15T09:54:22.297976Z',
	country: 'canada',
	street_number: '32',
	street_name: 'affa',
	apt_or_unit: 'sfawef',
	city: 'fdsafdsa',
	province: 'ca',
	postal_name: '343242',
	date_moved_in: '2023-10-17',
};

export type AddressEntity = typeof sampleAddressResponse;

async function getAddresses(uuids: Array<string>) {
	const promises = [];
	for (let uuid of uuids) {
		promises.push(Api.get<NewSampleAddress>(`api/addressHistory/${uuid}`));
	}
	const responses = await Promise.all(promises);
	return responses.map(v => v.data);
}

export function useGetAddress() {
	const { data } = useGetSessionQuery();
	return useQuery({
		queryKey: data?.address_list!,
		queryFn: () => getAddresses(data?.address_list!),
		enabled: !!data?.address_list,
		staleTime: oneDay,
	});
}

export async function deleteAddress({ uuid }: Data<{}>) {
	return await Api.delete(`api/addressHistory/${uuid}`);
}

export async function updateAddress({
	uuid,
	...data
}: Data<Partial<NewSampleAddress>>) {
	return await Api.patch<Data<Partial<NewSampleAddress>>>(
		`api/addressHistory/${uuid}`,
		data
	);
}

export function useUpdateAddressMutation() {
	return useMutation({ mutationFn: updateAddress });
}

async function getCJMRC(uuid: string) {
	return (await Api.get(`api/criminal-and-judicial-check/${uuid}`)).data;
}

export function useGetCJMRC() {
	const uuid = useConsumerPoliceStore(select => select.uuid);
	return useQuery({
		queryKey: [uuid],
		queryFn: () => getCJMRC(uuid),
		enabled: !!uuid,
		staleTime: oneDay,
	});
}

async function updateCJMRC({
	uuid,
	...data
}: Data<Partial<typeof sampleCJMRCDetails>>) {
	return await Api.patch(`api/addressHistory/${uuid}`, data);
}

export function useUpdateCJMRCMutation() {
	return useMutation({ mutationFn: updateCJMRC });
}

export async function addCharges({
	uuid,
	data,
}: {
	uuid: string;
	data: typeof sampleCharges;
}) {
	return await Api.patch(`api/charges/${uuid}`, data);
}

const sampleCharges = [
	{
		description: 'Common Offenses',
		offenses: [
			{
				offense: 'Aggravated Assault',
				law: 'C-46',
				act: '268',
			},
			{
				offense: 'Assault with a weapon or causing bodily harm',
				law: 'C-46',
				act: '267',
			},
			{
				offense: 'Escape and being at large without excuse',
				law: 'C-46',
				act: '145',
				subsection: '(1)',
			},
			{
				offense: 'Failure to attend court or surrender',
				law: 'C-46',
				act: '145',
				subsection: '(2)',
			},
			{
				offense: 'Failure to comply with appearance notice or summons',
				law: 'C-46',
				act: '145',
				subsection: '(3)',
			},
			{
				offense: 'Failure to comply with undertaking',
				law: 'C-46',
				act: '145',
				subsection: '(4)',
			},
			{
				offense: 'Failure to comply with order',
				law: 'C-46',
				act: '145',
				subsection: '(5)',
			},
			{
				offense: 'Assault',
				law: 'C-46',
				act: '266',
			},
			{
				offense: 'Possession of substance',
				law: '19',
				act: '4',
				subsection: '(1)',
			},
			{
				offense: 'Fraud',
				law: 'C-46',
				act: '380',
			},
			{
				offense: 'Operation/Driving while impaired',
				law: 'C-46',
				act: '320.14',
				subsection: '(1)',
			},
			{
				offense: 'Mischief',
				law: 'C-46',
				act: '430',
			},
			{
				offense: 'Theft Over $5,000',
				law: 'C-46',
				act: '334',
				paragraph: 'a)',
			},
			{
				offense: 'Theft Under $5,000',
				law: 'C-46',
				act: '334',
				paragraph: 'b)',
			},
			{
				offense: 'Uttering Threats',
				law: 'C-46',
				act: '264.1',
			},
		],
	},
	{
		description: 'Administration of Justice Offenses',
		offenses: [
			{
				offense: 'Breach of trust by public officer',
				law: 'C-46',
				act: '122',
			},
			{
				offense: 'Assaulting a peace officer',
				law: 'C-46',
				act: '270',
			},
			{
				offense: 'Assaulting peace officer with weapon or causing bodily harm',
				law: 'C-46',
				act: '270.01',
			},
			{
				offense: 'Disobeying a Court Order',
				law: 'C-46',
				act: '127',
			},
			{
				offense: 'Fabricating Evidence',
				law: 'C-46',
				act: '137',
			},
			{
				offense: 'Intimidation of a justice system participant or a journalist',
				law: 'C-46',
				act: '423.1',
			},
			{
				offense: 'Obstructing Justice',
				law: 'C-46',
				act: '139',
			},
			{
				offense: 'Offences relating to public or peace officer',
				law: 'C-46',
				act: '129',
			},
			{
				offense: 'Perjury',
				law: 'C-46',
				act: '131',
			},
			{
				offense: 'Prison Breach',
				law: 'C-46',
				act: '144',
			},
			{
				offense: 'Public Mischief',
				law: 'C-46',
				act: '140',
			},
		],
	},
	{
		description: 'Corruption Offenses',
		offenses: [
			{
				offense: 'Bribery of judicial officers, etc.',
				law: 'C-46',
				act: '119',
				subsection: '(1)',
			},
			{
				offense: 'Consent of Attorney General',
				law: 'C-46',
				act: '119',
				subsection: '(2)',
			},
			{
				offense: 'Bribery of officers',
				law: 'C-46',
				act: '120',
			},
			{
				offense: 'Frauds on the Government',
				law: 'C-46',
				act: '121',
				subsection: '(1)',
			},
			{
				offense: 'Contractor subscribing to election fund',
				law: 'C-46',
				act: '121',
				subsection: '(2)',
			},
		],
	},
	{
		description: 'Disorderly Conduct',
		offenses: [
			{
				offense: 'Causing disturbance, indecent exhibition, loitering, etc.',
				law: 'C-46',
				act: '175',
			},
			{
				offense: 'Indecent Act',
				law: 'C-46',
				act: '173',
				subsection: '(1)',
			},
			{
				offense: 'Exposure',
				law: 'C-46',
				act: '173',
				subsection: '(2)',
			},
			{
				offense: 'Trespassing at Night',
				law: 'C-46',
				act: '177',
			},
			{
				offense: 'Unlawful Assembly',
				law: 'C-46',
				act: '63',
			},
			{
				offense: 'Riot',
				law: 'C-46',
				act: '64',
			},
		],
	},
	{
		description: 'Drug Offenses',
		offenses: [
			{
				offense: 'Drug/Substance Possession',
				law: '19',
				act: '4',
				subsection: '(1)',
			},
			{
				offense: 'Obtaining substance',
				law: '19',
				act: '4',
				subsection: '(2)',
			},
			{
				offense: 'Production of drug/substance',
				law: '19',
				act: '7',
			},
			{
				offense: 'Drug/Substance Trafficking',
				law: '19',
				act: '5',
			},
			{
				offense: 'Importing and Exporting Drugs',
				law: '19',
				act: '6',
				subsection: '(1)',
			},
			{
				offense: 'Drug/Substance possession for the purpose of exporting',
				law: '19',
				act: '6',
				subsection: '(2)',
			},
		],
	},
	{
		description: 'Hate Speech and Libel',
		offenses: [
			{
				offense: 'Defamatory Libel',
				law: 'C-46',
				act: '300',
			},
			{
				offense: 'Public Incitement of Hatred',
				law: 'C-46',
				act: '319',
				subsection: '(1)',
			},
			{
				offense: 'Wilful promotion of hatred',
				law: 'C-46',
				act: '319',
				subsection: '(2)',
			},
		],
	},
	{
		description: 'Homicide',
		offenses: [
			{
				offense: 'Attempted Murder',
				law: 'C-46',
				act: '239',
			},
			{
				offense: 'Manslaughter',
				law: 'C-46',
				act: '234',
			},
			{
				offense: 'Infanticide',
				law: 'C-46',
				act: '233',
			},
			{
				offense: 'Murder',
				law: 'C-46',
				act: '229',
			},
		],
	},
	{
		description: 'Motor Vehicle Offenses',
		offenses: [
			{
				offense: 'Dangerous Operation of a Motor Vehicle',
				law: 'C-46',
				act: '320.13',
				subsection: '(1)',
			},
			{
				offense: 'Operation of Motor Vehicle causing bodily harm',
				law: 'C-46',
				act: '320.13',
				subsection: '(2)',
			},
			{
				offense: 'Operation of Motor Vehicle causing death',
				law: 'C-46',
				act: '320.13',
				subsection: '(3)',
			},
			{
				offense: 'Failure or refusal to comply with demand',
				law: 'C-46',
				act: '320.15',
			},
			{
				offense: 'Failure to stop after accident',
				law: 'C-46',
				act: '320.16',
			},
		],
	},
	{
		description: 'Offenses of Violence',
		offenses: [
			{
				offense: 'Abduction of person under age of 16',
				law: 'C-46',
				act: '280',
			},
			{
				offense: 'Abduction of person under age of 14',
				law: 'C-46',
				act: '281',
			},
			{
				offense: 'Abduction in contravention of custody or parenting order',
				law: 'C-46',
				act: '282',
			},
			{
				offense: 'Abduction',
				law: 'C-46',
				act: '283',
			},
			{
				offense: 'Administering a Noxious Substance',
				law: 'C-46',
				act: '245',
			},
			{
				offense: 'Injuring or endangering other animals',
				law: 'C-46',
				act: '445',
			},
			{
				offense: 'Criminal Harassment',
				law: 'C-46',
				act: '264',
			},
			{
				offense: 'Causing death by criminal negligence',
				law: 'C-46',
				act: '220',
			},
			{
				offense: 'Extortion',
				law: 'C-46',
				act: '346',
			},
			{
				offense: 'Failing to Provide the Necessities of Life',
				law: 'C-46',
				act: '215',
			},
			{
				offense: 'Hostage Taking',
				law: 'C-46',
				act: '279.1',
			},
			{
				offense: 'Intimidation',
				law: 'C-46',
				act: '423',
			},
			{
				offense: 'Kidnapping and Unlawful Confinement',
				law: 'C-46',
				act: '279',
			},
			{
				offense: 'Overcoming resistance to commission of offence',
				law: 'C-46',
				act: '246',
			},
			{
				offense: 'Trafficking in Persons',
				law: 'C-46',
				act: '279.01',
			},
			{
				offense: 'Trafficking of a person under the age of eighteen years',
				law: 'C-46',
				act: '279.011',
			},
		],
	},
	{
		description: 'Property Offenses',
		offenses: [
			{
				offense: 'Arson',
				law: 'C-46',
				act: '434',
			},
			{
				offense: 'Criminal breach of trust',
				law: 'C-46',
				act: '336',
			},
			{
				offense:
					'Breaking and entering with intent, committing offence or breaking out',
				law: 'C-46',
				act: '348',
			},
			{
				offense: 'Making/Counterfeiting of currency',
				law: 'C-46',
				act: '449',
			},
			{
				offense: 'Possession, etc., of counterfeit money',
				law: 'C-46',
				act: '450',
			},
			{
				offense: 'Uttering, etc., counterfeit money',
				law: 'C-46',
				act: '452',
			},
			{
				offense: 'Fraudulent Concealment',
				law: 'C-46',
				act: '341',
			},
			{
				offense: 'Fraudulently obtaining food or accommodation',
				law: 'C-46',
				act: '364',
			},
			{
				offense: 'Identity Theft',
				law: 'C-46',
				act: '402.2',
			},
			{
				offense: 'Identity fraud',
				law: 'C-46',
				act: '403',
			},
			{
				offense: 'Motor Vehicle Theft',
				law: 'C-46',
				act: '333.1',
			},
			{
				offense: 'Obtaining Property by False Pretences',
				law: 'C-46',
				act: '362',
			},
			{
				offense: 'Possession of Break-in Instruments',
				law: 'C-46',
				act: '351',
			},
			{
				offense: 'Possession of Stolen Property',
				law: 'C-46',
				act: '355',
			},
			{
				offense: 'Robbery',
				law: 'C-46',
				act: '343',
			},
			{
				offense: 'Fraud in relation to fares, etc.',
				law: 'C-46',
				act: '393',
			},
			{
				offense: 'Theft and Forgery of a Credit Card',
				law: 'C-46',
				act: '342',
			},
			{
				offense: 'Unauthorized Use of Computer',
				law: 'C-46',
				act: '342.1',
			},
			{
				offense: 'Unlawfully in a Dwelling',
				law: 'C-46',
				act: '349',
			},
		],
	},
	{
		description: 'Sexual Offenses',
		offenses: [
			{
				offense: 'Aggravated Sexual Assault',
				law: 'C-46',
				act: '273',
			},
			{
				offense: 'Agree or Arrange a Sexual Offense Against Child',
				law: 'C-46',
				act: '172.2',
			},
			{
				offense: 'Bestiality',
				law: 'C-46',
				act: '160',
			},
			{
				offense: 'Child Luring',
				law: 'C-46',
				act: '172.1',
			},
			{
				offense: 'Production of Child Pornography',
				law: 'C-46',
				act: '163.1',
				subsection: '(2)',
			},
			{
				offense: 'Distribution of Child Pornography',
				law: 'C-46',
				act: '163.1',
				subsection: '(3)',
			},
			{
				offense: 'Possession of Child Pornography',
				law: 'C-46',
				act: '163.1',
				subsection: '(4)',
			},
			{
				offense: 'Access to Child Pornography',
				law: 'C-46',
				act: '163.1',
				subsection: '(4.1)',
			},
			{
				offense: 'Invitation to Sexual Touching',
				law: 'C-46',
				act: '152',
			},
			{
				offense: 'Keeping Common Bawdy-house',
				law: 'C-46',
				act: '210',
			},
			{
				offense: 'Making Sexual Explicit Materials Available to Child',
				law: 'C-46',
				act: '171.1',
			},
			{
				offense: 'Sexual Assault',
				law: 'C-46',
				act: '271',
			},
			{
				offense: 'Sexual Assault Causing Bodily Harm',
				law: 'C-46',
				act: '272',
			},
			{
				offense: 'Aggravated sexual assault',
				law: 'C-46',
				act: '273',
			},
			{
				offense: 'Sexual Exploitation',
				law: 'C-46',
				act: '153',
			},
			{
				offense: 'Sexual Interference',
				law: 'C-46',
				act: '151',
			},
			{
				offense: 'Voyeurism',
				law: 'C-46',
				act: '162',
			},
		],
	},
	{
		description: 'Weapons Offenses',
		offenses: [
			{
				offense: 'Carrying a Concealed Weapon',
				law: 'C-46',
				act: '90',
			},
			{
				offense: 'Discharging firearm with intent',
				law: 'C-46',
				act: '244',
			},
			{
				offense: 'Causing bodily harm with intent — air gun or pistol',
				law: 'C-46',
				act: '244.1',
			},
			{
				offense: 'Discharging firearm — recklessness',
				law: 'C-46',
				act: '244.2',
			},
			{
				offense: 'Pointing a Firearm',
				law: 'C-46',
				act: '87',
			},
			{
				offense: 'Possession for purpose of weapons trafficking',
				law: 'C-46',
				act: '100',
			},
			{
				offense: 'Possession of a Restricted or Prohibited Firearm',
				law: 'C-46',
				act: '95',
			},
			{
				offense: 'Possession of a Weapon Contrary to an Order',
				law: 'C-46',
				act: '117.01',
			},
			{
				offense: 'Possession of a Weapon for a Dangerous Purpose',
				law: 'C-46',
				act: '88',
			},
			{
				offense: 'Possession of firearm knowing its possession is unauthorized',
				law: 'C-46',
				act: '92',
			},
			{
				offense: 'Transfer of weapons without authority',
				law: 'C-46',
				act: '101',
			},
			{
				offense: 'Unauthorized Possession of a Firearm',
				law: 'C-46',
				act: '91',
			},
			{
				offense: 'Careless use of firearm, etc.',
				law: 'C-46',
				act: '86',
			},
			{
				offense: 'Use of Firearm in Commission of an Offense',
				law: 'C-46',
				act: '85',
			},
			{
				offense: 'Weapons Trafficking',
				law: 'C-46',
				act: '99',
			},
		],
	},
	{
		description: 'Gaming and Betting',
		offenses: [
			{
				offense: 'Keeping Common Gaming or Betting House',
				law: 'C-46',
				act: '201',
			},
			{
				offense: 'Betting, Pool-Selling, Book-Making, etc.',
				law: 'C-46',
				act: '202',
			},
		],
	},
	{
		description: 'Forgery and Offences Resembling Forgery',
		offenses: [
			{
				offense: 'Forgery',
				law: 'C-46',
				act: '366',
			},
			{
				offense: 'Use, trafficking or possession of forged document',
				law: 'C-46',
				act: '368',
			},
			{
				offense: 'Exchequer bill paper, public seals, etc.',
				law: 'C-46',
				act: '369',
			},
			{
				offense: 'False information',
				law: 'C-46',
				act: '372',
			},
			{
				offense: 'Drawing document without authority, etc.',
				law: 'C-46',
				act: '374',
			},
			{
				offense: 'Obtaining, etc., by instrument based on forced documents',
				law: 'C-46',
				act: '375',
			},
			{
				offense: 'Counterfeiting stamp, etc.',
				law: 'C-46',
				act: '376',
			},
			{
				offense: 'Damaging documents',
				law: 'C-46',
				act: '377',
			},
			{
				offense: 'Offences in relation to registers',
				law: 'C-46',
				act: '378',
			},
		],
	},
	{
		description: 'Attempts, Conspiracies and Accessories',
		offenses: [
			{
				offense: 'Attempts, accessories',
				law: 'C-46',
				act: '463',
			},
			{
				offense: 'Counselling offence that is not committed',
				law: 'C-46',
				act: '464',
			},
			{
				offense: 'Conspiracy',
				law: 'C-46',
				act: '465',
			},
			{
				offense: 'Conspiracy in restraint of trade',
				law: 'C-46',
				act: '466',
			},
			{
				offense: 'Saving',
				law: 'C-46',
				act: '467',
			},
		],
	},
];

const sampleBgObject = {
	is_over_18: true,
	is_policy_accepted: true,
	is_newsletter: true,
	is_biometric_consent: false,
	address: ['b417d760-9a6b-4c28-a11f-90ba52684052'],
	crjmrc: ['6d699095-69c3-4653-a0d4-78df54762c6a'],
	veriff_id: 'fjeoiwjjo',
};

export async function updateBgObject(
	uuid: string,
	data: { default: true } & Partial<typeof sampleBgObject>
) {
	return await Api.patch(`api/internal-bgcheck/${uuid}`, data);
}

const sampleChargesObject = {
	count: 1,
	next: null,
	previous: null,
	results: [
		{
			uuid: 'c44b0260-4725-4ea5-8130-8cbc99079268',
			created_at: '2023-09-25T13:08:31Z',
			updated_at: '2023-09-25T13:08:57.659796Z',
			json: [
				{
					offenses: [
						{
							act: '268',
							law: 'C-46',
							offense: 'Aggravated Assault',
						},
						{
							act: '267',
							law: 'C-46',
							offense: 'Assault with a weapon or causing bodily harm',
						},
						{
							act: '145',
							law: 'C-46',
							offense: 'Escape and being at large without excuse',
							subsection: '(1)',
						},
						{
							act: '145',
							law: 'C-46',
							offense: 'Failure to attend court or surrender',
							subsection: '(2)',
						},
						{
							act: '145',
							law: 'C-46',
							offense: 'Failure to comply with appearance notice or summons',
							subsection: '(3)',
						},
						{
							act: '145',
							law: 'C-46',
							offense: 'Failure to comply with undertaking',
							subsection: '(4)',
						},
						{
							act: '145',
							law: 'C-46',
							offense: 'Failure to comply with order',
							subsection: '(5)',
						},
						{
							act: '266',
							law: 'C-46',
							offense: 'Assault',
						},
						{
							act: '4',
							law: '19',
							offense: 'Possession of substance',
							subsection: '(1)',
						},
						{
							act: '380',
							law: 'C-46',
							offense: 'Fraud',
						},
						{
							act: '320.14',
							law: 'C-46',
							offense: 'Operation/Driving while impaired',
							subsection: '(1)',
						},
						{
							act: '430',
							law: 'C-46',
							offense: 'Mischief',
						},
						{
							act: '334',
							law: 'C-46',
							offense: 'Theft Over $5,000',
							paragraph: 'a)',
						},
						{
							act: '334',
							law: 'C-46',
							offense: 'Theft Under $5,000',
							paragraph: 'b)',
						},
						{
							act: '264.1',
							law: 'C-46',
							offense: 'Uttering Threats',
						},
					],
					description: 'Common Offenses',
				},
				{
					offenses: [
						{
							act: '122',
							law: 'C-46',
							offense: 'Breach of trust by public officer',
						},
						{
							act: '270',
							law: 'C-46',
							offense: 'Assaulting a peace officer',
						},
						{
							act: '270.01',
							law: 'C-46',
							offense:
								'Assaulting peace officer with weapon or causing bodily harm',
						},
						{
							act: '127',
							law: 'C-46',
							offense: 'Disobeying a Court Order',
						},
						{
							act: '137',
							law: 'C-46',
							offense: 'Fabricating Evidence',
						},
						{
							act: '423.1',
							law: 'C-46',
							offense:
								'Intimidation of a justice system participant or a journalist',
						},
						{
							act: '139',
							law: 'C-46',
							offense: 'Obstructing Justice',
						},
						{
							act: '129',
							law: 'C-46',
							offense: 'Offences relating to public or peace officer',
						},
						{
							act: '131',
							law: 'C-46',
							offense: 'Perjury',
						},
						{
							act: '144',
							law: 'C-46',
							offense: 'Prison Breach',
						},
						{
							act: '140',
							law: 'C-46',
							offense: 'Public Mischief',
						},
					],
					description: 'Administration of Justice Offenses',
				},
				{
					offenses: [
						{
							act: '119',
							law: 'C-46',
							offense: 'Bribery of judicial officers, etc.',
							subsection: '(1)',
						},
						{
							act: '119',
							law: 'C-46',
							offense: 'Consent of Attorney General',
							subsection: '(2)',
						},
						{
							act: '120',
							law: 'C-46',
							offense: 'Bribery of officers',
						},
						{
							act: '121',
							law: 'C-46',
							offense: 'Frauds on the Government',
							subsection: '(1)',
						},
						{
							act: '121',
							law: 'C-46',
							offense: 'Contractor subscribing to election fund',
							subsection: '(2)',
						},
					],
					description: 'Corruption Offenses',
				},
				{
					offenses: [
						{
							act: '175',
							law: 'C-46',
							offense:
								'Causing disturbance, indecent exhibition, loitering, etc.',
						},
						{
							act: '173',
							law: 'C-46',
							offense: 'Indecent Act',
							subsection: '(1)',
						},
						{
							act: '173',
							law: 'C-46',
							offense: 'Exposure',
							subsection: '(2)',
						},
						{
							act: '177',
							law: 'C-46',
							offense: 'Trespassing at Night',
						},
						{
							act: '63',
							law: 'C-46',
							offense: 'Unlawful Assembly',
						},
						{
							act: '64',
							law: 'C-46',
							offense: 'Riot',
						},
					],
					description: 'Disorderly Conduct',
				},
				{
					offenses: [
						{
							act: '4',
							law: '19',
							offense: 'Drug/Substance Possession',
							subsection: '(1)',
						},
						{
							act: '4',
							law: '19',
							offense: 'Obtaining substance',
							subsection: '(2)',
						},
						{
							act: '7',
							law: '19',
							offense: 'Production of drug/substance',
						},
						{
							act: '5',
							law: '19',
							offense: 'Drug/Substance Trafficking',
						},
						{
							act: '6',
							law: '19',
							offense: 'Importing and Exporting Drugs',
							subsection: '(1)',
						},
						{
							act: '6',
							law: '19',
							offense: 'Drug/Substance possession for the purpose of exporting',
							subsection: '(2)',
						},
					],
					description: 'Drug Offenses',
				},
				{
					offenses: [
						{
							act: '300',
							law: 'C-46',
							offense: 'Defamatory Libel',
						},
						{
							act: '319',
							law: 'C-46',
							offense: 'Public Incitement of Hatred',
							subsection: '(1)',
						},
						{
							act: '319',
							law: 'C-46',
							offense: 'Wilful promotion of hatred',
							subsection: '(2)',
						},
					],
					description: 'Hate Speech and Libel',
				},
				{
					offenses: [
						{
							act: '239',
							law: 'C-46',
							offense: 'Attempted Murder',
						},
						{
							act: '234',
							law: 'C-46',
							offense: 'Manslaughter',
						},
						{
							act: '233',
							law: 'C-46',
							offense: 'Infanticide',
						},
						{
							act: '229',
							law: 'C-46',
							offense: 'Murder',
						},
					],
					description: 'Homicide',
				},
				{
					offenses: [
						{
							act: '320.13',
							law: 'C-46',
							offense: 'Dangerous Operation of a Motor Vehicle',
							subsection: '(1)',
						},
						{
							act: '320.13',
							law: 'C-46',
							offense: 'Operation of Motor Vehicle causing bodily harm',
							subsection: '(2)',
						},
						{
							act: '320.13',
							law: 'C-46',
							offense: 'Operation of Motor Vehicle causing death',
							subsection: '(3)',
						},
						{
							act: '320.15',
							law: 'C-46',
							offense: 'Failure or refusal to comply with demand',
						},
						{
							act: '320.16',
							law: 'C-46',
							offense: 'Failure to stop after accident',
						},
					],
					description: 'Motor Vehicle Offenses',
				},
				{
					offenses: [
						{
							act: '280',
							law: 'C-46',
							offense: 'Abduction of person under age of 16',
						},
						{
							act: '281',
							law: 'C-46',
							offense: 'Abduction of person under age of 14',
						},
						{
							act: '282',
							law: 'C-46',
							offense:
								'Abduction in contravention of custody or parenting order',
						},
						{
							act: '283',
							law: 'C-46',
							offense: 'Abduction',
						},
						{
							act: '245',
							law: 'C-46',
							offense: 'Administering a Noxious Substance',
						},
						{
							act: '445',
							law: 'C-46',
							offense: 'Injuring or endangering other animals',
						},
						{
							act: '264',
							law: 'C-46',
							offense: 'Criminal Harassment',
						},
						{
							act: '220',
							law: 'C-46',
							offense: 'Causing death by criminal negligence',
						},
						{
							act: '346',
							law: 'C-46',
							offense: 'Extortion',
						},
						{
							act: '215',
							law: 'C-46',
							offense: 'Failing to Provide the Necessities of Life',
						},
						{
							act: '279.1',
							law: 'C-46',
							offense: 'Hostage Taking',
						},
						{
							act: '423',
							law: 'C-46',
							offense: 'Intimidation',
						},
						{
							act: '279',
							law: 'C-46',
							offense: 'Kidnapping and Unlawful Confinement',
						},
						{
							act: '246',
							law: 'C-46',
							offense: 'Overcoming resistance to commission of offence',
						},
						{
							act: '279.01',
							law: 'C-46',
							offense: 'Trafficking in Persons',
						},
						{
							act: '279.011',
							law: 'C-46',
							offense:
								'Trafficking of a person under the age of eighteen years',
						},
					],
					description: 'Offenses of Violence',
				},
				{
					offenses: [
						{
							act: '434',
							law: 'C-46',
							offense: 'Arson',
						},
						{
							act: '336',
							law: 'C-46',
							offense: 'Criminal breach of trust',
						},
						{
							act: '348',
							law: 'C-46',
							offense:
								'Breaking and entering with intent, committing offence or breaking out',
						},
						{
							act: '449',
							law: 'C-46',
							offense: 'Making/Counterfeiting of currency',
						},
						{
							act: '450',
							law: 'C-46',
							offense: 'Possession, etc., of counterfeit money',
						},
						{
							act: '452',
							law: 'C-46',
							offense: 'Uttering, etc., counterfeit money',
						},
						{
							act: '341',
							law: 'C-46',
							offense: 'Fraudulent Concealment',
						},
						{
							act: '364',
							law: 'C-46',
							offense: 'Fraudulently obtaining food or accommodation',
						},
						{
							act: '402.2',
							law: 'C-46',
							offense: 'Identity Theft',
						},
						{
							act: '403',
							law: 'C-46',
							offense: 'Identity fraud',
						},
						{
							act: '333.1',
							law: 'C-46',
							offense: 'Motor Vehicle Theft',
						},
						{
							act: '362',
							law: 'C-46',
							offense: 'Obtaining Property by False Pretences',
						},
						{
							act: '351',
							law: 'C-46',
							offense: 'Possession of Break-in Instruments',
						},
						{
							act: '355',
							law: 'C-46',
							offense: 'Possession of Stolen Property',
						},
						{
							act: '343',
							law: 'C-46',
							offense: 'Robbery',
						},
						{
							act: '393',
							law: 'C-46',
							offense: 'Fraud in relation to fares, etc.',
						},
						{
							act: '342',
							law: 'C-46',
							offense: 'Theft and Forgery of a Credit Card',
						},
						{
							act: '342.1',
							law: 'C-46',
							offense: 'Unauthorized Use of Computer',
						},
						{
							act: '349',
							law: 'C-46',
							offense: 'Unlawfully in a Dwelling',
						},
					],
					description: 'Property Offenses',
				},
				{
					offenses: [
						{
							act: '273',
							law: 'C-46',
							offense: 'Aggravated Sexual Assault',
						},
						{
							act: '172.2',
							law: 'C-46',
							offense: 'Agree or Arrange a Sexual Offense Against Child',
						},
						{
							act: '160',
							law: 'C-46',
							offense: 'Bestiality',
						},
						{
							act: '172.1',
							law: 'C-46',
							offense: 'Child Luring',
						},
						{
							act: '163.1',
							law: 'C-46',
							offense: 'Production of Child Pornography',
							subsection: '(2)',
						},
						{
							act: '163.1',
							law: 'C-46',
							offense: 'Distribution of Child Pornography',
							subsection: '(3)',
						},
						{
							act: '163.1',
							law: 'C-46',
							offense: 'Possession of Child Pornography',
							subsection: '(4)',
						},
						{
							act: '163.1',
							law: 'C-46',
							offense: 'Access to Child Pornography',
							subsection: '(4.1)',
						},
						{
							act: '152',
							law: 'C-46',
							offense: 'Invitation to Sexual Touching',
						},
						{
							act: '210',
							law: 'C-46',
							offense: 'Keeping Common Bawdy-house',
						},
						{
							act: '171.1',
							law: 'C-46',
							offense: 'Making Sexual Explicit Materials Available to Child',
						},
						{
							act: '271',
							law: 'C-46',
							offense: 'Sexual Assault',
						},
						{
							act: '272',
							law: 'C-46',
							offense: 'Sexual Assault Causing Bodily Harm',
						},
						{
							act: '273',
							law: 'C-46',
							offense: 'Aggravated sexual assault',
						},
						{
							act: '153',
							law: 'C-46',
							offense: 'Sexual Exploitation',
						},
						{
							act: '151',
							law: 'C-46',
							offense: 'Sexual Interference',
						},
						{
							act: '162',
							law: 'C-46',
							offense: 'Voyeurism',
						},
					],
					description: 'Sexual Offenses',
				},
				{
					offenses: [
						{
							act: '90',
							law: 'C-46',
							offense: 'Carrying a Concealed Weapon',
						},
						{
							act: '244',
							law: 'C-46',
							offense: 'Discharging firearm with intent',
						},
						{
							act: '244.1',
							law: 'C-46',
							offense: 'Causing bodily harm with intent — air gun or pistol',
						},
						{
							act: '244.2',
							law: 'C-46',
							offense: 'Discharging firearm — recklessness',
						},
						{
							act: '87',
							law: 'C-46',
							offense: 'Pointing a Firearm',
						},
						{
							act: '100',
							law: 'C-46',
							offense: 'Possession for purpose of weapons trafficking',
						},
						{
							act: '95',
							law: 'C-46',
							offense: 'Possession of a Restricted or Prohibited Firearm',
						},
						{
							act: '117.01',
							law: 'C-46',
							offense: 'Possession of a Weapon Contrary to an Order',
						},
						{
							act: '88',
							law: 'C-46',
							offense: 'Possession of a Weapon for a Dangerous Purpose',
						},
						{
							act: '92',
							law: 'C-46',
							offense:
								'Possession of firearm knowing its possession is unauthorized',
						},
						{
							act: '101',
							law: 'C-46',
							offense: 'Transfer of weapons without authority',
						},
						{
							act: '91',
							law: 'C-46',
							offense: 'Unauthorized Possession of a Firearm',
						},
						{
							act: '86',
							law: 'C-46',
							offense: 'Careless use of firearm, etc.',
						},
						{
							act: '85',
							law: 'C-46',
							offense: 'Use of Firearm in Commission of an Offense',
						},
						{
							act: '99',
							law: 'C-46',
							offense: 'Weapons Trafficking',
						},
					],
					description: 'Weapons Offenses',
				},
				{
					offenses: [
						{
							act: '201',
							law: 'C-46',
							offense: 'Keeping Common Gaming or Betting House',
						},
						{
							act: '202',
							law: 'C-46',
							offense: 'Betting, Pool-Selling, Book-Making, etc.',
						},
					],
					description: 'Gaming and Betting',
				},
				{
					offenses: [
						{
							act: '366',
							law: 'C-46',
							offense: 'Forgery',
						},
						{
							act: '368',
							law: 'C-46',
							offense: 'Use, trafficking or possession of forged document',
						},
						{
							act: '369',
							law: 'C-46',
							offense: 'Exchequer bill paper, public seals, etc.',
						},
						{
							act: '372',
							law: 'C-46',
							offense: 'False information',
						},
						{
							act: '374',
							law: 'C-46',
							offense: 'Drawing document without authority, etc.',
						},
						{
							act: '375',
							law: 'C-46',
							offense:
								'Obtaining, etc., by instrument based on forced documents',
						},
						{
							act: '376',
							law: 'C-46',
							offense: 'Counterfeiting stamp, etc.',
						},
						{
							act: '377',
							law: 'C-46',
							offense: 'Damaging documents',
						},
						{
							act: '378',
							law: 'C-46',
							offense: 'Offences in relation to registers',
						},
					],
					description: 'Forgery and Offences Resembling Forgery',
				},
				{
					offenses: [
						{
							act: '463',
							law: 'C-46',
							offense: 'Attempts, accessories',
						},
						{
							act: '464',
							law: 'C-46',
							offense: 'Counselling offence that is not committed',
						},
						{
							act: '465',
							law: 'C-46',
							offense: 'Conspiracy',
						},
						{
							act: '466',
							law: 'C-46',
							offense: 'Conspiracy in restraint of trade',
						},
						{
							act: '467',
							law: 'C-46',
							offense: 'Saving',
						},
					],
					description: 'Attempts, Conspiracies and Accessories',
				},
			],
		},
	],
};

export function useGetCharges() {
	return useQuery({
		queryKey: ['charges'],
		queryFn: async () => {
			const result = (await Api.get<typeof sampleChargesObject>('api/charges'))
				.data.results[0].json;
			const offenses = result.map(v => v.offenses);
			const offenseNames = offenses.flatMap(v => v.flatMap(val => val.offense));
			return offenseNames;
		},
	});
}

const sampleNewCjmrcData = {
	offence: 'test',
	year_of_conviction: '2018',
	location: 'Noida',
	sentence: 'sentence',
};

export type CjmrcEntity = typeof sampleNewCjmrcData & { uuid: string };

export async function addNewCjmrc(data: typeof sampleNewCjmrcData) {
	return (
		await Api.post<NewCjmrcResponse>('api/criminal-and-judicial-check', data)
	).data;
}

export async function deleteCjmrc(uuid: string) {
	return await Api.delete(`api/criminal-and-judicial-check/${uuid}`);
}

const sampleNewCjmrcDataResponse = {
	uuid: '39a951c3-6d92-4cd4-aadb-b21bfd47621e',
	created_at: '2023-10-17T12:08:44.856068Z',
	updated_at: '2023-10-17T12:08:44.876996Z',
	offence: 'Theft Under $5,000',
	year_of_conviction: 32,
	location: 'ewf',
	sentence: 'jiofew',
};

export type NewCjmrcResponse = typeof sampleNewCjmrcDataResponse;

export async function getNewCjmrc(uuid: string) {
	return await Api.get<NewCjmrcResponse>(
		`api/criminal-and-judicial-check/${uuid}`
	);
}

export async function getNewAddress(uuid: string) {
	return await Api.get<NewSampleAddress>(`api/addressHistory/${uuid}`);
}

const samplePreviewResponse = {
	uuid: 'c01e9c55-8bc5-4e6f-8a6d-7ea9521b74d6',
	created_at: '2023-10-19T08:30:41.908330Z',
	updated_at: '2023-10-19T08:58:13.063665Z',
	is_criminal_and_judicial_check: true,
	state: 'CRJMC',
	lead_source: 'DASHBOARD',
	active: true,
	is_over_18: true,
	is_policy_accepted: true,
	is_newsletter: true,
	is_biometric_consent: true,
	is_price: true,
	price: 45,
	discount: 0,
	preview: null,
	personal: {
		uuid: '5ffaa732-a74c-4337-b532-92c2e4a23cfd',
		created_at: '2023-10-19T08:31:06.578418Z',
		updated_at: '2023-10-19T08:31:06.578825Z',
		first_name: 'mehfouz',
		middle_name: 'jiofj',
		last_name: 'jalal',
		email: 'hasan.arshad18@gmail.com',
		city: 'Buffalo',
		country: 'India',
		birth_last_name: 'few',
		other_name: 'fewfew',
		sex: 'MALE',
		dob: '2023-10-15T00:00:00Z',
		phone: '+32 3232323232',
		is_email_allowed: true,
	},
	address: [
		{
			uuid: '994d73c2-218b-4e4b-9115-18d0b5eed74b',
			created_at: '2023-10-19T08:42:31.107317Z',
			updated_at: '2023-10-19T08:42:31.123360Z',
			country: 'canada',
			street_number: '32',
			street_name: 'fewij',
			apt_or_unit: 'ijfeiwj',
			city: 'jifoej',
			province: 'ca',
			postal_name: '3232',
			date_moved_in: '2222-02-22',
		},
	],
	cjmrc: [
		{
			uuid: 'e1b5eb35-e1f3-4e47-8e90-e3b90fba67c2',
			created_at: '2023-10-19T08:43:12.174511Z',
			updated_at: '2023-10-19T08:43:12.194165Z',
			offence: 'Fabricating Evidence',
			year_of_conviction: 232,
			location: 'ewfae',
			sentence: 'fwafeaw',
		},
	],
};

export type PreviewResponse = typeof samplePreviewResponse;

export async function getPreview(uuid: string) {
	return await Api.get<typeof samplePreviewResponse>(
		`api/internal-bgcheck/preview/${uuid}`
	);
}
const previewGetResponse = {
	uuid: '',
	created_at: '',
	updated_at: '',
	is_term_accpeted: true,
	signature: '',
	signatureBase64: '',
};

export type PreviewGetResponse = typeof previewGetResponse;

export async function getPreview2(uuid: string) {
	return await Api.get<PreviewGetResponse>(`/api/preview/${uuid}`);
}

const payments = {
	uuid: '7317277b-00df-4020-affa-71ee40f664fa',
	created_at: '2023-04-04T11:45:14.077841Z',
	updated_at: '2023-04-04T11:45:14.078028Z',
	name: 'Canadian Criminal Record Check',
	value: 'request_criminal_record_check',
	description:
		'A Canadian police information check includes a search of the Canadian Police Information Centre (“CPIC”) database and locally held police information centres for: charges, warrants, peace bonds, prohibition orders, release conditions, probation orders, summary convictions, recent convictions not yet registered in the national repository.',
	is_active: true,
	priority: 0,
	price: 45,
	discount: 0,
	hst: 0,
};

export type PaymentDetails = typeof payments;

export async function getPrice(uuid: string) {
	return await Api.get<typeof payments>(
		`api/internal-bgcheck/get-price/${uuid}`
	);
}

export async function updatePreview(
	data: typeof samplePreviewDetails,
	uuid: string
) {
	const formData = new FormData();
	for (let key of Object.keys(data)) {
		formData.set(key, (data as any)[key]);
	}

	return await Api.patch<PreviewGetResponse>(`/api/preview/${uuid}`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
}

const previewMinReference = {
	min_reference: 6,
};

export async function getMinReference(uuid: string) {
	return await Api.get<typeof previewMinReference>(
		`/api/get-min-reference/${uuid}`
	);
}

const userallowedflags = {
	flags: ['min'],
};

export function getUserFlags() {
	return Api.get<typeof userallowedflags>(`/api/user-flag`);
}

const sampleStripeReferencesData = {
	count: 1,
	next: null,
	previous: null,
	results: [
		{
			uuid: '34c497d9-57df-481e-8a84-d2af13f685d0',
			created_at: '2024-03-30T17:38:33Z',
			updated_at: '2024-04-08T13:25:11.755418Z',
			product_id: 'prod_PplOyPhSwGH1lX',
			name: 'Reference Check',
			default_price: 9,
		},
	],
};

type StripeReference = typeof sampleStripeReferencesData;

export async function getStripeReferences() {
	return (await Api.get<StripeReference>(`/api/stripe-reference`)).data;
}

export async function getClientPrices(uuid: string) {
	return (await Api.get<Array<Price>>(`/api/checks-pricing/${uuid}`)).data;
}

export type Price = (typeof samplePrices)[number];

const samplePrices = [
	{
		uuid: '53163110-7c95-490a-aa76-1fdf23f35785',
		created_at: '2024-04-09T19:34:06.102391Z',
		updated_at: '2024-04-09T19:34:06.102597Z',
		price: 5,
		discount: 0,
		hst: 0,
		default: false,
		price_id: 'price_1P3kQjEtc8e5NDeAR1a9QQBR',
		CheckType: '7317277b-00df-4020-affa-71ee40f664fa',
		client: '6e9923a5-864e-4dba-a7fe-d2d5011a9609',
	},
	{
		uuid: 'c829a118-d4b3-41b4-b5c2-1573f1dd809a',
		created_at: '2024-04-10T08:27:15.722147Z',
		updated_at: '2024-04-12T11:40:40.436893Z',
		price: 99,
		price_id: 'price_1P4iTEEtc8e5NDeAg2sPlD92',
		discount: 0,
		hst: 0,
		default: false,
		client: '6e9923a5-864e-4dba-a7fe-d2d5011a9609',
		type: '34c497d9-57df-481e-8a84-d2af13f685d0',
	},
];

export async function getAllowedCheckType() {
	const response = await Api.get<CheckTypeApiResponse>(
		`/api/get-checks-allowed`
	);
	return response.data;
}
