import axios from 'axios';

export const baseURL = import.meta.env.VITE_API_URL;
export const Api = axios.create({
	baseURL: baseURL,
	headers: {
		'Content-Type': 'application/json',
		accept: 'application/json',
	},
});

// Api.interceptors.response.use(
// 	res => res,
// 	err => {
// 		Sentry.captureException(err);
// 		return Promise.reject(err);
// 	}
// );

export {
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
	contactsGetAPI,
	contactsPostAPI,
	contactsPutAPI,
	contactsDeleteAPI,
	UserBannerGetAPI,
} from './auth.api';

export {
	GetClientAdmins,
	GetClientUsers,
	CreateAdmin,
	CreateUser,
	EditClientUser,
	EditAdminUser,
} from './admin.api';

export {
	createCandidate,
	getCandidatesList,
	getCandidateData,
	getSummaryCount,
	getCandidateSummary,
	addToArchive,
	addJobHistory,
	getJobHistory,
	getJobHistorybyId,
	updateCandidateJobHistory,
	removeJobHistory,
	sendEmail,
	addQuestionnaireResponse,
	getQuestionnaireResponse,
	updateLifeCycle,
	sendCompleteEmail,
	getCandidateLifeCycle,
	sendRefereeDeclineMail,
	getPDF,
	getMinReference,
	getUserFlags,
} from './user.api';

export {
	GetClients,
	GetAllUsers,
	GetClientObjectUUID,
	postClientObject as PostClientObject,
	CreateClientUsers,
	EditClientUsers,
	EditClient,
	FilterUser,
	FilterClients,
	GetReports,
	DeleteClient,
	downloadcsvreport,
	GetFlags,
	EditFlag,
	GetAllChecks,
	GetClientChecks,
	UpdateClientChecks,
	bannerGetAPI,
	bannerPostAPI,
	bannerPutAPI,
} from './super_admin.api';
