import {
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {
	FilterClients,
	FilterUser,
	GetAllUsers,
	GetClients,
	GetReports,
	GetFlags,
	GetAllChecks,
} from '../apis';
import Cookies from 'js-cookie';
import { useAuth } from './AuthContext';
import { FlagObject } from '../pages/admin-console/Types';

const sampleClient = {
	uuid: 'cde7d5c8-3db3-4e6c-afb1-21b415997e3a',
	created_at: '2022-11-17T19:14:44.364612Z',
	updated_at: '2023-08-14T19:08:33.765830Z',
	country: 'Angola',
	state: 'Cunene',
	organization: 'Aaaup',
	noOfStaff: '1-20',
	is_active: true,
	is_lead_generation_job: true,
	is_lead_generation_candidate: true,
	is_background_check: true,
	app_logo: '',
	app_domain: '',
	app_title: '',
	primary_btn_bg_color: '',
	secondry_btn_bg_color: '',
	primary_btn_txt_color: '',
	secondry_btn_txt_color: '',
	brand_primary_color: '',
	brand_secondry_color: '',
	brand_tertiary_color: '',
	link_txt: '',
	subject: '',
	body: null,
	white_label_enabled: true,
	is_archived: false,
	archived_at: '2023-07-24T11:49:09.291672Z',
	is_sms_allow: false,
};

export type Client = Omit<typeof sampleClient, 'app_logo'> & {
	app_logo: string | null;
};

type SuperAdminContextType = {
	clients: Client[];
	Allclients: Client[];
	fetchClients: () => Promise<void>;
	fetchAllUsers: () => Promise<void>;
	fetchAllChecks: () => Promise<void>;
	flags: FlagObject[];
	[k: string]: any;
};

const SuperAdminContext = createContext<null | SuperAdminContextType>(null);

export function useSuperAdminContext() {
	const context = useContext(SuperAdminContext);
	if (!context)
		throw new Error('Not a child of SuperAdminProvider', {
			cause: 'Not wrapped by the provider',
		});
	return context;
}

const SuperAdminProvider = ({ children }: { children: ReactNode }) => {
	const { refreshToken } = useAuth();
	const [clients, setClients] = useState<Client[]>([]);
	const [Allclients, setAllClients] = useState<Client[]>([]);
	const [reports, setReports] = useState({});
	const [users, setUsers] = useState([]);
	const [usersLoading, setUsersLoading] = useState(true);
	const [admins, setAdmins] = useState([]);
	const [adminsLoading, setAdminsLoading] = useState(true);
	const [clientsLoading, setClientsLoading] = useState(true);
	const [counter, setCounter] = useState(0);
	const accessToken = Cookies.get('access');
	const [search, setSearch] = useState('');
	const [flags, setFlags] = useState<FlagObject[]>([]);
	const [flagsLoading, setflagsLoading] = useState(true);
	const [AllChecks, setAllChecks] = useState<Array<any>>([]);

	const handleSearchText = useCallback(async (e: any) => {
		if (e == null) return;
		setInputSearchValue(e?.target?.value);
		const resp = await GetClients();
		let search = e?.target?.value;

		if (resp) {
			const filteredData = resp.data.results?.flatMap((item: any) => {
				let p = item?.country ? item?.country.toLowerCase() : '';
				let q = item?.state ? item?.state.toLowerCase() : '';
				let r = item?.organization ? item?.organization.toLowerCase() : '';
				let a = p + q + r;
				let b = a.match(search ? search.toLowerCase() : '');
				if (b != null) return [item];
				return [];
			});
			if (filteredData.length === 0) {
			}
			setClients(filteredData);
		}
	}, []);

	const handleUserSearchText = useCallback(async (e: any) => {
		if (e == null) return;
		setInputSearchValue(e?.target?.value);
		const resp = await GetAllUsers();
		let search = e?.target?.value;
		if (resp) {
			const filteredData = resp.data.results.users?.flatMap((item: any) => {
				let p = item?.email ? item?.email.toLowerCase() : '';
				let q = item?.firstName ? item?.firstName.toLowerCase() : '';
				let r = item?.organization ? item?.organization.toLowerCase() : '';
				let s = item?.lastName ? item?.lastName.toLowerCase() : '';
				let t = item?.country ? item?.country.toLowerCase() : '';
				let a = p + r + ' - ' + t + q + ' ' + s;
				let b = a.match(search ? search.toLowerCase() : '');
				if (b != null) return [item];
				return [];
			});
			if (filteredData.length === 0) {
			}
			setUsers(filteredData);
		}
	}, []);

	const handleAdminSearchText = useCallback(async (e: any) => {
		if (e == null) return;
		setInputSearchValue(e?.target?.value);
		const resp = await GetAllUsers();
		let search = e?.target?.value;

		if (resp) {
			const filteredData = resp.data.results.admins?.flatMap((item: any) => {
				let p = item?.email ? item?.email.toLowerCase() : '';
				let q = item?.firstName ? item?.firstName.toLowerCase() : '';
				let r = item?.organization ? item?.organization.toLowerCase() : '';
				let s = item?.lastName ? item?.lastName.toLowerCase() : '';
				let t = item?.country ? item?.country.toLowerCase() : '';
				let a = p + r + ' - ' + t + q + ' ' + s;
				console.log(a, search);
				let b = a.match(search ? search.toLowerCase() : '');
				if (b != null) return [item];
				return [];
			});

			if (filteredData.length === 0) {
			}
			setAdmins(filteredData);
		}
	}, []);

	const handleUserFilterText = useCallback(
		(
			clienId: string,
			is_active: string | boolean,
			user_type: any,
			searchText: string
		) =>
			async () => {
				const resp = await FilterUser({
					organization: `${clienId}`,
					is_active: is_active,
					user_type: user_type,
				});
				if (resp?.data?.datalength === 0) {
				}
				if (searchText !== '') {
					const filteredData = resp?.data?.data?.flatMap((item: any) => {
						let p = item?.email ? item?.email.toLowerCase() : '';
						let q = item?.firstName ? item?.firstName.toLowerCase() : '';
						let r = item?.organization ? item?.organization.toLowerCase() : '';
						let s = item?.lastName ? item?.lastName.toLowerCase() : '';
						let a = p + q + r + s;
						let b = a.match(searchText ? searchText.toLowerCase() : '');
						if (b != null) return [item];
						return [];
					});

					if (filteredData.length === 0) {
					}
					if (user_type === 'CLIENT_USER') {
						setUsers(filteredData);
					} else if (user_type === 'CLIENT_ADMIN') {
						setAdmins(filteredData);
					}
				} else {
					if (user_type === 'CLIENT_USER') {
						setUsers(resp?.data?.data);
					} else if (user_type === 'CLIENT_ADMIN') {
						setAdmins(resp?.data?.data);
					}
				}
			},
		[setUsers, setAdmins]
	);

	const handleClearFilterText = useCallback(
		async (user_type: string) => {
			const resp = await GetAllUsers();
			if (resp.status === 200 && user_type === 'CLIENT_USER') {
				setUsers(resp?.data?.users);
			} else if (resp.status === 200 && user_type === 'CLIENT_ADMIN') {
				setAdmins(resp?.data?.admins);
			}
		},
		[setUsers, setAdmins]
	);

	const handleClientFilterText = useCallback(
		(is_active: boolean | string, searchText: string) => async () => {
			const resp = await FilterClients({
				is_active: is_active,
			});
			if (resp?.data?.count !== 0) {
				if (searchText !== '') {
					const filteredData = resp.data.results?.flatMap((item: any) => {
						let p = item?.country ? item?.country.toLowerCase() : '';
						let q = item?.state ? item?.state.toLowerCase() : '';
						let r = item?.organization ? item?.organization.toLowerCase() : '';
						let a = p + q + r;
						let b = a.match(searchText);
						if (b != null) return [item];
						return [];
					});

					if (filteredData.length === 0) {
					}
					setClients(filteredData);
				} else {
					setClients(resp.data.results);
				}
			}
		},
		[]
	);

	const superAdminReportsFilter = useCallback(
		(startDate: any, endDate: any, clientId: any) => async () => {
			const resp = await GetReports(startDate, endDate, clientId);
			if (resp?.data?.count !== 0) {
				setReports(resp?.data);
			}
		},
		[setReports]
	);

	const handleClientClearFilterText = useCallback(async () => {
		// setInputSearchValue("")
		const resp = await GetClients();
		if (resp?.data?.count !== 0) {
			setClients(resp.data.results);
		}
	}, [setClients]);

	const fetchAllUsers = useCallback(async () => {
		const resp = await GetAllUsers();
		if (resp.status === 200) {
			setUsers(resp.data.results.users);
			setAdmins(resp.data.results.admins);
		}
		setUsersLoading(false);
		setAdminsLoading(false);
	}, []);

	const fetchClients = useCallback(async () => {
		const resp = await GetClients();
		if (resp.status === 200) {
			setClients(resp.data.results);
			setAllClients(resp.data.results);
		}
		setClientsLoading(false);
	}, []);

	const fetchAllChecks = useCallback(async () => {
		const resp = await GetAllChecks();
		if (resp.status === 200) {
			setAllChecks(resp.data.results);
		}
	}, []);

	const fetchFlags = useCallback(async () => {
		const resp = await GetFlags();
		if (resp.status === 200) {
			setFlags(resp.data.results);
		}
		setflagsLoading(false);
	}, []);

	useEffect(() => {
		if (refreshToken && accessToken) {
			fetchAllUsers();
			fetchAllChecks();
		}
	}, [accessToken, fetchAllUsers, refreshToken, fetchAllChecks]);

	const [InputSearchValue, setInputSearchValue] = useState('');

	const value = useMemo(
		() => ({
			clients,
			clientsLoading,
			counter,
			setCounter,
			setClients,
			setReports,
			Allclients,
			setAllClients,
			reports,
			users,
			setUsers,
			admins,
			setAdmins,
			usersLoading,
			adminsLoading,
			handleSearchText,
			handleUserSearchText,
			handleAdminSearchText,
			handleUserFilterText,
			handleClearFilterText,
			handleClientFilterText,
			superAdminReportsFilter,
			handleClientClearFilterText,
			fetchClients,
			fetchAllUsers,
			search,
			setSearch,
			InputSearchValue,
			flags,
			setFlags,
			fetchFlags,
			flagsLoading,
			AllChecks,
			setAllChecks,
			fetchAllChecks,
		}),
		[
			clients,
			clientsLoading,
			counter,
			setCounter,
			setClients,
			setReports,
			Allclients,
			setAllClients,
			users,
			reports,
			setUsers,
			admins,
			setAdmins,
			usersLoading,
			adminsLoading,
			handleSearchText,
			handleUserSearchText,
			handleAdminSearchText,
			handleUserFilterText,
			handleClearFilterText,
			handleClientFilterText,
			superAdminReportsFilter,
			handleClientClearFilterText,
			fetchClients,
			fetchAllUsers,
			search,
			setSearch,
			InputSearchValue,
			flags,
			setFlags,
			fetchFlags,
			flagsLoading,
			AllChecks,
			setAllChecks,
			fetchAllChecks,
		]
	);

	return (
		<SuperAdminContext.Provider value={value}>
			{children}
		</SuperAdminContext.Provider>
	);
};

export { SuperAdminContext, SuperAdminProvider };
