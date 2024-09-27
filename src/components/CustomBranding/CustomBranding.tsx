import { PhotoCamera } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
	Box,
	Button,
	Grid,
	IconButton,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import { z } from 'zod';
import CloseIcon from '@mui/icons-material/Close';
import { useClient, useUpdateClient } from '../../Common';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { grey } from '@mui/material/colors';
import { useParams } from 'react-router-dom';
import { useSuperAdminContext } from '../../contexts/SuperAdminContext';
import { updateClientLogo } from '../../apis/super_admin.api';
import { ClientObject } from '../../pages/admin-console/Types';
import { CustomToolTip } from '../../components/CustomToolTip';

export default function CustomBranding() {
	const imageLinkRef = useRef<string | null>(null);
	useEffect(() => {
		return () => {
			if (imageLinkRef.current)
				return URL.revokeObjectURL(imageLinkRef.current);
		};
	}, []);
	const { fetchClients } = useSuperAdminContext();
	const { uuid } = useParams() as { uuid: string };
	const client = useClient();
	const [imageState, setImageState] = useImmer<File | null>(null);
	const [state, setState] = useImmer<CustomBrandingState>(() => {
		const object = customBrandingSchema.parse({});
		if (client) {
			object.appTitle = client.app_title;
			object.appDomain = client.app_domain;
			object.linkText = client.link_txt!;
			object.primaryButtonText = client.primary_btn_txt_color;
			object.brandPrimaryColour = client.brand_primary_color;
			object.brandSecondaryColour = client.brand_secondry_color;
			object.brandTertiaryColour = client.brand_tertiary_color;
			object.secondaryButtonText = client.secondry_btn_txt_color;
			object.secondaryButtonBackground = client.secondry_btn_bg_color;
			object.primaryButtonBackground = client.primary_btn_bg_color;
			object.white_label_enabled = client.white_label_enabled;
		}
		return object;
	});
	const updateClientMutation = useUpdateClient();

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		const o = customBrandingSchema.keyof().safeParse(name);
		if (o.success) {
			const { data } = o;
			setState((v: any) => {
				v[data] = value;
			});
		}
	};

	const handleFileUpload = useCallback(
		(event: any) => {
			if (imageLinkRef.current)
				window.URL.revokeObjectURL(imageLinkRef.current);
			const file = event.target.files[0];
			setImageState(file);
			const blobURL = URL.createObjectURL(file);
			imageLinkRef.current = blobURL;
		},
		[setImageState]
	);

	if (!client) {
		toast.error(
			'Unable to locate client data! Please navigate to home page and come back'
		);
		return null;
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (imageState) await updateClientLogo({ uuid, data: imageState });
		const data = {
			app_title: state.appTitle,
			app_domain: state.appDomain,
			primary_btn_bg_color: state.primaryButtonBackground,
			secondry_btn_bg_color: state.secondaryButtonBackground,
			primary_btn_txt_color: state.primaryButtonText,
			secondry_btn_txt_color: state.secondaryButtonText,
			brand_primary_color: state.brandPrimaryColour,
			brand_secondry_color: state.brandSecondaryColour,
			brand_tertiary_color: state.brandTertiaryColour,
			link_txt: state.linkText,
			white_label_enabled: state.white_label_enabled,
		} satisfies Partial<ClientObject>;
		updateClientMutation.mutate(
			{ uuid, data },
			{
				onError: e => {
					return toast.error((e as any)?.message ?? 'Unable to update client');
				},
				onSuccess: async () => {
					toast.success('Successfully updated client!');
					await fetchClients();
				},
			}
		);
	};

	return (
		<Paper
			variant='outlined'
			square
			className='p-4'
			component='form'
			onSubmit={handleSubmit}
		>
			<Box>
				<Grid
					container
					spacing={2}
				>
					<Grid xs={9}></Grid>
					<Grid xs={3}>
						<table className='noborder'>
							<tbody>
								<tr>
									<td className='client-info1'>
										<b>Custom Branding</b>
										<CustomToolTip content='Determines if the client account custom branding is active or not' />
									</td>
									<td>
										<span className='material-switch'>
											<input
												autoComplete='new-password'
												id='someSwitchOptionDefault3'
												name='someSwitchOption004'
												checked={state.white_label_enabled}
												onChange={() =>
													setState(v => {
														v['white_label_enabled'] =
															!state.white_label_enabled;
													})
												}
												type='checkbox'
											/>
											<label
												htmlFor='someSwitchOptionDefault3'
												className='label-info'
											/>
										</span>
									</td>
								</tr>
							</tbody>
						</table>
					</Grid>
				</Grid>
				<Typography
					variant='h3'
					className='uppercase underline'
				>
					app details
				</Typography>
				<Grid
					container
					columnSpacing={5}
					className='mt-3'
				>
					<Grid
						item
						xs={4}
					>
						<TextField
							name='appTitle'
							label='App Title'
							variant='standard'
							fullWidth
							size='small'
							value={state.appTitle}
							onChange={handleChange}
						/>
					</Grid>
					<Grid
						item
						xs={4}
					>
						<TextField
							name='appDomain'
							label='App Domain'
							variant='standard'
							fullWidth
							size='small'
							value={state.appDomain}
							onChange={handleChange}
						/>
					</Grid>
					<Grid
						item
						xs={4}
						className='relative'
					>
						<Stack
							direction='row'
							gap={4}
						>
							{(imageState || client.app_logo) && (
								<TextField
									label='App Icon'
									variant='standard'
									size='small'
									className='w-7/12 cursor-pointer'
									value={
										imageState?.name ?? client.app_logo?.split('/').at(-1) ?? ''
									}
									InputProps={{ readOnly: true, className: 'cursor-pointer' }}
									inputProps={{ className: 'cursor-pointer' }}
									onClick={() => {
										window.open(
											imageLinkRef.current
												? imageLinkRef.current
												: client.app_logo!,
											'_blank'
										);
									}}
								/>
							)}
							<label htmlFor='raised-button-file'>
								<Button
									color='primary'
									aria-label='upload picture'
									component='label'
									variant='contained'
									endIcon={<PhotoCamera />}
								>
									Upload Image
									<input
										hidden
										accept='image/*'
										type='file'
										onChange={handleFileUpload}
									/>
								</Button>
							</label>
						</Stack>
					</Grid>
				</Grid>
			</Box>
			<br />
			<Box>
				<Typography
					variant='h3'
					className='mb-3 uppercase underline'
				>
					app colours
				</Typography>
				<Grid
					container
					rowSpacing={3}
					columnSpacing={20}
				>
					<Grid
						item
						xs={6}
					>
						<Stack
							justifyContent='space-between'
							direction='row'
							spacing={3}
							className='mt-3'
						>
							<Typography
								variant='body2'
								className='capitalize'
							>
								Primary Button Background
							</Typography>
							<Box>
								<input
									name='primaryButtonBackground'
									type='color'
									value={state.primaryButtonBackground || blackColor}
									onChange={handleChange}
								/>
								<IconButton
									onClick={() =>
										setState(v => {
											v.primaryButtonBackground = noColor;
										})
									}
									className={clsx(
										'outline-0',
										state.primaryButtonBackground === '' && 'opacity-0'
									)}
									disabled={state.primaryButtonBackground === ''}
									aria-label='reset color'
									color='primary'
								>
									<CloseIcon />
								</IconButton>
							</Box>
						</Stack>
					</Grid>
					<Grid
						item
						xs={6}
					>
						<Stack
							justifyContent='space-between'
							direction='row'
							spacing={3}
							className='mt-3'
						>
							<Typography
								variant='body2'
								className='capitalize'
							>
								Primary Button Text
							</Typography>
							<Box>
								<input
									name='primaryButtonText'
									type='color'
									value={state.primaryButtonText || blackColor}
									onChange={handleChange}
								/>
								<IconButton
									className={clsx(
										'outline-0',
										state.primaryButtonText === '' && 'opacity-0'
									)}
									disabled={state.primaryButtonText === ''}
									onClick={() =>
										setState(v => {
											v.primaryButtonText = noColor;
										})
									}
									color='primary'
									aria-label='reset color'
								>
									<CloseIcon />
								</IconButton>
							</Box>
						</Stack>
					</Grid>
					<Grid
						item
						xs={6}
					>
						<Stack
							justifyContent='space-between'
							direction='row'
							spacing={3}
							className='mt-3'
						>
							<Typography
								variant='body2'
								className='capitalize'
							>
								Secondary Button Background
							</Typography>
							<Box>
								<input
									name='secondaryButtonBackground'
									type='color'
									value={state.secondaryButtonBackground || blackColor}
									onChange={handleChange}
								/>
								<IconButton
									className={clsx(
										'outline-0',
										state.secondaryButtonBackground === '' && 'opacity-0'
									)}
									disabled={state.secondaryButtonBackground === ''}
									onClick={() =>
										setState(v => {
											v.secondaryButtonBackground = noColor;
										})
									}
									color='primary'
									aria-label='reset color'
								>
									<CloseIcon />
								</IconButton>
							</Box>
						</Stack>
					</Grid>
					<Grid
						item
						xs={6}
					>
						<Stack
							direction='row'
							spacing={3}
							justifyContent='space-between'
							className='mt-3'
						>
							<Typography
								variant='body2'
								className='capitalize'
							>
								Secondary Button Text
							</Typography>
							<Box>
								<input
									name='secondaryButtonText'
									type='color'
									value={state.secondaryButtonText || blackColor}
									onChange={handleChange}
								/>
								<IconButton
									className={clsx(
										'outline-0',
										state.secondaryButtonText === '' && 'opacity-0'
									)}
									disabled={state.secondaryButtonText === ''}
									onClick={() =>
										setState(v => {
											v.secondaryButtonText = noColor;
										})
									}
									color='primary'
									aria-label='reset color'
								>
									<CloseIcon />
								</IconButton>
							</Box>
						</Stack>
					</Grid>
					<Grid
						item
						xs={6}
					>
						<Stack
							direction='row'
							spacing={3}
							className='mt-3'
							justifyContent='space-between'
						>
							<Typography
								variant='body2'
								className='capitalize'
							>
								Brand Primary Colour
							</Typography>
							<Box>
								<input
									name='brandPrimaryColour'
									type='color'
									value={state.brandPrimaryColour || blackColor}
									onChange={handleChange}
								/>
								<IconButton
									className={clsx(
										'outline-0',
										state.brandPrimaryColour === '' && 'opacity-0'
									)}
									disabled={state.brandPrimaryColour === ''}
									onClick={() =>
										setState(v => {
											v.brandPrimaryColour = noColor;
										})
									}
									color='primary'
									aria-label='reset color'
								>
									<CloseIcon />
								</IconButton>
							</Box>
						</Stack>
					</Grid>
					<Grid
						item
						xs={6}
					>
						<Stack
							direction='row'
							spacing={3}
							className='mt-3'
							justifyContent='space-between'
						>
							<Typography
								variant='body2'
								className='capitalize'
							>
								Brand Secondary Colour
							</Typography>
							<Box>
								<input
									name='brandSecondaryColour'
									type='color'
									value={state.brandSecondaryColour || blackColor}
									onChange={handleChange}
								/>
								<IconButton
									className={clsx(
										'outline-0',
										state.brandSecondaryColour === '' && 'opacity-0'
									)}
									disabled={state.brandSecondaryColour === ''}
									onClick={() =>
										setState(v => {
											v.brandSecondaryColour = noColor;
										})
									}
									color='primary'
									aria-label='reset color'
								>
									<CloseIcon />
								</IconButton>
							</Box>
						</Stack>
					</Grid>
					<Grid
						item
						xs={6}
					>
						<Stack
							direction='row'
							spacing={3}
							className='mt-3'
							justifyContent='space-between'
						>
							<Typography
								variant='body2'
								className='capitalize'
							>
								Brand Tertiary Colour
							</Typography>
							<Box>
								<input
									name='brandTertiaryColour'
									type='color'
									value={state.brandTertiaryColour || blackColor}
									onChange={handleChange}
								/>
								<IconButton
									className={clsx(
										'outline-0',
										state.brandTertiaryColour === '' && 'opacity-0'
									)}
									disabled={state.brandTertiaryColour === ''}
									onClick={() =>
										setState(v => {
											v.brandTertiaryColour = noColor;
										})
									}
									color='primary'
									aria-label='reset color'
								>
									<CloseIcon />
								</IconButton>
							</Box>
						</Stack>
					</Grid>
					<Grid
						item
						xs={6}
					>
						<Stack
							direction='row'
							spacing={3}
							className='mt-3'
							justifyContent='space-between'
						>
							<Typography
								variant='body2'
								className='capitalize'
							>
								Link Text
							</Typography>
							<Box>
								<input
									name='linkText'
									type='color'
									value={state.linkText || blackColor}
									onChange={handleChange}
								/>
								<IconButton
									className={clsx(
										'outline-0',
										state.linkText === '' && 'opacity-0'
									)}
									disabled={state.linkText === ''}
									onClick={() =>
										setState(v => {
											v.linkText = noColor;
										})
									}
									color='primary'
									aria-label='reset color'
								>
									<CloseIcon />
								</IconButton>
							</Box>
						</Stack>
					</Grid>

					<Grid
						item
						xs={12}
					>
						<Stack
							justifyContent='center'
							alignItems='center'
						>
							<LoadingButton
								variant='contained'
								type='submit'
							>
								Submit
							</LoadingButton>
						</Stack>
					</Grid>
				</Grid>
			</Box>
		</Paper>
	);
}

const noColor = '' as const;
const blackColor = grey['900'];
const customBrandingSchema = z.object({
	appTitle: z.coerce.string().trim().default(''),
	appDomain: z.coerce.string().trim().default(''),
	primaryButtonText: z.coerce.string().or(z.literal(noColor)).default(noColor),
	primaryButtonBackground: z
		.union([z.literal(noColor), z.string()])
		.default(noColor),
	secondaryButtonBackground: z.coerce
		.string()
		.or(z.literal(noColor))
		.default(noColor),
	secondaryButtonText: z.coerce
		.string()
		.or(z.literal(noColor))
		.default(noColor),
	brandPrimaryColour: z.coerce.string().or(z.literal(noColor)).default(noColor),
	brandSecondaryColour: z.coerce
		.string()
		.or(z.literal(noColor))
		.default(noColor),
	brandTertiaryColour: z.coerce
		.string()
		.or(z.literal(noColor))
		.default(noColor),
	linkText: z.coerce.string().or(z.literal(noColor)).default(noColor),
	white_label_enabled: z.coerce.boolean(),
});

export type CustomBrandingState = z.infer<typeof customBrandingSchema>;
