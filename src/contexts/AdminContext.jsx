import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { GetClientAdmins, GetClientUsers } from '../apis';
import Cookies from 'js-cookie';
const AdminContext = createContext();

export function useAdminContext() {
	const context = useContext(AdminContext);
	if (!context) {
		throw new Error(
			'useAdminContext can only be used withing the admin provider!'
		);
	}
	return context;
}

const AdminProvider = ({ children }) => {
	const [users, setUsers] = useState([]);
	const [admins, setAdmins] = useState([]);
	const [usersLoading, setUsersLoading] = useState(true);
	const [adminsLoading, setAdminsLoading] = useState(true);

	const handleSearchAdmins = useCallback(async e => {
		if (!e) return;
		const resp = await GetClientAdmins();
		let search = e?.target?.value;
		if (resp) {
			const filteredData = resp?.data?.results?.flatMap?.(item => {
				let a =
					item.firstName +
					item.lastName +
					item.email +
					item.action +
					item.phoneNumber;
				let b = a.match(search);
				if (b != null) return [item];
				return [];
			});
			setAdmins(filteredData);
		}
	}, []);

	const handleSearchText = useCallback(async e => {
		if (!e) return;
		const resp = await GetClientUsers();
		let search = e?.target?.value;
		if (resp) {
			const filteredData = resp?.data.results.flatMap?.(item => {
				let a =
					item.firstName +
					item.lastName +
					item.email +
					item.action +
					item.phoneNumber;
				let b = a.match(search);
				if (b != null) return [item];
				return [];
			});
			setUsers(filteredData);
		}
	}, []);

	useEffect(() => {
		if (Cookies.get('refresh') && Cookies.get('access')) {
			handleSearchText();
			handleSearchAdmins();
		}
	}, [handleSearchAdmins, handleSearchText]);

	const fetchUsers = useCallback(async () => {
		const resp = await GetClientUsers();
		if (resp.status === 200) setUsers(resp.data.results);
		setUsersLoading(false);
	}, []);

	const fetchAdmins = useCallback(async () => {
		const resp = await GetClientAdmins();
		if (resp.status === 200) setAdmins(resp.data.results);
		setAdminsLoading(false);
	}, []);

	const value = useMemo(
		() => ({
			fetchUsers,
			fetchAdmins,
			users,
			admins,
			usersLoading,
			adminsLoading,
			setUsers,
			setAdmins,
			handleSearchText,
			handleSearchAdmins,
		}),
		[
			admins,
			adminsLoading,
			fetchAdmins,
			fetchUsers,
			handleSearchAdmins,
			handleSearchText,
			users,
			usersLoading,
		]
	);

	return (
		<AdminContext.Provider value={value}>{children}</AdminContext.Provider>
	);
};

export { AdminContext, AdminProvider };
