import { composeStore } from 'utils/composeStore';

export type GenericStateOptions<T = {}> = {
	setStore: (store: Partial<T>) => void;
	resetStore: () => void;
};

const initialState = {
	firstName: '',
	middleName: '',
	lastName: '',
	email: '',
	confirmEmail: '',
	emailCheck: false,
	city: '',
	country: '',
	lastNameAtBirth: '',
	maidenName: '',
	sex: '',
	dateOfBirth: '',
	phone: '',
	hasAgreed: false,
};

export const usePersonalInformationStore = composeStore({
	name: 'personal-information',
	initialState,
});
