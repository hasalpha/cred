import { useMutation, useQuery } from '@tanstack/react-query';
import {
	deletePaymentCard,
	getBillingInformation,
	getClientObject,
	getCustomerSession,
	getInvoices,
	getPaymentCard,
	postBillingInformation,
	postPayInvoice,
	postPaymentCard,
	putBillingInformation,
	putPaymentCard,
} from './billing-apis';
import Cookies from 'js-cookie';

export function useGetPaymentCard() {
	const { data } = useGetClientObject();
	return useQuery({
		queryKey: [data?.payment_card, 'payment-cards'],
		queryFn: getPaymentCard,
		staleTime: 1000 * 60 * 60,
		retry: 0,
		enabled: !!data?.payment_card,
	});
}

export function usePostPaymentCard() {
	return useMutation({
		mutationKey: ['payment-cards'],
		mutationFn: postPaymentCard,
	});
}

export function usePutPaymentCard() {
	return useMutation({
		mutationKey: ['payment-cards'],
		mutationFn: putPaymentCard,
	});
}

export function useDeletePaymentCard() {
	return useMutation({
		mutationKey: ['payment-cards'],
		mutationFn: deletePaymentCard,
	});
}

export function useGetClientObject() {
	const organizationUUID = Cookies.get('organizationUUID');
	return useQuery({
		queryKey: [organizationUUID, 'client-object'],
		queryFn: getClientObject,
		enabled: !!organizationUUID,
		staleTime: 1000 * 60 * 60,
		retry: 0,
	});
}

export function useGetInvoices() {
	return useQuery({
		queryKey: ['invoices'],
		queryFn: getInvoices,
		staleTime: 1000 * 10,
	});
}

export function usePostBillingInformation() {
	return useMutation({
		mutationKey: ['post-billing'],
		mutationFn: postBillingInformation,
	});
}

export function useGetBillingInformation() {
	const { data } = useGetClientObject();
	return useQuery({
		queryKey: [data?.billing, 'billing'],
		queryFn: getBillingInformation,
		enabled: !!data?.billing,
		staleTime: 1000 * 60 * 60,
	});
}

export function usePutBillingInformation() {
	return useMutation({
		mutationKey: ['put-billing'],
		mutationFn: putBillingInformation,
	});
}

export function usePostPayInvoice() {
	return useMutation({
		mutationKey: ['post-pay-invoice'],
		mutationFn: postPayInvoice,
	});
}

export function useCustomerSession() {
	const uuid = Cookies.get('organizationUUID');
	return useQuery({
		queryKey: ['customer-session'],
		queryFn: getCustomerSession,
		enabled: !!uuid,
		staleTime: 1000 * 60 * 60,
		retry: 1,
	});
}
