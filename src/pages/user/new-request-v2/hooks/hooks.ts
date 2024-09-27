import { useMutation, useQuery } from '@tanstack/react-query';
import {
	getBillingInfo,
	getCardSession,
	postBackgroundCheckV2,
} from '../api/api';

export function usePostBackgroundCheckV2() {
	return useMutation({
		mutationKey: ['post-background-check-v2'],
		mutationFn: postBackgroundCheckV2,
		retry: false,
	});
}

export function useBillingInfo() {
	return useQuery({
		queryFn: getBillingInfo,
		queryKey: ['billing-info'],
		staleTime: 1000 * 60,
	});
}

export function useCardSession() {
	return useQuery({
		queryFn: getCardSession,
		queryKey: ['card-session'],
		staleTime: 1000 * 60 * 60,
	});
}
