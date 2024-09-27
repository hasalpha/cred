import { useMutation } from '@tanstack/react-query';
import {
	BackgroundCheckParams,
	PartialNull,
} from '../apis/types/user-api-types';
import { getBackgroundCheck } from '../apis/user.api';
import { BackgroundCheckRequests } from '../pages/user/background-check/types';

export default function useFilterMutation() {
	return useMutation({
		mutationKey: ['filter'],
		mutationFn: async (params: Partial<PartialNull<BackgroundCheckParams>>) => {
			const response = await getBackgroundCheck(params);
			return response.results as BackgroundCheckRequests;
		},
	});
}
