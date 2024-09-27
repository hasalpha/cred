import { lazily } from 'react-lazily';
import { Suspense, lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import type { BackgroundCheckRequests } from './background-check/types';
import setAuthorizationBearerToken, {
	getBackgroundCheck,
} from '../../apis/user.api';
import Cookies from 'js-cookie';
import React from 'react';
import { LoadingBackdrop } from '../../components';
import { Report } from './Report';
import { ReportPageTwo } from './Report2';

const { GenericErrorElement } = lazily(
	() => import('../../components/GenericErrorElement')
);
const { BackgroundCheckResultPage } = lazily(() => import('.'));
const { RedirectPage } = lazily(() => import('./RedirectPage'));
const {
	Lead1,
	Lead2,
	NewJobHistorySuccess,
	ReferenceStatus,
	Settings,
	TemplateBuilderHome,
} = lazily(() => import('../../components'));

const SignUp = lazy(() => import('../auth/SignUp'));
const ForgotPassword = lazy(() => import('../auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../auth/ResetPassword'));
const UserVerified = lazy(() => import('../auth/UserVerified'));
const AuthMessage = lazy(() => import('../auth/AuthMessage'));
const ReVerifyEmail = lazy(() => import('../auth/ReVerifyEmail'));
const SuperAdminLogin = lazy(() => import('../auth/SuperAdminLogin'));
const SuperAdminRecoverAcc = lazy(() => import('../auth/SuperAdminRecoverAcc'));
const User = lazy(() => import('./User'));
const Requests = lazy(() => import('./Requests'));
const NewRequestV2 = lazy(() => import('./new-request-v2/NewRequestV2'));
const Questionnaires = lazy(() => import('../../components/Questionnaires'));
const TemplateBuilderMain = lazy(
	() => import('../../components/TemplateBuilder_Main')
);
const CandidateSummary = lazy(
	() => import('../../components/CandidateSummary')
);
const BackgroundCheck = lazy(() => import('./background-check'));
const TermsAndConditions = lazy(() => import('../auth/TermsAndConditions'));
const CandidateRequestCheck = lazy(
	() => import('../../components/CandidateRequestCheck')
);
const JobInformation = lazy(() => import('../../components/JobInformation'));
const EditJobInformation = lazy(
	() => import('../../components/EditJobInformation')
);
const JobHistory = lazy(() => import('../../components/JobHistory'));
const JobHistoryRequestCheck = lazy(
	() => import('../../components/JobHistoryRequestCheck')
);
const RefereeBegin = lazy(() => import('../../components/RefereeBegin'));
const RefereeBasics = lazy(() => import('../../components/RefereeVerify'));
const RefereeQuestionnaire = lazy(
	() => import('../../components/RefereeQuestionnaire')
);
const JobSummary = lazy(() => import('../../components/JobSummary'));
const RefereeReview = lazy(() => import('../../components/RefereeReview'));
const RefereeDecline = lazy(() => import('../../components/RefereeDecline'));
const RedirectComponent = lazy(() => import('./RedirectComponent'));
const SignIn = lazy(() => import('../auth/SignIn'));
const GenericRedirectComponent = lazy(
	() => import('../../components/GenericRedirectComponent')
);
const ConsumerPoliceCheckLayout = lazy(
	() => import('./consumer-police-check/components/ConsumerPoliceCheckLayout')
);
const ConsumerPoliceCheck = lazy(
	() => import('./consumer-police-check/ConsumerPoliceCheckIndex')
);
const ConsumerPoliceCheckStart = lazy(
	() => import('./consumer-police-check/ConsumerPoliceCheckStart')
);
const ConsumerPoliceCheckBiometricConsent = lazy(
	() => import('./consumer-police-check/ConsumerPoliceCheckConsent')
);
const ConsumerPoliceCheckPersonalInformation = lazy(
	() => import('./consumer-police-check/ConsumerPoliceCheckPersonalInformation')
);

const PoliceCheckMultiStepLayout = lazy(
	() => import('./consumer-police-check/components/PoliceCheckMultiStepLayout')
);

const ConsumerPoliceCheckAddress = lazy(
	() => import('./consumer-police-check/ConsumerPoliceCheckAddress')
);

const ConsumerPoliceCheckIdentityVerification = lazy(
	() =>
		import('./consumer-police-check/ConsumerPoliceCheckIdentityVerification')
);

const ConsumerPoliceCheckPreview = lazy(
	() => import('./consumer-police-check/ConsumerPoliceCheckPreview')
);

const ConsumerPoliceCheckPayment = lazy(
	() => import('./consumer-police-check/ConsumerPoliceCheckPayment')
);

const ConsumerPoliceCheckThankYou = lazy(
	() => import('./consumer-police-check/ThankYou')
);

export function getUserRoutes() {
	return (
		<React.Fragment>
			<Route
				path='signin'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<SignIn />
					</Suspense>
				}
			/>
			<Route
				path=''
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<GenericRedirectComponent />
					</Suspense>
				}
			/>
			<Route
				path='signup'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<SignUp />
					</Suspense>
				}
			/>
			<Route
				path='forgot-password'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<ForgotPassword />
					</Suspense>
				}
			/>
			<Route
				path='reset-password'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<ResetPassword />
					</Suspense>
				}
			/>
			<Route
				path='verify-email/:email/:name/:token'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<UserVerified />
					</Suspense>
				}
			/>
			<Route
				path='success'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<AuthMessage />
					</Suspense>
				}
			/>
			<Route
				path='reverify-email'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<ReVerifyEmail />
					</Suspense>
				}
			/>
			<Route
				path='admin-login'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<SuperAdminLogin />
					</Suspense>
				}
			/>
			<Route
				path='admin-recover-account'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<SuperAdminRecoverAcc />
					</Suspense>
				}
			/>
			<Route
				path={'home/*'}
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<User />
					</Suspense>
				}
				loader={() => setAuthorizationBearerToken()}
				errorElement={
					<Suspense fallback={<LoadingBackdrop />}>
						<GenericErrorElement />
					</Suspense>
				}
			>
				<Route
					path='requests'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<Requests />
						</Suspense>
					}
				/>
				<Route
					path='add-new-request'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<NewRequestV2 />
						</Suspense>
					}
				/>
				<Route
					path='questionnaires'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<Questionnaires />
						</Suspense>
					}
				/>
				<Route
					path='template-homepage'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<TemplateBuilderHome />
						</Suspense>
					}
				/>
				<Route
					path='settings'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<Settings />
						</Suspense>
					}
				/>
				<Route
					path='template-builder'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<TemplateBuilderMain />
						</Suspense>
					}
				/>
				<Route
					path='template-builder/:questionnaireUUID'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<TemplateBuilderMain />
						</Suspense>
					}
				/>
				<Route
					path='candidate/summary/:id'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<CandidateSummary />
						</Suspense>
					}
				/>
				<Route
					path='reference/status/:candidateId/:jobId'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<ReferenceStatus />
						</Suspense>
					}
				/>
				<Route
					path='background-check'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<BackgroundCheck />
						</Suspense>
					}
					loader={async () => {
						if (!Cookies.get('refresh')) return [];
						const response = (await getBackgroundCheck({})) as {
							results: BackgroundCheckRequests;
						};
						return response.results.sort((a, b) => {
							const dateA = a.webhook_hit_at ? a.webhook_hit_at : a.created_at;
							const dateB = b.webhook_hit_at ? b.webhook_hit_at : b.created_at;
							return new Date(dateA) > new Date(dateB) ? 1 : -1;
						});
					}}
				/>
				<Route
					path='background-check/:uuid'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<BackgroundCheckResultPage />
						</Suspense>
					}
				/>
				<Route
					path='*'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<RedirectPage />
						</Suspense>
					}
				/>
			</Route>
			<Route
				path='terms-and-conditions'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<TermsAndConditions />
					</Suspense>
				}
			/>
			<Route
				path='candidate-job-history/:name/:id'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<CandidateRequestCheck />
					</Suspense>
				}
			/>
			<Route
				path='job-info/:name/:id'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<JobInformation />
					</Suspense>
				}
			/>
			<Route
				path='edit-job-info/:name/:id/:candidateHash'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<EditJobInformation />
					</Suspense>
				}
			/>
			<Route
				path='job-history/:name/:id'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<JobHistory />
					</Suspense>
				}
			/>
			<Route
				path='jobHistory/:candidateName/:refereeName/:id'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<JobHistoryRequestCheck />
					</Suspense>
				}
			/>
			<Route
				path='referee-accept/:candidateName/:refereeName/:id'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<RefereeBegin />
					</Suspense>
				}
			/>
			<Route
				path='referee-verify/:candidateName/:refereeName/:id'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<RefereeBasics />
					</Suspense>
				}
			/>
			<Route
				path='referee-questionnaire/:candidateName/:refereeName/:id'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<RefereeQuestionnaire />
					</Suspense>
				}
			/>
			<Route
				path='lead-to-hire/:candidateName/:refereeName/:id'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<Lead1 />
					</Suspense>
				}
			/>
			<Route
				path='lead-to-job/:candidateName/:refereeName/:id'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<Lead2 />
					</Suspense>
				}
			/>
			<Route
				path='referee-summary/:candidateName/:refereeName/:id'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<NewJobHistorySuccess />
					</Suspense>
				}
			/>
			<Route
				path='job-summary/:name/:id'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<JobSummary />
					</Suspense>
				}
			/>
			<Route
				path='job-history-complete/:candidateName/:id'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<NewJobHistorySuccess />
					</Suspense>
				}
			/>
			<Route
				path='referee-review/:name/:candidateHash/:refereeHash'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<RefereeReview />
					</Suspense>
				}
			/>
			<Route
				path='jobHistory/decline/:candidateName/:refereeName/:id'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<RefereeDecline />
					</Suspense>
				}
			/>
			<Route
				path={'reverification/:UUID'}
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<RedirectComponent />
					</Suspense>
				}
			/>
			<Route
				path={'register/:UUID'}
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<RedirectComponent />
					</Suspense>
				}
			/>
			<Route
				path={'password-reset/:UUID'}
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<RedirectComponent />
					</Suspense>
				}
			/>
			<Route
				path='cbc'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<ConsumerPoliceCheckLayout />
					</Suspense>
				}
			>
				<Route
					index
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<ConsumerPoliceCheck />
						</Suspense>
					}
				/>
				<Route
					path='notice'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<ConsumerPoliceCheckStart />
						</Suspense>
					}
				/>
				<Route
					path='consent'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<ConsumerPoliceCheckBiometricConsent />
						</Suspense>
					}
				/>
				<Route
					path='start'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<PoliceCheckMultiStepLayout />
						</Suspense>
					}
				>
					<Route
						path='personal-information'
						element={<ConsumerPoliceCheckPersonalInformation />}
					/>
					<Route
						path='address'
						element={
							<Suspense fallback={<LoadingBackdrop />}>
								<ConsumerPoliceCheckAddress />
							</Suspense>
						}
					/>
					<Route
						path='identity-verification'
						element={
							<Suspense fallback={<LoadingBackdrop />}>
								<ConsumerPoliceCheckIdentityVerification />
							</Suspense>
						}
					/>
					<Route
						path='preview'
						element={
							<Suspense fallback={<LoadingBackdrop />}>
								<ConsumerPoliceCheckPreview />
							</Suspense>
						}
					/>
					<Route
						path='payment'
						element={
							<Suspense fallback={<LoadingBackdrop />}>
								<ConsumerPoliceCheckPayment />
							</Suspense>
						}
					/>
					<Route
						path='*'
						element={<Navigate to='/cbc/start/personal-information' />}
					/>
				</Route>
				<Route
					path='thank-you'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<ConsumerPoliceCheckThankYou />
						</Suspense>
					}
				/>
			</Route>
			<Route
				path='test'
				element={<Report />}
			/>
			<Route
				path='test2'
				element={<ReportPageTwo />}
			/>
		</React.Fragment>
	);
}
