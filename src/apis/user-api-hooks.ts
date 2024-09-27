import { useMutation, useQuery } from '@tanstack/react-query';
import { getClientPrices, getStripeReferences } from './user.api';
import { useParams } from 'react-router-dom';
import { Api } from 'apis';

export function useGetStripeReferences() {
	return useQuery({
		queryKey: ['stripe-references'],
		queryFn: getStripeReferences,
		staleTime: 1000 * 60,
	});
}

export function useGetClientPrices() {
	const { uuid } = useParams();
	return useQuery({
		queryKey: ['client-prices', uuid],
		async queryFn() {
			const prices = await getClientPrices(uuid!);
			const pricesMap = new Map(
				prices.map(v => [v.CheckType ?? v.type, v.price])
			);
			return pricesMap;
		},
		staleTime: 1000 * 60,
		enabled: !!uuid,
	});
}

const samplePost = {
	background: [
		{
			scan_id: 'fce01262-a957-43a1-9cd3-45d1cd543e02',
			price: 10,
		},
		{
			scan_id: 'e43b4327-519b-4a27-b70b-781e8b4c483c',
			price: 5,
		},
	],
	client_id: '73391116-ba4a-4190-8643-b63432f317b2',
	reference: {
		reference_id: '86ffd41b-d0d5-4456-b574-286d9710be93',
		price: 20,
	},
};

export type PostPrices = typeof samplePost;
export function usePostPrices() {
	return useMutation({
		mutationKey: ['post-prices'],
		mutationFn: (data: PostPrices) => {
			return Api.post(`/api/checks-pricing`, data);
		},
	});
}

export function usePutPrices() {
	return useMutation({
		mutationKey: ['put-prices'],
		mutationFn: (data: PostPrices) => {
			const { client_id, ...price } = data;
			return Api.put(`/api/checks-pricing/${client_id}`, price);
		},
	});
}
