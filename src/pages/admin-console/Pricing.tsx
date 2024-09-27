import Box from '@mui/material/Box/Box';
import Button from '@mui/material/Button/Button';
import InputAdornment from '@mui/material/InputAdornment/InputAdornment';
import Stack from '@mui/material/Stack/Stack';
import TextField from '@mui/material/TextField/TextField';
import Typography from '@mui/material/Typography/Typography';
import {
	PostPrices,
	useGetClientPrices,
	useGetStripeReferences,
	usePostPrices,
	usePutPrices,
} from 'apis/user-api-hooks';
import { useAllCheckTypes } from 'hooks/useGetCheckTypes';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Pricing() {
	const { data: allCheckTypes } = useAllCheckTypes();
	const { data: referenceTypes } = useGetStripeReferences();
	const {
		data: priceMap,
		status,
		refetch: refetchPrices,
	} = useGetClientPrices();
	const postMutation = usePostPrices();
	const putMutation = usePutPrices();
	const { uuid } = useParams()!;
	if (!uuid) {
		return;
	}
	if (status === 'pending' || status === 'error') {
		return;
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!uuid) {
			return toast.error('No client uuid found');
		}
		const obj = Object.fromEntries(new FormData(e.currentTarget));
		const referenceUUID = referenceTypes?.results.at(0)?.uuid!;
		const referencePrice = obj[referenceUUID];
		const background = Object.entries(obj).flatMap(([scan_id, price]) =>
			scan_id === referenceUUID ? [] : { scan_id, price: +price }
		);

		const data = {
			client_id: uuid,
			reference: { reference_id: referenceUUID, price: +referencePrice },
			background,
		} satisfies PostPrices;

		if (priceMap?.size) {
			return putMutation.mutate(data, {
				onSettled(_res, error) {
					if (error) {
						console.error(error);
						return toast.error('something went wrong!');
					}
					refetchPrices();
					return toast.success('Prices updated successfully!');
				},
			});
		}
		return postMutation.mutate(data, {
			onSettled(_res, error) {
				if (error) {
					console.error(error);
					return toast.error('something went wrong!');
				}
				refetchPrices();
				return toast.success('Prices added successfully!');
			},
		});
	}

	return (
		<Box
			component='form'
			onSubmit={handleSubmit}
		>
			<Stack
				rowGap={2}
				direction='row'
				flexWrap='wrap'
				justifyContent='space-between'
				className='mx-auto w-[90%]'
			>
				{referenceTypes?.results.map(v => (
					<Box
						className='basis-2/5'
						key={v.name}
					>
						<Typography>{v.name}:</Typography>
						<TextField
							name={v.uuid}
							variant='outlined'
							type='number'
							fullWidth
							size='small'
							defaultValue={priceMap.get(v.uuid) ?? v.default_price}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>$</InputAdornment>
								),
							}}
							inputProps={{ step: 'any' }}
						/>
					</Box>
				))}
				{allCheckTypes?.map(v => {
					return (
						<Box
							key={v.uuid}
							className='basis-2/5'
						>
							<Typography>{v.name}:</Typography>
							<TextField
								name={v.uuid}
								variant='outlined'
								type='number'
								fullWidth
								size='small'
								defaultValue={priceMap.get(v.uuid) ?? +v.default_price}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>$</InputAdornment>
									),
								}}
								inputProps={{ step: 'any' }}
							/>
						</Box>
					);
				})}
			</Stack>
			<br />
			<br />
			<Stack
				justifyContent={'center'}
				alignItems={'center'}
			>
				<Button
					variant='contained'
					type='submit'
				>
					Submit
				</Button>
			</Stack>
		</Box>
	);
}
