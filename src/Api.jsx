export class API {
	static authUser(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/auth/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}
	static login(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/auth/login/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp);
	}
	static logout(token) {
		return fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${token}`,
			},
		}).then(resp => resp.json());
	}

	static createUser(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/auth/register/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp);
	}

	static signUpUser(body, token) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/users/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${token}`,
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static createRequest(body, token) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/candidate/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${token}`,
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static getSummaryCount(username, token) {
		return fetch(
			`${import.meta.env.VITE_API_URL}/iam/api/summary?recruiter=${username}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
			}
		).then(resp => resp.json());
	}

	static getCurrentUserData(username, token) {
		return fetch(
			`${
				import.meta.env.VITE_API_URL
			}/iam/api/currentuser?username=${username}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
		).then(resp => (resp.status < 400 ? resp.json() : resp));
	}

	static getCandidateData(username, response, token) {
		return fetch(
			`${
				import.meta.env.VITE_API_URL
			}/iam/api/candidates?recruiter=${username}&response=${response}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
			}
		).then(resp => resp.json());
	}

	static getConfirmEmail(hashCode) {
		return fetch(
			`${import.meta.env.VITE_API_URL}/iam/api/confirm?id=${hashCode}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		).then(resp => resp.json());
	}

	static verifyEmail(body, token) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/verifyemail`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${token}`,
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static verifyUser({ Email }) {
		return fetch(
			`${import.meta.env.VITE_API_URL}/auth/check-email/${Email}`
		).then(resp => resp);
	}

	static addJobHistory(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/jobhistory/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static removeJobHistory(id) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/jobhistory/${id}/`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(resp => resp.json());
	}

	static getJobHistory(hashCode) {
		return fetch(
			`${import.meta.env.VITE_API_URL}/iam/api/jobhistory?id=${hashCode}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		).then(resp => resp.json());
	}

	static sendEmploymentRequestEmail(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/candidateemail/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static sendRefereeRequestEmail(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/refereeemail`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static getRefereeDetails(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/referee`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static getCandidateDetails(hashCode) {
		return fetch(
			`${import.meta.env.VITE_API_URL}/iam/api/candidatedetails?id=${hashCode}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		).then(resp => resp.json());
	}

	static updateJobHistory(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/updatehistory`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static questionnaireResponse(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/questionnaireresponse/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static updateRefereeNames(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/updatereferee`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static updateRefereeDetails(body) {
		return fetch(
			`${import.meta.env.VITE_API_URL}/iam/api/update/refereehistory`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			}
		).then(resp => resp.json());
	}

	static updateRefereeResponse(body) {
		return fetch(
			`${import.meta.env.VITE_API_URL}/iam/api/update/referee/response`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			}
		).then(resp => resp.json());
	}

	static getQuestionnaireData(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/questionnaire/data`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static updateRequestResponse(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/update/response`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static filterRequests(body, token) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/filter/requests`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${token}`,
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static getRefereeResponseCount(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/response/count`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static getUserData(body, token) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${token}`,
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static updateUserData(body, token) {
		return fetch(
			`${import.meta.env.VITE_API_URL}/auth/edit/admin/${localStorage.getItem(
				'id'
			)}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token,
				},
				body: JSON.stringify(body),
			}
		).then(resp =>
			resp?.status >= 200 && resp?.status <= 300 ? resp?.json?.() : 'error'
		);
	}

	static updateClientUserData(body, token) {
		return fetch(
			`${import.meta.env.VITE_API_URL}/auth/edit/user/${localStorage.getItem(
				'id'
			)}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token,
				},
				body: JSON.stringify(body),
			}
		).then(resp =>
			resp?.status >= 200 && resp?.status <= 300 ? resp?.json?.() : 'error'
		);
	}

	static updatePassword(body, token) {
		return fetch(`${import.meta.env.VITE_API_URL}/auth/change-password`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token,
			},
			body: JSON.stringify(body),
		}).then(resp =>
			resp?.status >= 200 && resp?.status <= 300 ? resp?.json?.() : resp
		);
	}

	static updateProfileImg(body, token) {
		return fetch(
			`${import.meta.env.VITE_API_URL}/iam/api/update/profileImage`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
				body: JSON.stringify(body),
			}
		).then(resp => resp.json());
	}

	static getQuestionnaires(token) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/questionnaires/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${token}`,
			},
		}).then(resp => resp.json());
	}

	static getJobHistorybyId(id) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/jobhistory/${id}/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(resp => resp.json());
	}

	static updateCandidateJobHistory(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/update/jobhistory`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static sendRefCompleteMail(body) {
		return fetch(
			`${import.meta.env.VITE_API_URL}/iam/api/reference/complete/email`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			}
		).then(resp => resp.json());
	}

	static updateLifeCycle(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/lifecycle/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static getLifeCycleData(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/lifecycle/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static getIPAddress() {
		return fetch('https://api.ipify.org?format=json').then(resp => resp.json());
	}

	static getCountryISO(ip) {
		return fetch('http://ip-api.com/json/' + ip, {
			headers: {
				Accept: 'application/json',
			},
		}).then(resp => resp.json());
	}

	static updateFeedback(body) {
		return fetch(
			`${import.meta.env.VITE_API_URL}/iam/api/update/referee/feedback`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			}
		).then(resp => resp.json());
	}

	static addTemplate(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/templatebuilder/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static getUserTemplates(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/user/templates`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static updateUserTemplates(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/update/templates`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static getTemplates(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/templates`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static getCompetency() {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/competency/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(resp => resp.json());
	}

	static getCompetencyQuestions(body) {
		return fetch(
			`${import.meta.env.VITE_API_URL}/iam/api/competency/questions/`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			}
		).then(resp => resp.json());
	}

	static addQuestion(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/qbuilder/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}

	static getQuestionBuilder(body) {
		return fetch(`${import.meta.env.VITE_API_URL}/iam/api/qb/questions/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then(resp => resp.json());
	}
}
