const sampleCandidateSummary = {
	candidate: {
		uuid: 'f5442f8d-6346-413b-9fca-d62cb099c107',
		created_at: '2023-12-22T19:52:57.461176Z',
		updated_at: '2023-12-22T19:52:57.461613Z',
		firstName: 'Charlie',
		lastName: 'Hump',
		email: 'elvine+charlie@credibled.com',
		phoneCode: null,
		phone: '+1 647 896 5236',
	},
	candidateMore: {
		uuid: 'cf402416-fd34-4509-91c6-c21d59608224',
		created_at: '2023-12-22T19:52:57.472463Z',
		updated_at: '2023-12-22T19:57:09.508873Z',
		recruiterName: 'elvine Assouline',
		references: ['55e2194e-da25-44f3-b888-f29a5c6d6669'],
		role: 'Just one question',
		questionnaire: '345935d1-70e2-44d5-9684-60064d894975',
		candidateStatus: 'completed',
		requestDate: '2023-12-22',
		isBusinessEmail: true,
		recruiterTZ: 'America/Toronto',
		min_reference: 1,
		is_sms_allow: false,
		candidate: 'f5442f8d-6346-413b-9fca-d62cb099c107',
		recruiter: 191,
		sms: null,
	},
	jobHistory: [
		{
			uuid: '55e2194e-da25-44f3-b888-f29a5c6d6669',
			refwork: {
				cyeardiff: 5,
				cmonthsdiff: 1,
				cdaysdiff: 0,
				mrefwork:
					'Reference covers the period of 5 years 1 months as Charlie Hump was employed',
				rtenure: '',
			},
			ctenure: {
				ctenure: 'From Aug 2017 to Sep 2022',
			},
			created_at: '2023-12-22T19:56:09.815919Z',
			updated_at: '2023-12-22T19:57:09.504798Z',
			employmentType: 'Full-Time Employee',
			startDate: '2017-08-01',
			endDate: '2022-09-01',
			partStartDate: null,
			partEndDate: null,
			currentlyWorkingHere: 'false',
			candidateRole: 'po',
			refereeResponse: 'Accepted',
			emailFlag: true,
			declineEmailFlag: false,
			ipAddress: '24.52.230.199',
			isSameIP: true,
			isBusinessEmail: true,
			sms: null,
		},
	],
	lifeCycle: [
		{
			uuid: 'd7678f58-2e6f-491a-8b00-df830ec37ba3',
			created_at: '2023-12-22T19:56:16.814951Z',
			updated_at: '2023-12-22T19:56:16.815130Z',
			refereeUUID: 'cf402416-fd34-4509-91c6-c21d59608224',
			userType: 'candidate',
			name: 'Charlie',
			action: 'Sent request to Brian Cook',
			date: '2023-12-22',
			osBrowser: 'Safari',
			ipAddress: '24.52.230.199',
			locationISP: 'Toronto',
		},
		{
			uuid: '940ff596-9ea5-42e9-9ffa-80191ee13ed4',
			created_at: '2023-12-22T19:55:20.009900Z',
			updated_at: '2023-12-22T19:55:20.010130Z',
			refereeUUID: null,
			userType: 'candidate',
			name: 'Charlie',
			action: 'Agreed',
			date: '2023-12-22',
			osBrowser: 'Safari',
			ipAddress: '24.52.230.199',
			locationISP: 'undefined/Toronto',
		},
	],
};

export type CandidateSummaryData = typeof sampleCandidateSummary;