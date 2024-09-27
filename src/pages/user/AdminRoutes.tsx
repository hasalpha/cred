import { Navigate, Route } from 'react-router-dom';
import { GenericErrorElement } from '../../components/GenericErrorElement';
import { Suspense, lazy } from 'react';
import { LoadingBackdrop } from '../../components';
import { GetAllChecks } from 'apis';

const AdminLogin = lazy(() => import('../auth/AdminLogin'));
const AdminRegister = lazy(() => import('../auth/AdminRegister'));
const AdminConsole = lazy(() => import('../admin-console'));
const Reports = lazy(() => import('../admin-console/Reports'));
const SuperAdmins = lazy(() => import('../admin-console/Admins'));
const SuperAdminAddNewAdmin = lazy(
	() => import('../admin-console/AddNewAdmin')
);
const SuperAdminEditXMode = lazy(() => import('../admin-console/EditXMode'));
const EditAdminInfo = lazy(() => import('../admin-console/EditAdminInfo'));
const EditUserInfo = lazy(() => import('../admin-console/EditUserInfo'));
const SuperAdminClients = lazy(() => import('../admin-console/Clients'));
const SuperAdminAddNewClient = lazy(
	() => import('../admin-console/AddNewClient')
);
const SuperAdminEditClientInfo = lazy(
	() => import('../admin-console/EditClientInfo')
);
const SuperAdminAnnouncement = lazy(
	() => import('../admin-console/announcement')
);
const SuperAdminXMode = lazy(() => import('../admin-console/xmode'));
const SuperAdminUsers = lazy(() => import('../admin-console/Users'));
const SuperAdminAddNewUser = lazy(() => import('../admin-console/AddNewUser'));
const SuperAdminSettings = lazy(() => import('../admin-console/Settings'));
const SuperAdminAuditLog = lazy(() => import('../admin-console/AuditLog'));
const TemplateBuilderHome = lazy(
	() => import('../../components/TemplateBuilder')
);
const TemplateBuilderMain = lazy(
	() => import('../../components/TemplateBuilder_Main')
);
const ClientAdmin = lazy(() => import('../client-admin'));
const Questionnaires = lazy(() => import('../../components/Questionnaires'));
const AdminUsers = lazy(() => import('../client-admin/Users'));
const EditClientUserInfo = lazy(
	() => import('../client-admin/EditClientUserInfo')
);
const EditAdminUserInfo = lazy(
	() => import('../client-admin/EditAdminUserInfo')
);
const AdminSettings = lazy(() => import('../client-admin/Settings'));
const Billing = lazy(() => import('./billing/Billing'));
const DeleteClient = lazy(() => import('../../components/DeleteClient'));
const Admins = lazy(() => import('../client-admin/Admins'));
const AddNewAdmin = lazy(() => import('../client-admin/AddNewAdmin'));
const AddNewUser = lazy(() => import('../client-admin/AddNewUser'));

export function getAdminRoutes() {
	return (
		<>
			<Route
				path={'admin/login'}
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<AdminLogin />
					</Suspense>
				}
			/>
			<Route
				path={'admin/register'}
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<AdminRegister />
					</Suspense>
				}
			/>
			<Route
				path='super-admin/*'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<AdminConsole />
					</Suspense>
				}
				errorElement={<GenericErrorElement />}
			>
				<Route
					path={'reports'}
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<Reports />
						</Suspense>
					}
				/>
				<Route
					path={'admins'}
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<SuperAdmins />
						</Suspense>
					}
				/>
				<Route
					path={'admins/add-new-admin'}
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<SuperAdminAddNewAdmin />
						</Suspense>
					}
				/>
				<Route
					path={'admins/edit-admin-info/:email'}
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<EditAdminInfo />
						</Suspense>
					}
				/>
				<Route
					path={'users/edit-user-info/:email'}
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<EditUserInfo />
						</Suspense>
					}
				/>
				<Route
					path={'clients'}
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<SuperAdminClients />
						</Suspense>
					}
				/>
				<Route
					path={'clients/add-new-client'}
					loader={async args => {
						const resp = await GetAllChecks();
						if (resp.status === 200) {
							return resp.data.results;
						}
						throw new Error('Checks could not be returned!');
					}}
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<SuperAdminAddNewClient />
						</Suspense>
					}
					errorElement={<div>No checks found</div>}
				/>
				<Route
					path={'clients/edit-client-info/:uuid'}
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<SuperAdminEditClientInfo />
						</Suspense>
					}
				/>
				<Route
					path={'announcement'}
					element={<SuperAdminAnnouncement />}
				></Route>
				<Route
					path={'xmode'}
					element={<SuperAdminXMode />}
				>
					<Route
						path={'edit-xmode/:uuid'}
						element={<SuperAdminEditXMode />}
					/>
				</Route>
				<Route
					path={'users'}
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<SuperAdminUsers />
						</Suspense>
					}
				/>
				<Route
					path={'users/add-new-user'}
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<SuperAdminAddNewUser />
						</Suspense>
					}
				/>
				<Route
					path={'settings'}
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<SuperAdminSettings />
						</Suspense>
					}
				/>
				<Route
					path={'audit-log'}
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<SuperAdminAuditLog />
						</Suspense>
					}
				/>
				<Route
					path={''}
					element={<Navigate to='clients' />}
				/>
			</Route>
			<Route
				path='admin/template-builder'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<TemplateBuilderMain />
					</Suspense>
				}
			/>
			<Route
				path={'admin/*'}
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<ClientAdmin />
					</Suspense>
				}
				errorElement={
					<Suspense fallback={<LoadingBackdrop />}>
						<GenericErrorElement />
					</Suspense>
				}
			>
				<Route
					path='template-homepage'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<TemplateBuilderHome />
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
					path='users'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<AdminUsers />
						</Suspense>
					}
				/>
				<Route
					path='users/edit-user-info/:email'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<EditClientUserInfo />
						</Suspense>
					}
				/>
				<Route
					path='admins/edit-admin-info/:email'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<EditAdminUserInfo />
						</Suspense>
					}
				/>
				<Route
					path='add-new-user'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<AddNewUser />
						</Suspense>
					}
				/>

				<Route
					path='billing'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<Billing />
						</Suspense>
					}
				/>
				<Route
					path='settings'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<AdminSettings />
						</Suspense>
					}
				/>
				<Route
					path='add-new-admin'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<AddNewAdmin />
						</Suspense>
					}
				/>
				<Route
					path='admins'
					element={
						<Suspense fallback={<LoadingBackdrop />}>
							<Admins />
						</Suspense>
					}
				/>
				<Route
					path=''
					element={<Navigate to='users' />}
				/>
			</Route>
			<Route
				path='delete-client-object/approve/:uuid'
				element={
					<Suspense fallback={<LoadingBackdrop />}>
						<DeleteClient />
					</Suspense>
				}
			/>
		</>
	);
}
