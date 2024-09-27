const sampleQuestions = [
	{
		uuid: '070d7426-3a98-445e-bc3c-4a4087092a2e',
		created_at: '2023-02-17T16:06:34.077528Z',
		updated_at: '2023-08-31T13:21:46.130648Z',
		question: 'How do they perform under pressure?',
		numberOfTimesUsed: 20,
		rateFlag: false,
		default: true,
		mandatory: false,
		bucket: 'Essentials',
		type: 'essential',
		added: true,
	},
	{
		uuid: '6f124dac-44b7-41b3-9e91-fd6b9cf27d1f',
		created_at: '2023-02-17T16:06:33.884946Z',
		updated_at: '2023-02-17T16:06:33.885073Z',
		question:
			'Please provide a description of their ability to effectively manage and direct projects.',
		numberOfTimesUsed: 0,
		rateFlag: false,
		default: false,
		mandatory: false,
		bucket: 'Personal Attributes',
		type: 'personal',
		added: true,
	},
	{
		uuid: '491d6fbf-14c5-4064-bd2a-0c230d15b697',
		created_at: '2023-02-17T16:06:33.930983Z',
		updated_at: '2023-02-17T16:06:33.931108Z',
		question:
			'Please provide an evaluation and describe their level of motivation and work ethic.',
		numberOfTimesUsed: 0,
		rateFlag: false,
		default: false,
		mandatory: false,
		bucket: 'Essentials',
		type: 'essential',
		added: true,
	},
	{
		uuid: 'e2d64933-32f8-41db-9913-3f7177ebeb30',
		created_at: '2023-02-17T16:06:34.422925Z',
		updated_at: '2023-03-27T11:44:47.938689Z',
		question:
			'Please rate and describe their ability to work with senior customers or stakeholders. Did you observe any areas for improvement?',
		numberOfTimesUsed: 1,
		rateFlag: true,
		default: false,
		mandatory: false,
		bucket: 'Role specific',
		type: 'essential',
		added: true,
	},
	{
		uuid: 'd69392fa-d8c2-48e8-91f1-aa20f919b488',
		created_at: '2023-02-17T16:06:34.362733Z',
		updated_at: '2023-08-24T10:34:28.070330Z',
		question:
			'Please rate and describe their ability to interact with customers.',
		numberOfTimesUsed: 5,
		rateFlag: true,
		default: false,
		mandatory: false,
		bucket: 'Role specific',
		type: 'essential',
		added: true,
	},
	{
		uuid: '32076cb7-7fde-46c3-a079-081d813c75eb',
		created_at: '2023-02-17T16:06:34.198458Z',
		updated_at: '2023-07-28T18:51:47.116236Z',
		question:
			'Please assess their customer service skills? Please provide an example.',
		numberOfTimesUsed: 2,
		rateFlag: false,
		default: false,
		mandatory: false,
		bucket: 'Role specific',
		type: 'essential',
		added: true,
	},
	{
		uuid: '2fa98523-ff36-4320-b8b2-a3c961e4437d',
		created_at: '2023-02-17T16:06:35.479599Z',
		updated_at: '2023-08-24T10:34:28.075090Z',
		question:
			'Please describe their ability to interact with customers (Internal and external).',
		numberOfTimesUsed: 2,
		rateFlag: false,
		default: false,
		mandatory: false,
		bucket: 'Role specific',
		type: 'essential',
		added: true,
	},
];

export const bucketTypes = [
	'Essentials',
	'Personal Attributes',
	'Role specific',
	'Custom History',
] as const;

export type Question = (typeof sampleQuestions)[number];
export type BucketTypes = (typeof bucketTypes)[number];
