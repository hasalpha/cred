import { composeStore } from 'utils/composeStore';

const initialState = {
	uuid: '',
};

export const useConsumerPoliceStore = composeStore<typeof initialState>({
	name: 'index-store',
	initialState,
	storage: window.localStorage,
});
