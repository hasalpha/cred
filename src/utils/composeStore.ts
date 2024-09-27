import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, persist } from 'zustand/middleware';
import { GenericStateOptions } from 'pages/user/consumer-police-check/hooks/UsePersonalInformation';

export function composeStore<K extends {} = {}>({
	name,
	initialState,
	storage = sessionStorage,
}: {
	name: string;
	initialState: K;
	storage?: typeof localStorage | typeof sessionStorage | null;
}) {
	if (storage) {
		return create(
			persist(
				immer<K & GenericStateOptions<K>>(set => ({
					...initialState,
					setStore(store) {
						return set(() => store);
					},
					resetStore() {
						return set(() => ({ ...initialState }), true);
					},
				})),
				{
					name,
					storage: createJSONStorage(() => storage),
				}
			)
		);
	}
	return create(
		immer<K & GenericStateOptions<K>>(set => ({
			...initialState,
			setStore(store) {
				return set(() => store);
			},
			resetStore() {
				return set(() => ({ ...initialState }), true);
			},
		}))
	);
}
