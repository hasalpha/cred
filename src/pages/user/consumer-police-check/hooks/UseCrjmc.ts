import { composeStore } from 'utils/composeStore';
import type { CJMRCSchema } from '../ConsumerPoliceCheckAddress';

type CJMRCSchemaWithBoolean = CJMRCSchema & {
	isConvicted: boolean;
};

const initialState = {
	isConvicted: false,
	offence: '',
	year_of_conviction: '',
	location: '',
	sentence: '',
};

export const useCrjmc = composeStore<CJMRCSchemaWithBoolean>({
	name: 'crjmc',
	initialState,
});
