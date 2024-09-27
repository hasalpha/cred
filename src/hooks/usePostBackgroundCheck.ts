import { useMutation } from '@tanstack/react-query';
import { BackgroundCheckBody } from '../apis/types/user-api-types';
import { doBackgroundCheck } from '../apis/user.api';

export default function usePostBackgroundCheck() {
	return useMutation({
		mutationKey: ['backgroundcheck'],
		mutationFn: async (body: BackgroundCheckBody) => {
			return await doBackgroundCheck(body);
		},
	});
}
