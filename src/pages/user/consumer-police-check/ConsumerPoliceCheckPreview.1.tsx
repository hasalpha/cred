import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
	PreviewGetResponse,
	PreviewResponse,
	getPreview,
	getPreview2,
	useAddPreviewDetailsMutation,
} from 'apis/user.api';
import { useGetSessionContextData } from './context/PersonalDetailsContext';
import { useImmer } from 'use-immer';
import { SignatureComponent } from './components/signature';
import { toast } from 'react-toastify';

export default function ConsumerPoliceCheckPreview() {
	const navigate = useNavigate();
	const { uuid, state, preview: previewUUID } = useGetSessionContextData();
	console.log({ previewUUID });
	const [preview, setPreview] = useImmer<PreviewResponse | null>(null);
	const [actualPreview, setActualPreview] = useImmer<PreviewGetResponse | null>(
		null
	);
	const [loading, setLoading] = useImmer<boolean>(true);
	const [signature, setSignature] = useImmer<Blob | null>(null);
	const previewMutation = useAddPreviewDetailsMutation();

	useEffect(() => {
		getPreview(uuid)
			.then(({ data }) => {
				setPreview(data);
			})
			.finally(() => {
				setLoading(false);
			});

		if (previewUUID) {
			getPreview2(previewUUID)
				.then(({ data }) => {
					if (data.signatureBase64) {
						fetch('data:image/png;base64,' + data.signatureBase64)
							.then(v => v.blob())
							.then(setSignature);
					}
					setActualPreview(data);
				})
				.catch((e: any) => toast.error(e?.message));
		}
	}, [
		previewUUID,
		setActualPreview,
		setLoading,
		setPreview,
		setSignature,
		uuid,
	]);

	if (loading) {
		return;
	}
	if (!preview?.address.length) {
		return;
	}
	return (
		<>
			<div
				className='lrpad orlight border'
				style={{ paddingBottom: '3em' }}
			>
				<h2 className='text-primary pt1'>
					Please review the following information for accuracy
				</h2>
				<div className='col-md-12 pt2'>
					<div className='table-striped container table'>
						<div className='row mb-4'>
							<Typography className='col col-md-3 thead font-bold'>
								Full Name:
							</Typography>
							<Typography className='col'>
								{preview?.personal.first_name}&nbsp;
								{preview?.personal.last_name}
							</Typography>
						</div>
						<div className='row mb-4'>
							<Typography className='col col-md-3 thead font-bold'>
								Maiden Name(s) or Alias (Other Names)
							</Typography>
							<Typography className='col'>
								{preview?.personal.other_name}
							</Typography>
						</div>
						<div className='row mb-4'>
							<Typography className='col col-md-3 thead font-bold'>
								Date of Birth:
							</Typography>
							<Typography className='col'>{preview?.personal.dob}</Typography>
						</div>
						<div className='row mb-4'>
							<Typography className='col col-md-3 thead font-bold'>
								Email:
							</Typography>
							<Typography className='col'>{preview?.personal.email}</Typography>
						</div>
						<div className='row mb-4'>
							<Typography className='col col-md-3 thead font-bold'>
								Telephone:
							</Typography>
							<Typography className='col'>{preview?.personal.phone}</Typography>
						</div>
						<div className='row mb-4'>
							<Typography className='col col-md-3 thead font-bold'>
								Place of Birth:
							</Typography>
							<Typography className='col'>
								{preview?.personal.city}, {preview?.personal.country}
							</Typography>
						</div>
						<div className='row mb-4'>
							<Typography className='col col-md-3 thead font-bold'>
								Gender:
							</Typography>
							<Typography className='col'>{preview?.personal.sex}</Typography>
						</div>
						<div className='row mb-4'>
							<Typography className='col col-md-3 thead font-bold'>
								Addresses:
							</Typography>
							<Typography className='col'>
								{preview?.address[0].apt_or_unit},{' '}
								{preview?.address[0].street_number}{' '}
								{preview?.address[0].street_name}, {preview?.address[0].city},{' '}
								{preview?.address[0].postal_name}, {preview?.address[0].country}
							</Typography>
						</div>
						<div className='row mb-4'>
							<Typography className='col col-md-3 thead font-bold'>
								Criminal Offences:
							</Typography>
							{preview?.cjmrc.map(v => (
								<Typography
									className='col'
									key={v.uuid}
								>
									{v.offence}
								</Typography>
							))}
						</div>
					</div>
				</div>
			</div>
			<div className='box-pad'>
				<b className='text-credibledOrange'>Do not declare the following:</b>{' '}
				Please review these details carefully. When you click the Next button,
				online identity verification will begin and you will not be able to
				return to change your answers.
			</div>
			<div className='box-pad'>
				<h4>Criminal Record and Judicial Matters Check (CRJMC)</h4>
				<p>
					<b>
						Please read the following terms and conditions. You may proceed
						after accepting all terms and conditions.
					</b>
				</p>
			</div>
			<p
				style={{
					fontSize: '16px',
					lineHeight: '1.4em',
					padding: '2em',
					border: '1px dashed #333333',
				}}
			>
				I HEREBY CONSENT TO THE SEARCH OF the RCMP National Repository of
				Criminal Records based on the name(s), date of birth and where used, the
				declared criminal record history provided by myself. I understand that
				this verification of the National Repository of Criminal Records is not
				being confirmed by fingerprint comparison which is the only true means
				by which to confirm if a criminal record exists in the National
				Repository of Criminal Records. I hereby release and forever discharge
				all members and employees of the processing Police Service and the Royal
				Canadian Mounted Police from any and all actions, claims and demands for
				damages, loss or injury howsoever arising which may hereafter be
				sustained by myself as a result of the disclosure of information by the
				Cobourg/Brockville Police Service to Triton Canada Inc and/or its
				agents. I certify that the information set out by me in this application
				is true and correct to the best of my ability. I consent to the release
				of the results of the criminal record checks to Triton Canada Inc and/or
				its agents.
			</p>
			<div className='box-pad'>
				<label className='form-check-label pl2 text-credibledOrange'>
					{' '}
					&nbsp;&nbsp;{' '}
					<input
						required
						className=''
						type='checkbox'
						defaultChecked={actualPreview?.is_term_accpeted ?? false}
					/>{' '}
					&nbsp;I have read and accept these terms and conditions{' '}
				</label>
			</div>
			<h4>
				We require a signature to confirm that you accept all terms and
				conditions.
			</h4>
			<SignatureComponent setSignature={setSignature} />
			<small>
				Place your cursor in the box shown above, click and drag to create your
				signature. If you are using a smart phone or tablet, simply use your
				finger to draw your signature. When done, you will be able to proceed.
			</small>
			<Stack
				direction='row'
				gap={1}
			>
				<Button
					onClick={() => {
						return navigate('../identity-verification');
					}}
					className='btn btn-secondary-outline'
				>
					Previous
				</Button>
				<Button
					className='btn btn-primary'
					onClick={async () => {
						if (state === 'COMPLETED') {
							return navigate('../payment');
						}
						if (signature == null) {
							return toast.error('Please add signature!');
						}
						await previewMutation.mutateAsync({
							uuid,
							data: {
								state: 'PREVIEW',
								preview: 'Confirmed',
								is_term_accpeted: true,
								signature: new File([signature], 'signature.png', {
									type: 'png',
								}),
							},
						});
						return navigate('../payment');
					}}
				>
					Save &amp; Continue
				</Button>
			</Stack>
		</>
	);
}
