import { QueryFunctionContext } from '@tanstack/react-query';
import { Api } from 'apis';
import {
	BillingData,
	BillingSchema,
	CardResponse,
	CardSchema,
	ClientObjectResponse,
	Invoice,
	PaymentCardResponse,
} from './types';
import Cookies from 'js-cookie';

export async function getInvoices() {
	return (await Api.get<Array<Invoice>>(`auth/get-invoice`)).data;
}

export async function postInvoices() {}

export async function getPaymentCard(context: QueryFunctionContext) {
	const uuid = context.queryKey.at(0);
	return (await Api.get<CardResponse>(`auth/payment-card/${uuid}`)).data;
}

export async function putPaymentCard({
	uuid,
	...data
}: CardSchema & { uuid: string }) {
	return await Api.put<PaymentCardResponse>(`auth/payment-card/${uuid}`, data);
}

export async function postPaymentCard(data: CardSchema) {
	return await Api.post<PaymentCardResponse>('auth/payment-card', data);
}

export async function deletePaymentCard(uuid: string) {
	return await Api.delete<PaymentCardResponse>(`auth/payment-card/${uuid}`);
}

export async function getClientObject(context: QueryFunctionContext) {
	const uuid = context.queryKey.at(0);
	return (await Api.get<ClientObjectResponse>(`auth/clientObject/${uuid}`))
		.data;
}

export async function postBillingInformation(data: BillingSchema) {
	return await Api.post<BillingData>('auth/client-billing', data);
}

export async function putBillingInformation({
	uuid,
	...data
}: BillingSchema & { uuid: string }) {
	return await Api.put<BillingData>(`auth/client-billing/${uuid}`, data);
}

export async function getBillingInformation(context: QueryFunctionContext) {
	const uuid = context.queryKey.at(0);
	return (await Api.get<BillingData>(`auth/client-billing/${uuid}`)).data;
}

export async function postPayInvoice({
	uuid,
	...data
}: CardSchema & { uuid: string }) {
	return await Api.post(`auth/pay-invoice/${uuid}`, data);
}

const cs = {
	'customer url': '',
};

type CustomerSession = typeof cs;

export async function getCustomerSession() {
	const uuid = Cookies.get('organizationUUID');
	return (await Api.get<CustomerSession>(`/auth/get-customer-session/${uuid}`))
		.data;
}
