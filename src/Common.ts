/* eslint-disable @tanstack/query/exhaustive-deps */
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import axios from 'axios';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import {
	checkJobHistoryArchive,
	checkRequestArchiveStatus,
	getAllQuestions,
	getBuckets,
	getCandidatesList,
	getCandidatesListPaginated,
	getClientAdminQuestionnaires,
	getCompetencies,
	getIndustries,
	getIP,
	getISPDetails,
	getJobHistory,
	getLeadInfo,
	getQuestionnaires,
	getQuestionsByBucketType,
	getRefereeDetails2,
	getReport,
	getReportHTML,
} from './apis/user.api';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Tabs } from './apis/types';
import { Bucket, Competency, Industry } from './apis/types/user-api-types';
import { deleteClientObject } from './apis/auth.api';
import {
	deleteEmailTemplate,
	getEmailTypes,
	getEmailsForClient,
	postPreviewEmail,
	saveEmailTemplate,
	updateClient,
} from './apis/super_admin.api';
import { useSuperAdminContext } from './contexts/SuperAdminContext';

export const detectBrowser = () => {
	if (
		(navigator.userAgent.indexOf('Opera') ||
			navigator.userAgent.indexOf('OPR')) !== -1
	) {
		return 'Opera';
	} else if (navigator.userAgent.indexOf('Chrome') !== -1) {
		return 'Chrome';
	} else if (navigator.userAgent.indexOf('Safari') !== -1) {
		return 'Safari';
	} else if (navigator.userAgent.indexOf('Firefox') !== -1) {
		return 'Firefox';
	} else if (
		navigator.userAgent.indexOf('MSIE') !== -1 ||
		!!(document as any).documentMode === true
	) {
		return 'IE';
	} else {
		return 'Unknown';
	}
};

export const getGeoInfo = () => {
	axios
		.get('https://geolocation-db.com/json/')
		.then(response => {
			const datas = response.data;
			localStorage.setItem('countryCode', datas.country_code);
			localStorage.setItem('cityName', datas.city);
			localStorage.setItem('countryName', datas.country_name);
		})
		.catch(error => {
			console.log(error);
		});
};

export const getDate = (arg?: any, format?: string) => {
	let d = new Date();
	if (arg) {
		d = new Date(arg);
	}
	let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
	let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
	let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
	if (format === 'mmddyyyy') {
		return month + '-' + day + '-' + year;
	} else if (format === 'ddmmyyyy') {
		return day + '-' + month + '-' + year;
	}
	return year + '-' + month + '-' + day;
};

export const sortByDate = (temp1: any) => {
	temp1.sort((a: any, b: any) => {
		let date1 = new Date(a.created_at);
		let date2 = new Date(b.created_at);
		return date1 < date2 ? 1 : -1;
	});
};

/**
 *
 * @param {string} key
 * @param {*} defaultValue
 * @returns
 */
export function useLocalStorageHook<T = any>(key: any, defaultValue: T) {
	const [value, setValue] = useState<T>(() => {
		const item = localStorage.getItem(key);
		try {
			if (!!item) {
				return JSON.parse(item);
			}
			return defaultValue as T;
		} catch {
			return defaultValue as T;
		}
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
		setValue(value);
	}, [key, value]);

	const clearValue = useCallback(() => {
		localStorage.removeItem(key);
	}, [key]);

	const setValueHelper = useCallback(
		(val: T) => {
			localStorage.setItem(key, JSON.stringify(val));
			return setValue(val);
		},
		[key]
	);

	return React.useMemo(
		() => [value, setValue, clearValue, setValueHelper] as const,
		[clearValue, setValueHelper, value]
	);
}

const debounce = (fn: any, delay: any) => {
	let timer: any = null;
	return (...args: any) => {
		window.clearTimeout(timer);
		timer = setTimeout(() => {
			fn(...args);
		}, delay);
	};
};

export const useDebounce = (callback: any, delay: any) => {
	const callbackRef = useRef(callback);
	useLayoutEffect(() => {
		callbackRef.current = callback;
	});
	return useMemo(
		() => debounce((...args: any) => callbackRef.current(...args), delay),
		[delay]
	);
};
/**
 * Synchronous pause function (Do not use as this blocks the main thread)
 * @param {number} delay Time in milliseconds to pause code execution
 */
export const sleep = (delay: any) => {
	const done = Date.now() + delay;
	while (done > Date.now()) {
		//...sleep
	}
};

/**
 * Promisified setTimeout function to asynchronously pause execution inside async code blocks
 * @param {number} delay Time in milliseconds to pause code execution
 */
export const asyncSetTimeout = (delay: any) => {
	return new Promise(resolve => setTimeout(() => resolve('done'), delay));
};

export const useQuestionnaires = () => {
	const { pathname } = useLocation();
	return useQuery({
		queryKey: ['questionnaires'],
		queryFn: async () => {
			let result;
			if (pathname.includes('admin')) {
				result = await getClientAdminQuestionnaires();
			} else {
				result = await getQuestionnaires();
			}
			if (!result || result.length === 0) {
				return [];
			}
			sortByDate(result);
			const resultsWithoutTimesUsed = result?.map(newVal => {
				if (newVal?.questionnaire_title === 'default_questionnaire') {
					newVal.questionnaire_title = 'Default Questionnaire';
				}
				return newVal;
			});
			return resultsWithoutTimesUsed;
		},
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 60,
	});
};

export const useAllQuestions = () => {
	return useQuery({
		queryKey: ['questions'],
		queryFn: getAllQuestions,
		staleTime: 1000 * 60,
		retry: false,
	});
};

export const useOtherAuth = () => {
	const accessToken = Cookies.get('access');
	const { data } = useQuery({
		queryKey: [accessToken],
		queryFn: async () => {
			if (!accessToken) return {};
			const promises = [];
			const industries: Array<Industry> = [];
			const competencies: Array<Competency> = [];
			const moreCompetencies: Array<Competency> = [];
			const buckets: Array<Bucket> = [];
			promises.push(getIndustries(1));
			promises.push(getCompetencies(1));
			promises.push(getBuckets(1));
			const result = (await Promise.all(promises)) as any;
			result?.forEach((val: any, i: number) => {
				if (!val?.status) {
					if (i === 0) return val?.forEach((val: any) => industries.push(val));
					if (i === 1)
						return val?.forEach((val: any, i: number) => {
							i <= 10 ? competencies.push(val) : moreCompetencies.push(val);
						});
					if (i === 2) return val?.forEach((val: any) => buckets.push(val));
				}
			});

			const others = industries.filter(industry => industry.name === 'Other');
			const filteredIndustries = industries.filter(
				industry => industry.name !== 'Other'
			);
			filteredIndustries.push(others[0]);

			return {
				industryOptions: filteredIndustries,
				competencyOptions: competencies,
				moreCompetencyOptions: moreCompetencies,
				buckets,
			};
		},
		staleTime: 1000 * 60 * 60,
		enabled: !!accessToken,
	});
	return (
		data ?? {
			industryOptions: [],
			competencyOptions: [],
			moreCompetencyOptions: [],
			buckets: [],
		}
	);
};

export const useIP = () =>
	useQuery({
		queryKey: ['ipAddress'],
		queryFn: getIP,
		refetchOnWindowFocus: true,
		staleTime: 1000 * 60 * 5,
	});

export const useISP = () => {
	const { data: ipAddress } = useIP();
	return useQuery({
		queryKey: ['isp', ipAddress],
		queryFn: ({ queryKey, signal }) => getISPDetails?.(queryKey?.[1], signal),
		staleTime: 1000 * 60 * 5,
		enabled: !!ipAddress,
	});
};

export const useJobData = () => {
	const { id } = useParams() as any;
	return useQuery({
		queryKey: ['jobHistory', id],
		queryFn: ({ queryKey }) => getJobHistory(queryKey[1]),
		enabled: !!id,
		staleTime: 1000 * 60 * 5,
	});
};

export const useJobHistory = () => {
	const { data: jobData } = useJobData();
	return useQuery({
		queryKey: ['jobHistory', jobData],
		queryFn: async () => {
			const arr = [];
			if (jobData && typeof jobData[Symbol.iterator] === 'function') {
				for (let item of jobData) {
					let res = await getRefereeDetails2(item.refree);
					arr.push({ ...res.data, ...item });
					if (arr.length === jobData.length) {
						let emailArr: any = [];
						arr.forEach(item => {
							emailArr.push(item.refereeEmail);
						});
						localStorage.setItem('emailArr', emailArr.toString());
					}
				}
			}
			return arr;
		},
		enabled: !!jobData,
		staleTime: 1000 * 60 * 5,
	});
};

export const useCandidateName = () => {
	const { candidateName } = useParams() as { candidateName: string };
	const { data } = useQuery({
		queryKey: ['candidateName'],
		queryFn: () => candidateName,
		initialData: candidateName,
	});
	return data;
};

export const countryCodeMapping = {
	Afghanistan: 'AF',
	Albania: 'AL',
	Algeria: 'DZ',
	'American Samoa': 'AS',
	Andorra: 'AD',
	Angola: 'AO',
	Anguilla: 'AI',
	Antarctica: 'AQ',
	'Antigua and Barbuda': 'AG',
	Argentina: 'AR',
	Armenia: 'AM',
	Aruba: 'AW',
	Australia: 'AU',
	Austria: 'AT',
	Azerbaijan: 'AZ',
	'Bahamas (the)': 'BS',
	Bahrain: 'BH',
	Bangladesh: 'BD',
	Barbados: 'BB',
	Belarus: 'BY',
	Belgium: 'BE',
	Belize: 'BZ',
	Benin: 'BJ',
	Bermuda: 'BM',
	Bhutan: 'BT',
	'Bolivia (Plurinational State of)': 'BO',
	'Bonaire, Sint Eustatius and Saba': 'BQ',
	'Bosnia and Herzegovina': 'BA',
	Botswana: 'BW',
	'Bouvet Island': 'BV',
	Brazil: 'BR',
	'British Indian Ocean Territory (the)': 'IO',
	'Brunei Darussalam': 'BN',
	Bulgaria: 'BG',
	'Burkina Faso': 'BF',
	Burundi: 'BI',
	'Cabo Verde': 'CV',
	Cambodia: 'KH',
	Cameroon: 'CM',
	Canada: 'CA',
	'Cayman Islands (the)': 'KY',
	'Central African Republic (the)': 'CF',
	Chad: 'TD',
	Chile: 'CL',
	China: 'CN',
	'Christmas Island': 'CX',
	'Cocos (Keeling) Islands (the)': 'CC',
	Colombia: 'CO',
	'Comoros (the)': 'KM',
	'Congo (the Democratic Republic of the)': 'CD',
	'Congo (the)': 'CG',
	'Cook Islands (the)': 'CK',
	'Costa Rica': 'CR',
	Croatia: 'HR',
	Cuba: 'CU',
	Curaçao: 'CW',
	Cyprus: 'CY',
	Czechia: 'CZ',
	"Côte d'Ivoire": 'CI',
	Denmark: 'DK',
	Djibouti: 'DJ',
	Dominica: 'DM',
	'Dominican Republic (the)': 'DO',
	Ecuador: 'EC',
	Egypt: 'EG',
	'El Salvador': 'SV',
	'Equatorial Guinea': 'GQ',
	Eritrea: 'ER',
	Estonia: 'EE',
	Eswatini: 'SZ',
	Ethiopia: 'ET',
	'Falkland Islands (the) [Malvinas]': 'FK',
	'Faroe Islands (the)': 'FO',
	Fiji: 'FJ',
	Finland: 'FI',
	France: 'FR',
	'French Guiana': 'GF',
	'French Polynesia': 'PF',
	'French Southern Territories (the)': 'TF',
	Gabon: 'GA',
	'Gambia (the)': 'GM',
	Georgia: 'GE',
	Germany: 'DE',
	Ghana: 'GH',
	Gibraltar: 'GI',
	Greece: 'GR',
	Greenland: 'GL',
	Grenada: 'GD',
	Guadeloupe: 'GP',
	Guam: 'GU',
	Guatemala: 'GT',
	Guernsey: 'GG',
	Guinea: 'GN',
	'Guinea-Bissau': 'GW',
	Guyana: 'GY',
	Haiti: 'HT',
	'Heard Island and McDonald Islands': 'HM',
	'Holy See (the)': 'VA',
	Honduras: 'HN',
	'Hong Kong': 'HK',
	Hungary: 'HU',
	Iceland: 'IS',
	India: 'IN',
	Indonesia: 'ID',
	'Iran (Islamic Republic of)': 'IR',
	Iraq: 'IQ',
	Ireland: 'IE',
	'Isle of Man': 'IM',
	Israel: 'IL',
	Italy: 'IT',
	Jamaica: 'JM',
	Japan: 'JP',
	Jersey: 'JE',
	Jordan: 'JO',
	Kazakhstan: 'KZ',
	Kenya: 'KE',
	Kiribati: 'KI',
	"Korea (the Democratic People's Republic of)": 'KP',
	'Korea (the Republic of)': 'KR',
	Kuwait: 'KW',
	Kyrgyzstan: 'KG',
	"Lao People's Democratic Republic (the)": 'LA',
	Latvia: 'LV',
	Lebanon: 'LB',
	Lesotho: 'LS',
	Liberia: 'LR',
	Libya: 'LY',
	Liechtenstein: 'LI',
	Lithuania: 'LT',
	Luxembourg: 'LU',
	Macao: 'MO',
	Madagascar: 'MG',
	Malawi: 'MW',
	Malaysia: 'MY',
	Maldives: 'MV',
	Mali: 'ML',
	Malta: 'MT',
	'Marshall Islands (the)': 'MH',
	Martinique: 'MQ',
	Mauritania: 'MR',
	Mauritius: 'MU',
	Mayotte: 'YT',
	Mexico: 'MX',
	'Micronesia (Federated States of)': 'FM',
	'Moldova (the Republic of)': 'MD',
	Monaco: 'MC',
	Mongolia: 'MN',
	Montenegro: 'ME',
	Montserrat: 'MS',
	Morocco: 'MA',
	Mozambique: 'MZ',
	Myanmar: 'MM',
	Namibia: 'NA',
	Nauru: 'NR',
	Nepal: 'NP',
	'Netherlands (the)': 'NL',
	'New Caledonia': 'NC',
	'New Zealand': 'NZ',
	Nicaragua: 'NI',
	'Niger (the)': 'NE',
	Nigeria: 'NG',
	Niue: 'NU',
	'Norfolk Island': 'NF',
	'Northern Mariana Islands (the)': 'MP',
	Norway: 'NO',
	Oman: 'OM',
	Pakistan: 'PK',
	Palau: 'PW',
	'Palestine, State of': 'PS',
	Panama: 'PA',
	'Papua New Guinea': 'PG',
	Paraguay: 'PY',
	Peru: 'PE',
	'Philippines (the)': 'PH',
	Pitcairn: 'PN',
	Poland: 'PL',
	Portugal: 'PT',
	'Puerto Rico': 'PR',
	Qatar: 'QA',
	'Republic of North Macedonia': 'MK',
	Romania: 'RO',
	'Russian Federation (the)': 'RU',
	Rwanda: 'RW',
	Réunion: 'RE',
	'Saint Barthélemy': 'BL',
	'Saint Helena, Ascension and Tristan da Cunha': 'SH',
	'Saint Kitts and Nevis': 'KN',
	'Saint Lucia': 'LC',
	'Saint Martin (French part)': 'MF',
	'Saint Pierre and Miquelon': 'PM',
	'Saint Vincent and the Grenadines': 'VC',
	Samoa: 'WS',
	'San Marino': 'SM',
	'Sao Tome and Principe': 'ST',
	'Saudi Arabia': 'SA',
	Senegal: 'SN',
	Serbia: 'RS',
	Seychelles: 'SC',
	'Sierra Leone': 'SL',
	Singapore: 'SG',
	'Sint Maarten (Dutch part)': 'SX',
	Slovakia: 'SK',
	Slovenia: 'SI',
	'Solomon Islands': 'SB',
	Somalia: 'SO',
	'South Africa': 'ZA',
	'South Georgia and the South Sandwich Islands': 'GS',
	'South Sudan': 'SS',
	Spain: 'ES',
	'Sri Lanka': 'LK',
	'Sudan (the)': 'SD',
	Suriname: 'SR',
	'Svalbard and Jan Mayen': 'SJ',
	Sweden: 'SE',
	Switzerland: 'CH',
	'Syrian Arab Republic': 'SY',
	Taiwan: 'TW',
	Tajikistan: 'TJ',
	'Tanzania, United Republic of': 'TZ',
	Thailand: 'TH',
	'Timor-Leste': 'TL',
	Togo: 'TG',
	Tokelau: 'TK',
	Tonga: 'TO',
	'Trinidad and Tobago': 'TT',
	Tunisia: 'TN',
	Turkey: 'TR',
	Turkmenistan: 'TM',
	'Turks and Caicos Islands (the)': 'TC',
	Tuvalu: 'TV',
	Uganda: 'UG',
	Ukraine: 'UA',
	'United Arab Emirates (the)': 'AE',
	'United Kingdom of Great Britain and Northern Ireland (the)': 'GB',
	'United States of America (the)': 'US',
	Uruguay: 'UY',
	Uzbekistan: 'UZ',
	Vanuatu: 'VU',
	'Venezuela (Bolivarian Republic of)': 'VE',
	'Viet Nam': 'VN',
	'Virgin Islands (British)': 'VG',
	'Virgin Islands (U.S.)': 'VI',
	'Wallis and Futuna': 'WF',
	'Western Sahara': 'EH',
	Yemen: 'YE',
	Zambia: 'ZM',
	Zimbabwe: 'ZW',
	'Åland Islands': 'AX',
} as const;

export const countries = Object.keys(countryCodeMapping);
export type AcceptedCountries = keyof typeof countryCodeMapping;

export function useCheckRequestArchive() {
	const { id } = useParams() as { id: string };
	return useQuery({
		queryKey: ['requestArchive', id] as const,
		queryFn: async arg => await checkRequestArchiveStatus(arg.queryKey[1]),
		staleTime: 0,
		enabled: !!id,
	});
}

export function useCheckJobHistoryArchive() {
	const { id } = useParams() as { id: string };
	return useQuery({
		queryKey: ['jobHistoryArchive', id] as const,
		queryFn: async arg => await checkJobHistoryArchive(arg.queryKey[1]),
		staleTime: 0,
		enabled: !!id,
	});
}

export const useCandidatesList = (requestType: Tabs) =>
	useQuery({
		queryKey: [requestType],
		queryFn: async ({ queryKey }) => {
			return await getCandidatesList(queryKey[0]);
		},
		staleTime: 1000 * 60,
		enabled: !!requestType,
	});

export const useRefereePreferences = (id: string) =>
	useQuery({
		queryKey: [id],
		queryFn: async () => {
			return await getLeadInfo(id);
		},
		staleTime: 1000 * 60,
		enabled: !!id,
	});

export function downloadPDF(file: File, fileName?: string) {
	const fileURL = URL.createObjectURL(file);
	window.open(fileURL, '_blank');
	const link = document.createElement('a');
	link.href = fileURL;
	link.setAttribute('download', fileName ?? file.name);
	link.click();
	window.URL.revokeObjectURL(fileURL);
}

export function blobToBase64(blob: Blob): Promise<string> {
	return new Promise((resolve, _) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			const base64String = reader.result as string;
			resolve(base64String.substring(base64String.indexOf(',') + 1));
		};
		reader.readAsDataURL(blob);
	});
}

export function useBackgroundReport(uuid: string) {
	return useQuery({
		queryKey: [uuid],
		queryFn: async context => {
			const uuid = context.queryKey[0];
			const pdf = (await getReport(uuid)) as Blob;
			if (pdf instanceof Blob)
				return { blob: pdf, base64: await blobToBase64(pdf) };
			const pdf1 = (await getReport(uuid)) as Blob;
			return { blob: pdf1, base64: await blobToBase64(pdf1) };
		},
		staleTime: 1000 * 60 * 60,
		enabled: !!uuid,
	});
}

export function useBackgroundReportHTML(uuid: string) {
	return useQuery({
		queryKey: [uuid],
		queryFn: async context => {
			const [uuid] = context.queryKey;
			const { html } = await getReportHTML(uuid);
			return html;
		},
		staleTime: 1000 * 60 * 60,
		enabled: !!uuid,
	});
}

export function useQuestionsFromQuestionType() {
	const accessToken = Cookies.get('access');
	const { buckets } = useOtherAuth();
	return useQuery({
		queryKey: [buckets],
		queryFn: async ({ queryKey: [buckets] }) => {
			if (buckets == null) return {};
			const questions = await Promise.all(
				buckets.map(({ uuid }) => getQuestionsByBucketType(uuid) ?? [])
			);
			return questions.reduce((acc, v, i) => {
				acc[buckets[i].uuid] = v;
				return acc;
			}, {}) as Record<string, typeof dummyQuestionByQuestionType>;
		},
		staleTime: 1000 * 60 * 60,
		enabled: !!accessToken && Boolean(buckets),
	});
}

const dummyQuestionByQuestionType = [
	{
		uuid: '7246ad32-cebc-48a3-b56e-90034fa4c4f5',
		created_at: '2023-02-17T16:06:33.856987Z',
		updated_at: '2023-02-17T16:06:33.857245Z',
		question:
			'Please describe their ability to work with budgets, including reporting. How large were the budgets?',
		numberOfTimesUsed: 0,
		rateFlag: false,
		default: false,
		mandatory: false,
		bucket: 'Role specific',
	},
];

export function useDeleteClient() {
	const { uuid } = useParams();
	const [params] = useSearchParams();
	return useQuery({
		queryKey: [uuid, params],
		queryFn: async () => {
			if (uuid) return await deleteClientObject({ uuid, params });
			throw new Error('UUID required in this route!');
		},
		staleTime: 1000 * 60 * 60,
		enabled: uuid != null,
		retry: false,
	});
}

export function useEmailTypes() {
	return useQuery({
		queryKey: ['emailTypes'],
		queryFn: getEmailTypes,
		staleTime: 1000 * 60 * 60,
		retry: false,
	});
}

export function useSaveEmailTemplate() {
	return useMutation({
		mutationFn: saveEmailTemplate,
	});
}

const emailTemplate = {
	uuid: '8de13762-6af5-48c8-b278-6f9dbe5f0bcf',
	created_at: '2023-08-09T12:51:57.765095Z',
	updated_at: '2023-08-09T12:51:57.765359Z',
	subject: 'fdsfdw',
	body: 'fefwfwefwfewfew',
	emailSendFunction: 'f410b73c-267a-4cdd-8f85-ac0a9dc388df',
	clientObject: 'cde7d5c8-3db3-4e6c-afb1-21b415997e3a',
};

export type SavedEmailTemplate = typeof emailTemplate;

export function useGetEmails() {
	const { uuid } = useParams() as { uuid: string };
	return useQuery({
		queryKey: [uuid],
		queryFn: async () => {
			const response = await getEmailsForClient(uuid);
			const results = response.data.results as SavedEmailTemplate[];
			return [...results].sort((a, b) =>
				new Date(a.updated_at) > new Date(b.updated_at) ? -1 : 1
			);
		},
		staleTime: 1000 * 60 * 60,
		retry: false,
	});
}

export function usePreviewEmail() {
	return useMutation({
		mutationFn: postPreviewEmail,
	});
}

export function useDeleteEmailTemplate() {
	return useMutation({
		mutationFn: deleteEmailTemplate,
	});
}

export function useClient() {
	const { uuid } = useParams() as { uuid: string };
	const { clients } = useSuperAdminContext();
	try {
		const client = useMemo(
			() => clients.find(v => v.uuid === uuid),
			[clients, uuid]
		);
		if (!client) throw new Error('client not found');
		return client;
	} catch (e) {
		return null;
	}
}

export function useUpdateClient() {
	return useMutation({ mutationFn: updateClient });
}

export function useRequestInfinite(selectedTab: Tabs | null) {
	return useInfiniteQuery({
		queryKey: [selectedTab],
		queryFn: async ({ pageParam = `${selectedTab}?page=1&page_size=50` }) => {
			const res = await getCandidatesListPaginated(pageParam);
			return res.data;
		},
		initialPageParam: `${selectedTab}?page=1&page_size=50`,
		getPreviousPageParam: firstPage => firstPage.previous?.split('/')?.at(-1),
		getNextPageParam: lastPage => lastPage.next?.split('/')?.at(-1),
		staleTime: 1000 * 60,
	});
}

export const oneDay = 1000 * 60 * 60 * 24;
