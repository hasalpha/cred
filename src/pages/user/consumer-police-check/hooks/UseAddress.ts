import { AddressSchema } from '../ConsumerPoliceCheckAddress';
import { composeStore } from 'utils/composeStore';

type AddressAndCrjmc = {
	addresses: AddressSchema[];
};

const initialState = {
	addresses: [],
} satisfies AddressAndCrjmc;

export const useAddress = composeStore<AddressAndCrjmc>({
	name: 'addresses',
	initialState,
});
