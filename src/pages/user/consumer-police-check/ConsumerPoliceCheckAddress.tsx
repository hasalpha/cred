import {
	Badge,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
} from '@mui/material';
import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography/Typography';
import { GreyBorderBanner } from 'components/GreyBorderBanner';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useImmer } from 'use-immer';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import {
	NewCjmrcResponse,
	NewSampleAddress,
	addNewCjmrc,
	commitAddressToSession,
	commitCjmrcToSession,
	deleteAddress,
	deleteCjmrc,
	getNewCjmrc,
	updateAddress,
	updateBgObject,
	useAddAddressDetailsMutation,
	useGetAddress,
	useGetCharges,
	useGetSessionQuery,
	useUpdateAddressMutation,
} from 'apis/user.api';
import { AxiosResponse, isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useGetSessionContextData } from './context/PersonalDetailsContext';
import { useEffect } from 'react';
import { PoliceCheckStates } from './types';
import listOfCountries from 'assets/json/state.json';
import { dateTimeFormatter } from 'index';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs/AdapterDayjs';
import { getYYYYMMDD } from './ConsumerPoliceCheckPersonalInformation';
import { DatePicker } from '@mui/x-date-pickers/DatePicker/DatePicker';

enum Steps {
	Crjmc = 'crjmc',
	Address = 'address',
}

export default function ConsumerPoliceCheckAddress() {
	const navigate = useNavigate();
	const [isConvict, setIsConvict] = useImmer<boolean>(false);
	const { uuid, criminal_and_judicial_check } = useGetSessionContextData();
	const { refetch: refetchSession } = useGetSessionQuery();
	const { refetch: refetchAddresses, data: addresses = [] } = useGetAddress();
	console.log({ addresses });
	const { data: charges } = useGetCharges();
	const [newCjmrc, setNewcjmrc] = useImmer<Array<NewCjmrcResponse>>([]);
	const [showAddressInputs, setShowAddressInputs] = useImmer<boolean>(false);
	const [step, setStep] = useImmer<Steps>(Steps.Address);
	const [isEditAddress, setIsEditAddress] = useImmer<NewSampleAddress | null>(
		null
	);
	const [country, setCountry] = useImmer<string>('');
	const addAddressMutation = useAddAddressDetailsMutation();
	const updateAddressMutation = useUpdateAddressMutation();

	useEffect(() => {
		(async () => {
			if (criminal_and_judicial_check) {
				const cjmrcList: Array<NewCjmrcResponse> = [];
				for (let uuid of criminal_and_judicial_check) {
					const { data } = await getNewCjmrc(uuid);
					cjmrcList.push(data);
				}
				setNewcjmrc(cjmrcList);
			}
			if (criminal_and_judicial_check?.length) {
				setIsConvict(true);
			}
		})();
	}, [criminal_and_judicial_check, setIsConvict, setNewcjmrc]);

	const todaysDate = new Date();
	const fiveYearsAgo = new Date(
		todaysDate.setFullYear(todaysDate.getFullYear() - 5)
	);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formInput = Object.fromEntries(new FormData(e.currentTarget));
		const newAddress = addressSchema.parse(formInput);
		newAddress.date_moved_in = getYYYYMMDD(new Date(newAddress.date_moved_in));
		let isCurrentChanged = false;

		const mutationData = {
			...newAddress,
			is_office: false,
			address_type:
				addresses.length <= 0 ||
				addresses.some(curAddress => {
					if (
						new Date(curAddress.date_moved_in) <=
						new Date(newAddress.date_moved_in)
					) {
						isCurrentChanged = true;
						return true;
					}
					return false;
				})
					? 'CURRENT'
					: 'OLD',
		} as const;

		try {
			if (isEditAddress?.uuid) {
				const { data } = (await updateAddressMutation.mutateAsync({
					...mutationData,
					uuid: isEditAddress.uuid,
				})) as AxiosResponse<NewSampleAddress>;

				if (isCurrentChanged) {
					let previousCurrentAddresses = addresses?.filter(
						v => v.address_type === 'CURRENT'
					);

					if (isEditAddress?.uuid) {
						previousCurrentAddresses = previousCurrentAddresses.filter(
							v => v.uuid !== isEditAddress.uuid
						);
					}
					if (previousCurrentAddresses.length) {
						const results = await Promise.all(
							previousCurrentAddresses.map(address => {
								const updatedAddress = { ...address };
								updatedAddress.address_type = 'OLD';
								return updateAddress(updatedAddress);
							})
						);
						await updateBgObject(uuid, {
							default: true,
							address: [
								...new Set([
									...addresses.map(v => v.uuid),
									...results.map(v => v.data.uuid),
								]),
							],
						});
					}
				}

				await updateBgObject(uuid, {
					default: true,
					address: [...new Set([...addresses.map(v => v.uuid), data.uuid])],
				});
			} else {
				const { data } = await addAddressMutation.mutateAsync(mutationData);

				if (isCurrentChanged) {
					let previousCurrentAddresses = addresses?.filter(
						v => v.address_type === 'CURRENT'
					);

					if (isEditAddress?.uuid) {
						previousCurrentAddresses = previousCurrentAddresses.filter(
							v => v.uuid !== isEditAddress.uuid
						);
					}

					if (previousCurrentAddresses.length) {
						const results = await Promise.all(
							previousCurrentAddresses.map(address => {
								const updatedAddress = { ...address };
								updatedAddress.address_type = 'OLD';
								return updateAddress(updatedAddress);
							})
						);
						await updateBgObject(uuid, {
							default: true,
							address: [
								...new Set([
									...addresses.map(v => v.uuid),
									...results.map(v => v.data.uuid),
								]),
							],
						});
					}
				}

				await updateBgObject(uuid, {
					default: true,
					address: [...new Set([...addresses.map(v => v.uuid), data.uuid])],
				});
			}

			refetchSession();
			refetchAddresses();
			setIsEditAddress(null);
			setShowAddressInputs(false);
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(error.message);
			}
		}
	}

	async function handleCrjmcSubmit(e: React.FormEvent<HTMLFormElement>) {
		try {
			//For some reason can't call reset on e after await
			const { currentTarget: formElement } = e;
			e.preventDefault();
			const formInput = Object.fromEntries(new FormData(e.currentTarget));
			const data = cJMRCSchema.parse(formInput);
			const responseData = await addNewCjmrc(data);
			setNewcjmrc(draft => {
				draft.push(responseData);
			});
			formElement.reset();
		} catch (e: any) {
			toast.error(
				e?.data?.Error ??
					e?.message ??
					'Something went wrong while submitting the form!'
			);
		}
	}

	function handleCancel() {}

	async function handleAddressDelete(
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	): Promise<void> {
		const { dataset } = event.currentTarget;
		const { uuid } = dataset;
		if (!uuid) {
			return;
		}
		await deleteAddress({ uuid });
		const newAddresses = addresses.filter(v => v.uuid !== uuid);
		const [address] = newAddresses.toSorted(sortFn);
		if (address) {
			address.address_type = 'CURRENT';
			await updateAddress(address);
		}
		refetchSession();
		refetchAddresses();
		navigate(0);
	}

	return (
		<Box>
			<GreyBorderBanner>
				{step === 'crjmc' && (
					<>
						<Typography
							variant='h2'
							className='capitalize'
							color='secondary'
						>
							Criminal Record and Judicial Matters Check{' '}
							<Typography
								variant='h2'
								component='span'
								color='primary'
							>
								(CRJMC)
							</Typography>
						</Typography>
						<br />
						<div>
							<h5 className='jh-subtitle pt2'>
								Have you ever been convicted of a criminal offense for which a
								pardon has not been granted?
							</h5>
							<div className='form-check form-check-radio fc_more'>
								<label
									htmlFor='is-convicted'
									className='form-check-label txt_body'
								>
									<input
										className='form-check-input'
										type='radio'
										name='conviction'
										id='is-convicted'
										checked={isConvict}
										onChange={() => setIsConvict(true)}
									/>
									Yes{' '}
									<span className='circle'>
										<span className='check'></span>
									</span>
								</label>
							</div>
							<div className='form-check form-check-radio fc_more'>
								<label
									htmlFor='not-convicted'
									className='form-check-label txt_body'
								>
									<input
										className='form-check-input'
										type='radio'
										name='conviction'
										id='not-convicted'
										checked={!isConvict}
										onChange={() => setIsConvict(false)}
									/>
									No
									<span className='circle'>
										<span className='check'></span>
									</span>
								</label>
							</div>
						</div>
						{isConvict && (
							<form
								key={newCjmrc.length}
								onSubmit={handleCrjmcSubmit}
								className='row'
								id='add-address'
								style={{
									border: '1px dashed rgb(237, 100, 43)',
									margin: '1em',
									padding: '2em',
								}}
							>
								<FormControl
									variant='standard'
									sx={{ m: 2, minWidth: 200, maxWidth: 200 }}
								>
									<InputLabel htmlFor='offence'>offence</InputLabel>
									<Select
										name='offence'
										id='offence'
										defaultValue=''
									>
										{charges?.map(v => (
											<MenuItem
												key={v}
												value={v}
											>
												{v}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<div className='col-md-3'>
									<div className='form-group bmd-form-group is-filled'>
										<label
											htmlFor='year_of_conviction'
											className='bmd-label-floating'
										>
											Year of conviction
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<input
											required
											id='year_of_conviction'
											name='year_of_conviction'
											type='number'
											defaultValue={''}
											className='form-control'
											min={1900}
											max={new Date().toISOString().split('-')[0]}
										/>
									</div>
								</div>
								<div className='col-md-3'>
									<div className='form-group bmd-form-group is-filled'>
										<label
											htmlFor='location'
											className='bmd-label-floating'
										>
											Location{' '}
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<input
											required
											id='location'
											name='location'
											type='text'
											defaultValue={''}
											className='form-control'
										/>
									</div>
								</div>
								<div className='col-md-9'>
									<div className='form-group bmd-form-group is-filled'>
										<label
											htmlFor='sentence'
											className='bmd-label-floating'
										>
											Sentence/Disposition{' '}
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<input
											required
											id='sentence'
											name='sentence'
											type='text'
											defaultValue={''}
											className='form-control'
										/>
									</div>
								</div>
								<div className='modal-footer pt1'>
									<button
										onClick={handleCancel}
										type='button'
										id='cancel'
										className='btn-small btn-secondary-outline'
									>
										Cancel <div className='ripple-container'></div>
									</button>
									<button
										type='submit'
										className='btn-small btn-primary'
									>
										Update <div className='ripple-container'></div>
									</button>
								</div>
								<h6 className='pt1'>
									The system is not able to confirm your criminal record for
									details. To complete a criminal background check, you will
									need to go to your local police station and take 2 pieces of
									identification with you, one being government issued with
									photo.
								</h6>
							</form>
						)}
					</>
				)}
				{step === 'address' && (
					<>
						<Typography
							variant='h2'
							className='capitalize'
						>
							5 year address history
						</Typography>
						<br />
						<Typography>
							You are required to provide a full 5 year residential history
							starting from {dateTimeFormatter.format(fiveYearsAgo)}.
						</Typography>
						<br />
						<Button
							color='primary'
							className='mr-4'
							variant='outlined'
							size='large'
							startIcon={<ControlPointIcon />}
							disabled={showAddressInputs}
							onClick={() => {
								if (showAddressInputs) {
									return;
								}
								setShowAddressInputs(true);
							}}
						>
							Add Address
						</Button>
						{showAddressInputs && (
							<form
								className='row'
								id='add-address'
								style={{
									border: '1px dashed rgb(237, 100, 43)',
									margin: '1em',
									padding: '2em',
									position: 'relative',
								}}
								onSubmit={handleSubmit}
							>
								<div className='col-md-3'>
									<label
										className='label-static'
										htmlFor='country'
									>
										Country{' '}
										<span className='sup_char'>
											<sup>*</sup>
										</span>
									</label>
									<div className='form-group'>
										<select
											id='country'
											autoComplete='new-password'
											name='country'
											required
											className='form-control select-top'
											defaultValue={isEditAddress?.country ?? ''}
											onChange={e => {
												setCountry(e.currentTarget.value);
											}}
										>
											<option value=''>Select Country</option>
											{listOfCountries.map(v => (
												<option
													key={v.country}
													value={v.country}
												>
													{v.country}
												</option>
											))}
										</select>
										<span className='fa fa-fw fa-angle-down field_icon eye'></span>
									</div>
								</div>
								<div className='col-md-3'>
									<div className='form-group bmd-form-group'>
										<label
											htmlFor='street-number'
											className='bmd-label-floating'
										>
											Street Number{' '}
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<input
											id='street-number'
											name='street_number'
											autoComplete='new-password'
											type='number'
											className='form-control'
											defaultValue={isEditAddress?.street_number ?? ''}
										/>
									</div>
								</div>
								<div className='col-md-3'>
									<div className='form-group bmd-form-group'>
										<label
											htmlFor='street-name'
											className='bmd-label-floating'
										>
											Street Name{' '}
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<input
											id='street-name'
											autoComplete='new-password'
											name='street_name'
											type='text'
											className='form-control'
											defaultValue={isEditAddress?.street_name ?? ''}
											required
										/>
									</div>
								</div>
								<div className='col-md-3'>
									<div className='form-group bmd-form-group'>
										<label
											htmlFor='apt_or_unit'
											className='bmd-label-floating'
										>
											Apt/Unit{' '}
										</label>
										<input
											id='apt_or_unit'
											autoComplete='new-password'
											name='apt_or_unit'
											type='text'
											className='form-control'
											defaultValue={isEditAddress?.apt_or_unit ?? ''}
										/>
									</div>
								</div>
								<div className='col-md-6'>
									<div className='form-group bmd-form-group'>
										<label
											htmlFor='city'
											className='bmd-label-floating'
										>
											City{' '}
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<input
											id='city'
											autoComplete='new-password'
											name='city'
											type='text'
											className='form-control'
											defaultValue={isEditAddress?.city}
										/>
									</div>
								</div>
								<div className='col-md-6'>
									<label
										htmlFor='province'
										className='label-static'
									>
										Province{' '}
										<span className='sup_char'>
											<sup>*</sup>
										</span>
									</label>
									<div className='form-group'>
										<select
											id='province'
											autoComplete='new-password'
											className='form-control select-top'
											name='province'
											required
											defaultValue={isEditAddress?.province ?? ''}
										>
											<option value=''>Select Province</option>
											{listOfCountries
												.find(v => v.country === country)
												?.states.map(v => (
													<option
														key={v}
														value={v}
													>
														{v}
													</option>
												))}
										</select>
										<span className='fa fa-fw fa-angle-down field_icon eye'></span>
									</div>
								</div>
								<div className='col-md-6'>
									<div className='form-group mt3 bmd-form-group is-filled'>
										<label
											htmlFor='postal-code'
											className='bmd-label-floating'
										>
											Postal Code{' '}
											<span className='sup_char'>
												<sup>*</sup>
											</span>
										</label>
										<input
											id='postal-code'
											autoComplete='new-password'
											name='postal_name'
											type='text'
											className='form-control'
											defaultValue={isEditAddress?.postal_name ?? ''}
										/>
									</div>
								</div>
								<div className='col-md-6'>
									<LocalizationProvider dateAdapter={AdapterDayjs}>
										<DatePicker
											className='mt-8'
											slotProps={{
												textField: {
													variant: 'standard',
													fullWidth: true,
													name: 'date_moved_in',
												},
											}}
											maxDate={dayjs()}
											label='Date Moved In'
											defaultValue={
												isEditAddress?.date_moved_in
													? dayjs(isEditAddress.date_moved_in)
													: null
											}
										/>
									</LocalizationProvider>
								</div>
								<div className='modal-footer pt1'>
									<button
										type='button'
										id='cancel'
										className='btn-small btn-secondary-outline'
										onClick={() => {
											setShowAddressInputs(false);
											if (isEditAddress) {
												return setIsEditAddress(null);
											}
										}}
									>
										Cancel <div className='ripple-container'></div>
									</button>
									<button
										type='submit'
										className='btn-small btn-primary'
									>
										Update <div className='ripple-container'></div>
									</button>
								</div>
							</form>
						)}
					</>
				)}
			</GreyBorderBanner>
			{step === 'address' && (
				<Stack
					direction='row'
					gap={2}
					flexWrap='wrap'
				>
					{addresses.toSorted(sortFn).map((v, i) => (
						<div
							key={i}
							className='col-md-3 info-box-whitebg border-1 border-dashed border-orange-600 p-2'
						>
							<div className='actions'>
								<a
									className='open-icon'
									data-toggle='modal'
									href='#edit'
									onClick={() => {
										setShowAddressInputs(true);
										setIsEditAddress(v);
										setCountry(v.country);
									}}
								>
									<i className='fa fa-pencil-square-o'></i>
								</a>
								&nbsp;{' '}
								<a
									className='open-icon'
									id='del-list'
									href='#delete'
									data-uuid={v.uuid}
									onClick={handleAddressDelete}
								>
									<i className='fa fa-trash'></i>
								</a>
							</div>
							<h6 className='fw3 text-primary'>
								{v.street_name}
								{v.address_type === 'CURRENT' && (
									<Badge
										className='relative left-3'
										badgeContent='Current'
										color='primary'
									/>
								)}
								<br />
								<span className='text-secondary font-sm'>
									Moved on: {v.date_moved_in}
								</span>
							</h6>
							<span className='font-sm'>
								{v.street_number}, {v.street_name}
								<br />
								{v.city}
								<br />
								{v.postal_name}, {v.country}{' '}
							</span>
						</div>
					))}
				</Stack>
			)}
			{step === 'crjmc' && (
				<>
					<div className='box-pad'>
						<Typography>
							<b className='text-credibledOrange'>
								Do not declare the following:
							</b>{' '}
							Absolute discharges or Conditional Discharges, pursuant to the
							Criminal Code, section 730. Any charges for which you have
							received a Pardon, pursuant to the Criminal Records Act. Any
							offences while you were a “young person” (12 years old but less
							than 18 years old), pursuant to the Youth Criminal Justice Act.
							Any charges for which you were not convicted, for example, charges
							that were withdrawn, dismissed, etc. Any provincial or municipal
							offences. Any charges dealt with outside of Canada.
						</Typography>
					</div>
					{true && (
						<Stack
							direction='row'
							columnGap={2}
						>
							{newCjmrc.map(v => (
								<div
									key={v.uuid}
									className='col-md-3 info-box-whitebg border-1 border-dashed border-orange-600 p-2'
								>
									<div className='actions'>
										<a
											onClick={async () => {
												await deleteCjmrc(v.uuid);
												setNewcjmrc(draft => {
													draft.splice(
														draft.findIndex(val => val.uuid === v.uuid)
													);
												});
											}}
											className='open-icon'
											id='del-list'
											href='#deleteCRJMC'
										>
											<i className='fa fa-trash'></i>
										</a>
									</div>
									<h6 className='fw3 text-primary'>
										Offence Record
										<br />
										<span className='text-secondary font-sm'>
											Year of conviction :{v.year_of_conviction}
										</span>
									</h6>
									<span className='font-sm'>
										{v.offence}&nbsp;&nbsp;{v.location},
										<br />
										{v.sentence}
										<br /> {v.year_of_conviction}
									</span>
								</div>
							))}
						</Stack>
					)}
				</>
			)}
			<br />
			<Stack
				direction='row'
				gap={2}
			>
				<Button
					variant='outlined'
					size='large'
					onClick={() => {
						if (step === Steps.Address)
							return navigate('../personal-information');
						return setStep(Steps.Address);
					}}
				>
					Previous
				</Button>
				<Button
					variant='contained'
					color='secondary'
					size='large'
					onClick={async () => {
						if (step === Steps.Address) {
							if (addresses.length <= 0) {
								return toast.error('Please add at least one address');
							}

							if (!addresses.find(v => v.country.toLowerCase() === 'canada')) {
								return toast.error('Please add at least one canadian address');
							}

							if (!addresses.some(v => v.address_type === 'CURRENT')) {
								return toast.error('Please make at least one address current');
							}

							if (
								!addresses.some(
									v => dayjs().diff(dayjs(v.date_moved_in), 'year') >= 5
								)
							) {
								return toast.error(
									'Almost there! We still need the full 5-year address history.'
								);
							}

							commitAddressToSession({
								uuid,
								state: PoliceCheckStates.ADDRESS,
								address: addresses.map(v => v.uuid),
							})
								.then(() => {
									refetchSession();
									refetchAddresses();
									return setStep(Steps.Crjmc);
								})
								.catch(async () => {
									await updateBgObject(uuid, {
										default: true,
										address: addresses.map(v => v.uuid),
									})
										.then(() => {
											refetchSession();
											refetchAddresses();
											return setStep(Steps.Crjmc);
										})
										.catch(e => {
											toast.error(e?.data);
										});
								});
						} else {
							if (isConvict && newCjmrc.length <= 0) {
								return toast.error('You need to add atleast one entry.');
							}
							await commitCjmrcToSession({
								uuid,
								state: PoliceCheckStates.CRJMC,
								is_cjmrc: isConvict,
								cjmrc: newCjmrc.map(v => v.uuid),
							}).catch(async () => {
								await updateBgObject(uuid, {
									default: true,
									crjmrc: newCjmrc.map(v => v.uuid),
								});
								refetchSession();
							});
							refetchSession();
							return navigate('../identity-verification');
						}
					}}
				>
					Save & Continue
				</Button>
			</Stack>
		</Box>
	);
}

const addressSchema = z.object({
	country: z.string(),
	street_number: z.string(),
	street_name: z.string(),
	apt_or_unit: z.string().default(''),
	city: z.string(),
	province: z.string(),
	postal_name: z.string(),
	date_moved_in: z.string(),
});

const cJMRCSchema = z.object({
	offence: z.string().default(''),
	year_of_conviction: z.string().default(''),
	location: z.string().default(''),
	sentence: z.string().default(''),
});

export type AddressSchema = z.infer<typeof addressSchema>;
export type CJMRCSchema = z.output<typeof cJMRCSchema>;
export const sortFn = (a: NewSampleAddress, b: NewSampleAddress) => {
	return new Date(a.date_moved_in) > new Date(b.date_moved_in) ? -1 : 1;
};
