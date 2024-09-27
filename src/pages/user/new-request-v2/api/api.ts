import { Api } from 'apis';

export type NewBackgroundCheckBody = {
	checkType: Array<string>;
	email: string;
};

export async function postBackgroundCheckV2(body: NewBackgroundCheckBody) {
	const response = await Api.post(`/api/backgoundCheck`, body);
	return response.data;
}

export async function getBillingInfo() {
	return await Api.get(`/auth/get-billing-info`);
}

type CardSession = {
	session_url: string;
};

export async function getCardSession() {
	return await Api.get<CardSession>(`/auth/card-session`);
}
