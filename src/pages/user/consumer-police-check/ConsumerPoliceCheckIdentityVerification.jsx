import Button from '@mui/material/Button/Button';
import Stack from '@mui/material/Stack/Stack';
import {
	createVeriffSession,
	updateBgObject,
	useAddIdentityDetailsMutation,
	useGetSessionQuery,
} from 'apis/user.api';
import { useNavigate } from 'react-router-dom';
import { useGetSessionContextData } from './context/PersonalDetailsContext';
import { Fragment } from 'react';
import { useImmer } from 'use-immer';
import { toast } from 'react-toastify';
import { MESSAGES, createVeriffFrame } from '@veriff/incontext-sdk';
import { Link, Typography } from '@mui/material';

export default function ConsumerPoliceCheckIdentityVerification() {
	const navigate = useNavigate();
	const { uuid, state } = useGetSessionContextData();
	const { refetch: refetchSession } = useGetSessionQuery();
	const [veriffId, setVeriffId] = useImmer('');
	const [done, setDone] = useImmer(false);
	const identityMutation = useAddIdentityDetailsMutation();
	return (
		<>
			<div id='veriff-root'></div>
			<Fragment>
				<div
					className='lrpad border text-center'
					style={{ paddingBottom: '3em' }}
				>
					<h2 className='text-primary pt1'>
						We need to validate your identity to continue your background check
					</h2>
					<p>This can be completed with a smartphone or your current device</p>
					<img
						src='/tech.jpg'
						width='300px'
						alt='Identity verification'
					/>
					<p>
						<a
							href='#start-verif'
							className='btn btn-secondary'
							onClick={async () => {
								const { data } = await createVeriffSession({
									uuid,
									config:
										state.toLowerCase() === 'crjmc' ? { force: true } : {},
								});
								setVeriffId(data.veriff_id ?? data.uuid);
								setTimeout(() => {
									createVeriffFrame({
										url: data.url,
										onEvent(msg) {
											switch (msg) {
												case MESSAGES.STARTED: {
													break;
												}
												case MESSAGES.CANCELED: {
													break;
												}
												case MESSAGES.RELOAD_REQUEST: {
													break;
												}
												case MESSAGES.FINISHED: {
													setDone(true);
													break;
												}
												default: {
												}
											}
										},
									});
								}, 100);
							}}
						>
							START VERIFICATION
						</a>
					</p>
					<Typography>
						If you need further assistance, feel free to reach out to us at
						&nbsp;
						<strong>
							<Link
								href='mailto:support@credibled.com'
								className='decoration-solid decoration-2 hover:text-credibledPurple hover:underline'
							>
								support@credibled.com
							</Link>
						</strong>
						&nbsp; or give us a call at{' '}
						<strong>
							<Link
								href='tel:416 855 2265'
								className='decoration-solid decoration-2 hover:text-credibledPurple hover:underline'
							>
								416 855 2265
							</Link>
						</strong>
						. We're here to help!
					</Typography>
				</div>
			</Fragment>
			<Stack
				direction='row'
				gap={2}
				justifyContent='center'
			>
				<Button
					variant='outlined'
					size='large'
					onClick={() => {
						return navigate('../address');
					}}
				>
					Previous
				</Button>
				<Button
					variant='contained'
					color='secondary'
					size='large'
					onClick={async () => {
						if (!veriffId) {
							return toast.error('Please complete id check!');
						}

						if (!done) {
							return toast.error('Id verification not done!');
						}

						await identityMutation
							.mutateAsync({
								uuid,
								data: { state: 'IDENTITY', veriff_id: veriffId },
							})
							.catch(async () => {
								await updateBgObject(uuid, {
									default: true,
									veriff_id: veriffId,
								});
							});

						await refetchSession();
						return navigate('../preview');
					}}
				>
					Continue
				</Button>
			</Stack>
		</>
	);
}
