import { z } from 'zod';

export const initialFilterState: FilterStateSchema = {
	is_active: true,
	searchQuery: null,
	applicationResultType: null,
	applicationStatusType: null,
	applicationScanType: null,
	backgroundCheckStatus: null,
};

export const scanTypes = [
	'Softcheck',
	'Social Media Check',
	'Identity Verification',
	'Enhanced Canadian Criminal Record Check',
	'Canadian Criminal Record Check',
	'US Base Criminal ',
	'US Single County Criminal',
	'US Unlimited County Criminal',
	'International Criminal Record Check',
	'Instant Education Verification ',
	'Credential Verification ',
	'Employment Verification',
] as const;

export const backgroundCheckStatuses = [
	'None',
	'Archive',
	'Prospect',
	'Employment Pending',
	'Employees',
] as const;

export const applicationStatusTypes = [
	'Action Required',
	'Cancelled',
	'Complete',
	'In Dispute',
	'In Progress',
	'Waiting On Candidate',
] as const;

export const applicationResultTypes = ['Cleared', 'Review', 'None'] as const;

export const data = [
	{
		uuid: '8282dd7d-9ff6-4bb7-985a-d9527e48d141',
		scan_list: [
			{
				uuid: 'a1142ec3-9e97-4cfd-a1ed-333dc6248d0a',
				created_at: '2024-06-08T02:58:08.089312Z',
				updated_at: '2024-06-08T02:58:08.089755Z',
				webhook_hit_at: '',
				application_status: 'WAITING_ON_CANDIDATE',
				bgCCheck: '8282dd7d-9ff6-4bb7-985a-d9527e48d141',
				scanType: '7317277b-00df-4020-affa-71ee40f664fa',
			},
		],
		created_at: '2024-06-08T02:58:08.079151Z',
		updated_at: '2024-06-08T02:58:08.079718Z',
		is_active: true,
		firstName: '',
		lastName: '',
		email: 'Credibled1@gmail.com',
		phoneCode: '',
		phone: '',
		applicant_id: '1a038c09-2284-400a-b195-8f8529c31f9d',
		application_status: 'Waiting On Candidate',
		application_id: 'd70bca60-8fdb-476c-a91f-2d36dc20ab8c',
		status: 'None',
		application_url:
			'https://whitelabel.certn.co/welcome/email?session=a5fcc828-fc42-4501-b598-a8696f73a9f1&token=2d257509-51b9-47cc-8ad0-a198718814ab&onboardingType=HR&inviteRoute=email',
		score: 'None',
		check_executions: [
			{
				id: 'check_exec_lDklry5AB1lJaM90DJ2ta2',
				status: 'WAITING_ON_CANDIDATE',
				check_name: 'criminal_record_check',
			},
			{
				id: 'check_exec_ZoL7KpYiyeUM8BGHesfhvI',
				status: 'WAITING_ON_CANDIDATE',
				check_name: 'enhanced_identity_verification',
			},
		],
		webhook_hit_at: '',
		report_id: '',
		recruiter: 191,
		scan_type: '7317277b-00df-4020-affa-71ee40f664fa',
		invoice: '',
	},
];

export const filterStateSchema = z.object({
	is_active: z.boolean(),
	searchQuery: z.union([z.string(), z.null()]),
	applicationScanType: z.string().or(z.null()),
	applicationStatusType: z.enum([...applicationStatusTypes]).or(z.null()),
	applicationResultType: z.enum([...applicationResultTypes]).or(z.null()),
	backgroundCheckStatus: z.enum([...backgroundCheckStatuses]).or(z.null()),
});

export const filterActionSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('SELECT_SCAN_TYPE'),
		payload: z.string().nullable(),
	}),
	z.object({
		type: z.literal('SELECT_APPLICATION_STATUS_TYPE'),
		payload: z.enum(applicationStatusTypes).nullable(),
	}),
	z.object({
		type: z.literal('SELECT_APPLICATION_RESULT_TYPE'),
		payload: z.enum(applicationResultTypes).nullable(),
	}),
	z.object({
		type: z.literal('CHANGE_QUERY'),
		payload: z.string().nullable(),
	}),
	z.object({
		type: z.literal('SELECT_BACKGROUND_CHECK_STATUS'),
		payload: z.enum(backgroundCheckStatuses).nullable(),
	}),
	z.object({
		type: z.literal('SELECT_IS_ACTIVE'),
		payload: z.boolean(),
	}),
	z.object({
		type: z.literal('RESET'),
		payload: z.any(),
	}),
]);

export type ArrayElement<T> = T extends (infer R)[] ? R : T;
export type FilterActionSchema = z.infer<typeof filterActionSchema>;
export type FilterStateSchema = z.infer<typeof filterStateSchema>;
export type BackgroundCheckRequest = Omit<
	ArrayElement<typeof data>,
	'webhook_hit_at'
> & { webhook_hit_at: string | null };
export type BackgroundCheckRequests = BackgroundCheckRequest[];
