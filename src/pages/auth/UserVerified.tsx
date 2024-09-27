import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { VerifyEmail } from '../../apis';

function UserVerified() {
	const params = useParams();
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const token = params.token;
		if (token) {
			const getVerify = async () => {
				const resp = await VerifyEmail(token);
				if (resp.status === 200) {
					setLoading(false);
					window.location.href = '/signin';
				}
				if (resp.status === 400) {
					return navigate('/reverify-email', {
						state: {
							header: resp.data.error,
							message:
								'Your email verification link is expired, please click on the below button to resend !',
							email: params.email,
						},
					});
				}
			};
			getVerify();
		}
	}, [navigate, params.token, params.email]);

	if (loading) {
		return null;
	} else
		return (
			<>
				<h1 style={{ position: 'absolute', top: '100px' }}>
					Please wait You are being Verified
				</h1>
			</>
		);
}

export default UserVerified;
