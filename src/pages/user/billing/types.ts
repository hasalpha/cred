import { z } from 'zod';
import {
	billingSchema,
	cardResponse,
	cardSchema,
	clientObjectResponse,
	paymentCardResponse,
	sampleBillingData,
	sampleInvoice,
} from './schemas';

export type ClientObjectResponse = typeof clientObjectResponse;
export type CardResponse = typeof cardResponse;
export type PaymentCardResponse = typeof paymentCardResponse;
export type CardSchema = z.infer<typeof cardSchema>;
export type Tabs = 'invoices' | 'payment';
export type BillingSchema = z.infer<typeof billingSchema>;
export type BillingData = typeof sampleBillingData;
export type Invoice = typeof sampleInvoice;
