import { useQuery } from '@tanstack/react-query';
import { getAllowedCheckTypes, getAllCheckType } from '../apis/user.api';

const checkTypesArray = [
	{
		uuid: '5ad9445f-d3a4-4751-a12e-a562959594b5',
		created_at: '2023-04-04T11:45:14Z',
		updated_at: '2023-06-15T12:59:13.766586Z',
		name: 'Enhanced Canadian Criminal Record Check',
		value: 'request_enhanced_criminal_record_check',
		description:
			'All of the searches included in the Canadian Criminal Record Check plus a search of the Police Information Portal (PIP) looking for: Criminal convictions for which a pardon has not been granted, and conditional and absolute discharges which have not been removed from the CPIC system. Probation information, Wanted person information, Accused person information, Peace bonds, Judicial orders, Warrants, Absolute and Conditional Discharges (If relevant), Criminal charges that have been withdrawn, dismissed or Stayed of Proceedings, Any negative contact with Police.',
		is_active: true,
		priority: 1,
	},
];

export type CheckTypeArray = typeof checkTypesArray;

export type CheckType = CheckTypeArray[number];

export function useCheckTypes() {
	return useQuery({
		queryKey: ['check-types'],
		queryFn: async () => {
			const results = await getAllowedCheckTypes();
			return results;
		},
	});
}

export function useAllCheckTypes() {
	return useQuery({
		queryKey: ['all-check-types'],
		queryFn: getAllCheckType,
		staleTime: 1000 * 60 * 60,
		select(data) {
			return data.results;
		},
	});
}
