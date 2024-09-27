import { useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import './styles.css';
import { Button } from '@mui/material';

export const SignatureComponent = ({
	signature,
	setSignature,
}: {
	signature?: string;
	setSignature: (blob: Blob | null) => void;
}) => {
	const sigRef = useRef<any>();

	useEffect(() => {
		if (signature) {
			sigRef.current.fromDataURL(signature);
		}
	}, [signature]);

	const handleSignatureEnd = () => {
		const url = sigRef.current.toDataURL();
		fetch(url)
			.then(res => res.blob())
			.then(setSignature);
	};

	const clearSignature = () => {
		sigRef.current.clear();
		setSignature(null);
	};

	return (
		<div className='my-2 text-center'>
			<SignatureCanvas
				penColor='black'
				canvasProps={{ className: 'signature' }}
				ref={sigRef}
				onEnd={handleSignatureEnd}
				clearOnResize={false}
			/>
			<Button
				onClick={clearSignature}
				variant='contained'
				className='relative top-[-50px]'
			>
				Clear
			</Button>
		</div>
	);
};
