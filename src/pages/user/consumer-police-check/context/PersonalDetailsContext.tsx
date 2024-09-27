import { BgCheckResponseInterface, useGetSessionQuery } from 'apis/user.api';
import { LoadingBackdrop } from 'components';
import { ReactNode, createContext, useContext } from 'react';

const context = createContext<BgCheckResponseInterface | null>(null);

export function useGetSessionContextData() {
	const data = useContext(context);
	if (!data)
		throw new Error(
			'Cannot use this custom hook without the SessionContext provider'
		);
	return data;
}

export function PoliceSessionContextProvider(props: { children: ReactNode }) {
	const { status, data } = useGetSessionQuery();

	if (status === 'pending') {
		return <LoadingBackdrop />;
	}

	if (status === 'error') {
		return <h1>Unable to fetch current session!</h1>;
	}

	return (
		<context.Provider
			value={data}
			{...props}
		/>
	);
}
