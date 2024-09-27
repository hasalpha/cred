import {
	applicationResultTypes,
	applicationStatusTypes,
	backgroundCheckStatuses,
} from '../../pages/user/background-check/types';

export type LeadPreferenceType = {
	is_lead_generation_job: boolean;
	is_lead_generation_candidate: boolean;
};

export type Tabs = 'in_progress' | 'requested' | 'completed' | 'archive';

export type RequestItem = {
	uuid: string;
	recruiterName: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	candidateInfo?: Record<string, any>;
	data?: Record<string, any>;
	requestDate: string;
	created_at: string;
	references: typeof sampleReferences;
	referenceDetails: any;
	application_link: string;
	is_sms_allow: boolean;
};

const sampleQuestionnaire = {
	uuid: '3565157c-73aa-4027-b069-a2329c54f5ee',
	created_at: '2023-07-04T19:43:41.339102Z',
	updated_at: '2023-07-05T08:43:40.260911Z',
	questionnaire_title: 'architect',
	job_title: 'arch',
	type: null,
	noOfQuestions: 15,
	is_active: true,
	is_archived: false,
	is_client_created: true,
	recruiter: 3,
	industry: 'b01efffe-5435-461a-97e8-174f0e9bea0d',
	questionList: [
		{
			uuid: '12e229b7-b18f-4df7-9dc9-13f0eee4face',
			created_at: '2023-02-17T16:06:34.025264Z',
			updated_at: '2023-07-04T19:43:41.250789Z',
			question:
				'What was the reporting structure of your working relationship?',
			numberOfTimesUsed: 59,
			rateFlag: false,
			default: true,
			mandatory: true,
			bucket: 'Essentials',
		},
		{
			uuid: '6c6ff19c-aa41-4fbb-ba2d-7f84aa5b373c',
			created_at: '2023-02-17T16:06:34.040152Z',
			updated_at: '2023-07-04T19:43:41.254829Z',
			question: 'What were the main duties of their job?',
			numberOfTimesUsed: 49,
			rateFlag: false,
			default: true,
			mandatory: true,
			bucket: 'Essentials',
		},
		{
			uuid: '1960be12-bb4b-4b78-aec4-8a68a1b65ea5',
			created_at: '2023-02-17T16:06:34.054882Z',
			updated_at: '2023-07-04T19:43:41.258267Z',
			question: 'What is your overall appraisal of their work?',
			numberOfTimesUsed: 55,
			rateFlag: false,
			default: true,
			mandatory: true,
			bucket: 'Essentials',
		},
		{
			uuid: 'be2fec21-fdab-4c99-96e4-7f8a13988f04',
			created_at: '2023-02-17T16:06:35.619872Z',
			updated_at: '2023-07-04T19:43:41.262109Z',
			question:
				'Please describe, describe and provide an example of their ability to display empathy and understanding towards Other.',
			numberOfTimesUsed: 30,
			rateFlag: false,
			default: false,
			mandatory: false,
			bucket: 'Personal Attributes',
		},
		{
			uuid: '660f9574-83bf-40ba-a977-2bcb629b621c',
			created_at: '2023-02-17T16:06:35.927997Z',
			updated_at: '2023-07-04T19:43:41.265751Z',
			question:
				'Were they good at taking constructive criticism and applying it going forward? Did they take responsibility for any mistakes? If possible, please share an example.',
			numberOfTimesUsed: 25,
			rateFlag: false,
			default: false,
			mandatory: false,
			bucket: 'Personal Attributes',
		},
		{
			uuid: '4ab62038-550f-4270-a597-b6fa639e967c',
			created_at: '2023-02-17T16:06:34.106743Z',
			updated_at: '2023-07-04T19:43:41.269421Z',
			question:
				'How flexible are they to recommendations for improvement and change?',
			numberOfTimesUsed: 26,
			rateFlag: false,
			default: false,
			mandatory: false,
			bucket: 'Personal Attributes',
		},
		{
			uuid: '292d6ceb-124d-4cec-b23d-d0f94089e8a5',
			created_at: '2023-02-17T16:06:34.829810Z',
			updated_at: '2023-07-04T19:43:41.272663Z',
			question:
				'Please assess how well they receive and implement feedback and criticism. Please provide examples where possible.',
			numberOfTimesUsed: 24,
			rateFlag: false,
			default: false,
			mandatory: false,
			bucket: 'Personal Attributes',
		},
		{
			uuid: '2f668429-bbff-4ca2-9fc2-7e067967fcfe',
			created_at: '2023-02-17T16:06:35.292604Z',
			updated_at: '2023-07-04T19:43:41.276174Z',
			question:
				'Please describe their general workplace behaviour (i.e. their honesty, integrity, and loyalty).',
			numberOfTimesUsed: 25,
			rateFlag: false,
			default: false,
			mandatory: false,
			bucket: 'Personal Attributes',
		},
		{
			uuid: 'e46f74f4-3da0-4e6f-b3d6-813c39d77a36',
			created_at: '2023-02-17T16:06:36.339249Z',
			updated_at: '2023-07-04T19:43:41.279745Z',
			question:
				"Can you describe the candidate's approach to approaching and solving complex design problems?",
			numberOfTimesUsed: 3,
			rateFlag: false,
			default: false,
			mandatory: false,
			bucket: 'Role specific',
		},
		{
			uuid: '6162459a-c321-498b-9aaa-94694c8593e8',
			created_at: '2023-02-17T16:06:36.345924Z',
			updated_at: '2023-07-04T19:43:41.283242Z',
			question:
				"Can you provide specific examples of the candidate's experience in designing and delivering successful projects in the past?",
			numberOfTimesUsed: 3,
			rateFlag: false,
			default: false,
			mandatory: false,
			bucket: 'Role specific',
		},
		{
			uuid: '75768094-1226-48dc-8416-76384eda8824',
			created_at: '2023-02-17T16:06:36.352787Z',
			updated_at: '2023-07-04T19:43:41.286773Z',
			question:
				"How would you describe the candidate's communication and collaboration skills when working with clients and project stakeholders?",
			numberOfTimesUsed: 3,
			rateFlag: false,
			default: false,
			mandatory: false,
			bucket: 'Role specific',
		},
		{
			uuid: 'b8a05487-fa76-4564-b646-9a9e5f2a0bcc',
			created_at: '2023-02-17T16:06:36.359707Z',
			updated_at: '2023-07-04T19:43:41.290201Z',
			question:
				"Can you discuss the candidate's ability to meet project deadlines and budgets?",
			numberOfTimesUsed: 3,
			rateFlag: false,
			default: false,
			mandatory: false,
			bucket: 'Role specific',
		},
		{
			uuid: 'fefa013b-cdec-4d92-a081-4f2d751be87d',
			created_at: '2023-02-17T16:06:36.366455Z',
			updated_at: '2023-07-04T19:43:41.293531Z',
			question:
				"Can you speak to the candidate's technical skills and expertise in using design software and tools?",
			numberOfTimesUsed: 3,
			rateFlag: false,
			default: false,
			mandatory: false,
			bucket: 'Role specific',
		},
		{
			uuid: 'cf588382-c0f7-4765-a5c7-273088ebf877',
			created_at: '2023-02-17T16:06:35.887076Z',
			updated_at: '2023-07-04T19:43:41.296786Z',
			question: 'Why did they leave your company? Would you re-employ?',
			numberOfTimesUsed: 70,
			rateFlag: false,
			default: true,
			mandatory: true,
			bucket: 'Essentials',
		},
		{
			uuid: '4edd551f-f27c-43d8-b0bd-8ead75293f6e',
			created_at: '2023-02-17T16:06:35.917849Z',
			updated_at: '2023-07-04T19:43:41.300175Z',
			question:
				'Is there anything else of significance we should know? Are there any concerns, compliments or general comments?',
			numberOfTimesUsed: 71,
			rateFlag: false,
			default: true,
			mandatory: true,
			bucket: 'Essentials',
		},
	],
};

export type Questionnaire = typeof sampleQuestionnaire & {
	count?: number;
	val?: string;
};

export type GetFlattened<T> = T extends unknown[] ? T[number] : T;

export type IndustryResponse = typeof industriesResponse;
export type Industry = GetFlattened<IndustryResponse['results']>;

const industriesResponse = {
	count: 22,
	next: null,
	previous: null,
	results: [
		{
			uuid: '82b97c49-a00f-49c7-a0ec-6892a520370c',
			created_at: '2023-02-06T12:54:06.250547Z',
			updated_at: '2023-02-06T12:54:06.250768Z',
			name: 'Accounting & Finance',
			is_active: true,
		},
		{
			uuid: '10da3c4b-2f14-48d8-9cd8-e177bf8128fa',
			created_at: '2023-02-06T12:54:06.260604Z',
			updated_at: '2023-02-06T12:54:06.260715Z',
			name: 'Administration & Office Support',
			is_active: true,
		},
		{
			uuid: '15fb1794-5e73-4c85-8742-e2a78de3f868',
			created_at: '2023-02-06T12:54:06.252547Z',
			updated_at: '2023-02-06T12:54:06.252666Z',
			name: 'Agriculture',
			is_active: true,
		},
		{
			uuid: '8bb226d7-d70d-42bf-8a67-8e0dc2f8edf6',
			created_at: '2023-02-06T12:54:06.262179Z',
			updated_at: '2023-02-06T12:54:06.262297Z',
			name: 'Call Centre & Customer Service',
			is_active: true,
		},
		{
			uuid: '9f8145bf-7864-4277-8d01-58aad60eea6d',
			created_at: '2023-02-06T12:54:26.841727Z',
			updated_at: '2023-02-06T12:54:26.841842Z',
			name: 'Community Service & Development',
			is_active: true,
		},
		{
			uuid: '34c8be9a-a01f-4e6d-a12d-cd68b9a5b167',
			created_at: '2023-02-06T12:54:06.254132Z',
			updated_at: '2023-02-06T12:54:06.254244Z',
			name: 'Computer & IT',
			is_active: true,
		},
		{
			uuid: 'bd21c240-6631-4ee7-b790-7c2e022d125f',
			created_at: '2023-02-06T12:54:06.257417Z',
			updated_at: '2023-02-06T12:54:06.257528Z',
			name: 'Construction',
			is_active: true,
		},
		{
			uuid: 'f9aad8a5-f623-49bc-84b6-8ab90cc9adb0',
			created_at: '2023-02-06T12:54:06.268565Z',
			updated_at: '2023-02-06T12:54:06.268677Z',
			name: 'Consulting & Strategy',
			is_active: true,
		},
		{
			uuid: 'b01efffe-5435-461a-97e8-174f0e9bea0d',
			created_at: '2023-02-06T12:54:06.270081Z',
			updated_at: '2023-02-06T12:54:06.270193Z',
			name: 'Design & Architechture',
			is_active: true,
		},
		{
			uuid: 'd6ffe541-55a7-4652-8eb4-2aec852f6932',
			created_at: '2023-02-06T12:54:06.267005Z',
			updated_at: '2023-02-06T12:54:06.267119Z',
			name: 'Education & Training',
			is_active: true,
		},
		{
			uuid: 'd74ae975-8bea-4bd2-94aa-5bbf638d811d',
			created_at: '2023-02-06T12:54:06.255738Z',
			updated_at: '2023-02-06T12:54:06.255849Z',
			name: 'Energy',
			is_active: true,
		},
		{
			uuid: '0609033f-ad5c-437d-9289-1ffed018f40e',
			created_at: '2023-02-06T12:54:06.265361Z',
			updated_at: '2023-02-06T12:54:06.265473Z',
			name: 'Engineering',
			is_active: true,
		},
		{
			uuid: '3f81782b-395c-4a93-8b6f-d6a8df9edd7a',
			created_at: '2023-02-06T12:54:06.280725Z',
			updated_at: '2023-02-06T12:54:06.280837Z',
			name: 'Forestry',
			is_active: true,
		},
		{
			uuid: 'ee43899b-93cd-441e-8062-5d5fedf3b891',
			created_at: '2023-02-06T12:54:06.271625Z',
			updated_at: '2023-02-06T12:54:06.271738Z',
			name: 'Healthcare',
			is_active: true,
		},
		{
			uuid: '99a55e01-ce81-4c77-9abe-d2dff07201bf',
			created_at: '2023-02-06T12:54:06.263819Z',
			updated_at: '2023-02-06T12:54:06.263936Z',
			name: 'Hospitality',
			is_active: true,
		},
		{
			uuid: '84941e6d-a0e5-40b6-a803-7ab56a10b5f5',
			created_at: '2023-02-06T12:54:06.273215Z',
			updated_at: '2023-02-06T12:54:06.273329Z',
			name: 'Legal',
			is_active: true,
		},
		{
			uuid: 'b5a98972-109f-4036-a955-85562edbd602',
			created_at: '2023-02-06T12:54:06.259086Z',
			updated_at: '2023-02-06T12:54:06.259197Z',
			name: 'Manufacturing',
			is_active: true,
		},
		{
			uuid: '22a20f6c-b6de-4123-8200-3e0341a4ff3b',
			created_at: '2023-02-06T12:54:06.279236Z',
			updated_at: '2023-02-06T12:54:06.279348Z',
			name: 'Mining',
			is_active: true,
		},
		{
			uuid: 'a26b2e5e-e4f0-4d33-9fa1-e43b2d8fee45',
			created_at: '2023-02-06T12:54:06.282201Z',
			updated_at: '2023-02-06T12:54:06.282313Z',
			name: 'Other',
			is_active: true,
		},
		{
			uuid: 'f5ebbec2-2c9d-4dd4-a3de-2a04409efcd2',
			created_at: '2023-02-06T12:54:06.274735Z',
			updated_at: '2023-02-06T12:54:06.274849Z',
			name: 'Professional Services',
			is_active: true,
		},
		{
			uuid: '778a889c-435a-4198-9444-d31375c17f6b',
			created_at: '2023-02-06T12:54:06.276243Z',
			updated_at: '2023-02-06T12:54:06.276354Z',
			name: 'Retail',
			is_active: true,
		},
		{
			uuid: 'e6faab0d-6fe0-41e9-bb25-ceca5db740b5',
			created_at: '2023-02-06T12:54:06.277725Z',
			updated_at: '2023-02-06T12:54:06.277836Z',
			name: 'Transportation and Logistics',
			is_active: true,
		},
	],
};

export type CompetencyResponse = typeof competencyResponse;
export type Competency = GetFlattened<CompetencyResponse['results']>;

const competencyResponse = {
	count: 22,
	next: null,
	previous: null,
	results: [
		{
			uuid: '95b49526-dea2-4d9d-aa5b-fbb37d96dd54',
			created_at: '2023-02-06T12:54:29.505116Z',
			updated_at: '2023-02-06T12:54:29.505225Z',
			name: '',
		},
		{
			uuid: '2f56f53c-8bf0-4eaa-acb7-74e3f8ff4ffa',
			created_at: '2023-02-06T12:54:26.736475Z',
			updated_at: '2023-02-06T12:54:26.736611Z',
			name: 'Ability to Learn',
		},
		{
			uuid: '97107532-90e9-4914-b25d-119e802893f7',
			created_at: '2023-02-06T12:54:26.414694Z',
			updated_at: '2023-02-06T12:54:26.414807Z',
			name: 'Adaptability and Flexibility',
		},
		{
			uuid: 'ed08acfb-f312-4011-a048-e0cac8519b94',
			created_at: '2023-02-06T12:54:26.458185Z',
			updated_at: '2023-02-06T12:54:26.458294Z',
			name: 'Analytical Skills',
		},
		{
			uuid: '28a61a99-7e9e-463f-8a6b-4fb32cce358c',
			created_at: '2023-02-06T12:54:26.710512Z',
			updated_at: '2023-02-06T12:54:26.710685Z',
			name: 'Attendance',
		},
		{
			uuid: '725db8cd-4991-4f80-b2c5-70df92d27150',
			created_at: '2023-02-06T12:54:27.078669Z',
			updated_at: '2023-02-06T12:54:27.078779Z',
			name: 'Attention to Detail',
		},
		{
			uuid: '40e2c0bb-4a31-4b22-aeb9-71695b838778',
			created_at: '2023-02-06T12:54:27.066338Z',
			updated_at: '2023-02-06T12:54:27.066450Z',
			name: 'Behaviour and Compliance',
		},
		{
			uuid: 'b7dce5a3-08e5-45a7-ae4b-41e7ef8477ac',
			created_at: '2023-02-06T12:54:26.871627Z',
			updated_at: '2023-02-06T12:54:26.871737Z',
			name: 'Computer Literacy',
		},
		{
			uuid: '2f4b3e57-eb46-40d9-b5c1-541aca0349dc',
			created_at: '2023-02-06T12:54:26.401199Z',
			updated_at: '2023-02-06T12:54:26.401315Z',
			name: 'Conduct and Behaviour',
		},
		{
			uuid: '12fd2f11-8a45-45ac-85a3-c49a87d90131',
			created_at: '2023-02-06T12:54:26.626316Z',
			updated_at: '2023-02-06T12:54:26.626430Z',
			name: 'Conflict Management',
		},
		{
			uuid: '0ad76739-2efd-46f2-8d30-6407fc2700aa',
			created_at: '2023-02-06T12:54:26.999872Z',
			updated_at: '2023-02-06T12:54:26.999981Z',
			name: 'Customer Service',
		},
		{
			uuid: 'd688d628-4675-4a5d-9d83-9a719ec0b663',
			created_at: '2023-02-06T12:54:28.812577Z',
			updated_at: '2023-02-06T12:54:28.812689Z',
			name: 'Follow Instructions',
		},
		{
			uuid: '2246a63b-942a-4277-9506-f1af83b38d0f',
			created_at: '2023-02-06T12:54:29.975248Z',
			updated_at: '2023-02-06T12:54:29.975359Z',
			name: 'Innovation',
		},
		{
			uuid: 'd86fa1d5-0911-4ad3-a9fc-e6ba24928ccf',
			created_at: '2023-02-06T12:54:26.427515Z',
			updated_at: '2023-02-06T12:54:26.427630Z',
			name: 'Interpersonal Skills',
		},
		{
			uuid: '8e17d6c6-9db8-47ec-a00f-fc33fe91d6fb',
			created_at: '2023-02-06T12:54:26.794215Z',
			updated_at: '2023-02-06T12:54:26.794326Z',
			name: 'Listening Skills',
		},
		{
			uuid: '3bb456f9-8412-4e2e-8dc4-bd1952422c02',
			created_at: '2023-02-06T12:54:29.515138Z',
			updated_at: '2023-02-06T12:54:29.515247Z',
			name: 'nan',
		},
		{
			uuid: '2fa6ba90-6aa8-49e7-ab29-d86e9dbdf0c6',
			created_at: '2023-02-06T12:54:26.398976Z',
			updated_at: '2023-02-06T12:54:26.399156Z',
			name: 'Personal Presentation',
		},
		{
			uuid: '58350399-7080-40a3-b20c-a91dd7e3d52a',
			created_at: '2023-02-06T12:54:26.553244Z',
			updated_at: '2023-02-06T12:54:26.553354Z',
			name: 'Prioritise Effectively',
		},
		{
			uuid: '841411f5-31c9-4688-8a96-3f2e7b392ff6',
			created_at: '2023-02-06T12:54:26.518856Z',
			updated_at: '2023-02-06T12:54:26.518965Z',
			name: 'Punctuality and Reliability',
		},
		{
			uuid: '3ba3d23d-7d4c-4c5c-b5ac-d31a4f3247ca',
			created_at: '2023-02-06T12:54:26.627927Z',
			updated_at: '2023-02-06T12:54:26.628046Z',
			name: 'Targets and KPIs',
		},
		{
			uuid: '9522846c-e11c-40b5-8419-1fcc2024b91d',
			created_at: '2023-02-06T12:54:29.976791Z',
			updated_at: '2023-02-06T12:54:29.976900Z',
			name: 'Technical expertise',
		},
		{
			uuid: '85efcee9-3be8-4837-afe6-cf180036c0c3',
			created_at: '2023-02-06T12:54:26.542601Z',
			updated_at: '2023-02-06T12:54:26.542713Z',
			name: 'Work Under Pressure',
		},
	],
};
export type BucketResponse = typeof bucketResponse;
export type Bucket = GetFlattened<BucketResponse['results']>;
const bucketResponse = {
	count: 4,
	next: null,
	previous: null,
	results: [
		{
			uuid: '0016c155-e849-486e-bc8c-05695c9ae02e',
			created_at: '2023-02-06T12:54:26.404982Z',
			updated_at: '2023-02-06T12:54:26.405119Z',
			name: 'Personal Attributes',
		},
		{
			uuid: 'feb0ba88-33be-492b-8580-46887f52f26f',
			created_at: '2023-02-06T12:54:26.461229Z',
			updated_at: '2023-02-06T12:54:26.461339Z',
			name: 'Role specific',
		},
		{
			uuid: 'b413bfe5-2893-4787-9799-d97f906e301a',
			created_at: '2023-02-06T12:54:26.579771Z',
			updated_at: '2023-02-06T12:54:26.579883Z',
			name: 'Essentials',
		},
		{
			uuid: '914c864f-0f49-4e1e-a3f1-267d14298f8d',
			created_at: '2023-02-06T12:57:14.067310Z',
			updated_at: '2023-02-06T12:57:14.067467Z',
			name: 'Custom History',
		},
	],
};

export type BackgroundCheckBody = {
	checkType: string;
	scan_type: string;
	email: string;
};

export type PartialNull<T> = {
	[K in keyof T]: T[K] | null;
};

export type BackgroundCheckParams = {
	search: string;
	scan_type: string;
	application_status: (typeof applicationStatusTypes)[number];
	status: (typeof backgroundCheckStatuses)[number];
	score: (typeof applicationResultTypes)[number];
	is_active: boolean;
};

export type BackgroundUpdateParams = {
	uuid: string;
	body: { status: string };
};

export type DisplayStatuses =
	| 'Requested'
	| 'In Progress'
	| 'Completed'
	| 'Archived';

const sampleReferences = [
	{
		uuid: 'be092123-9503-4230-b97d-1f9f616138ca',
		ctenure: {
			ctenure: 'From May 2019 to Present',
		},
		endDate: null,
		refwork: {
			rtenure: '',
			mrefwork:
				'Reference covers the period of 4 years 0 months as Naruto Ship was employed',
			cdaysdiff: 28,
			cyeardiff: 4,
			cmonthsdiff: 0,
		},
		isSameIP: true,
		emailFlag: true,
		ipAddress: '72.140.72.204',
		startDate: '2019-05-30',
		created_at: '2023-04-28T02:33:22.455391Z',
		refreeName: 'Brad Semotiuk',
		updated_at: '2023-06-20T14:44:01.624448Z',
		partEndDate: null,
		candidateRole: 'Op manager',
		partStartDate: null,
		employmentType: 'Full-Time Employee',
		isBusinessEmail: true,
		refereeResponse: 'Accepted',
		declineEmailFlag: false,
		currentlyWorkingHere: 'true',
	},
	{
		uuid: '2c3d7978-7f54-4312-94de-c51ebdb00671',
		ctenure: {
			ctenure: 'From May 2019 to Aug 2021',
		},
		endDate: '2021-08-30',
		refwork: {
			rtenure: '',
			mrefwork:
				'Reference covers the period of 2 years 3 months as Naruto Ship was employed',
			cdaysdiff: 0,
			cyeardiff: 2,
			cmonthsdiff: 3,
		},
		isSameIP: true,
		emailFlag: true,
		ipAddress: '72.140.72.204',
		startDate: '2019-05-30',
		created_at: '2023-04-28T02:34:09.172850Z',
		refreeName: 'Arul Laurent',
		updated_at: '2023-06-20T14:44:01.640743Z',
		partEndDate: null,
		candidateRole: 'Sources',
		partStartDate: null,
		employmentType: 'Part-Time Employee',
		isBusinessEmail: true,
		refereeResponse: 'Accepted',
		declineEmailFlag: false,
		currentlyWorkingHere: 'false',
	},
	{
		uuid: '758c29bb-928b-4cac-8575-78e8b77ff54a',
		ctenure: {
			ctenure: 'From Nov 2018 to Present',
		},
		endDate: null,
		refwork: {
			rtenure: '',
			mrefwork:
				'Reference covers the period of 4 years 6 months as Naruto Ship was employed',
			cdaysdiff: 29,
			cyeardiff: 4,
			cmonthsdiff: 6,
		},
		isSameIP: false,
		emailFlag: true,
		ipAddress: '72.140.72.204',
		startDate: '2018-11-29',
		created_at: '2023-04-28T02:36:03.674498Z',
		refreeName: 'Brad Semotiuk',
		updated_at: '2023-06-20T14:44:01.651905Z',
		partEndDate: null,
		candidateRole: 'BA',
		partStartDate: null,
		employmentType: 'Full-Time Employee',
		isBusinessEmail: false,
		refereeResponse: 'Accepted',
		declineEmailFlag: false,
		currentlyWorkingHere: 'true',
	},
	{
		uuid: '88572a33-e319-455e-8426-a98294b60d65',
		ctenure: {
			ctenure: 'From May 2014 to Sep 2021',
		},
		endDate: '2021-09-29',
		refwork: {
			rtenure: 'Feedback covers From May 2014 to Aug 2019',
			mrefwork:
				'Reference covers the period of 7 years 3 months as Naruto Ship was employed',
			cdaysdiff: 30,
			cyeardiff: 7,
			cmonthsdiff: 3,
		},
		isSameIP: true,
		emailFlag: true,
		ipAddress: '72.140.72.204',
		startDate: '2014-05-30',
		created_at: '2023-04-28T02:45:48.300327Z',
		refreeName: 'sdfdsfsf sdfsdfZvx',
		updated_at: '2023-06-20T14:44:01.663115Z',
		partEndDate: '2019-08-27',
		candidateRole: 'kline',
		partStartDate: '2014-05-30',
		employmentType: 'Full-Time Employee',
		isBusinessEmail: true,
		refereeResponse: 'Accepted',
		declineEmailFlag: false,
		currentlyWorkingHere: 'false',
	},
];
