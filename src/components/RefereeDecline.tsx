import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import logo from '../assets/img/credibled_logo_205x45.png';
import { detectBrowser, getDate, useIP, useISP } from '../Common';

import { Link } from 'react-router-dom';
import { sendRefereeDeclineMail, updateLifeCycle } from './../apis';
import { Typography } from '@mui/material';

function RefereeDecline() {
	const params = useParams();
	const { data: ipAdd } = useIP();
	const { data: ispAdd } = useISP();
	const [isReferenceCompleted, setIsReferenceCompleted] =
		useState<boolean>(false);
	useEffect(() => {
		const doDecline = async () => {
			const response = await sendRefereeDeclineMail(params.id);
			if (response.status === 400) return setIsReferenceCompleted(true);
			const body = {
				uuid: params.id,
				name: params.refereeName,
				userType: 'Referee',
				date: getDate(),
				osBrowser: detectBrowser(),
				ipAddress: !!ipAdd ? ipAdd : null,
				locationISP: ispAdd || null,
				refereeUUID: params.id,
			};
			const bodyDeclined = { action: 'Declined', ...body };
			updateLifeCycle(bodyDeclined);
		};
		doDecline();
	}, [ipAdd, ispAdd, params.id, params.refereeName]);
	return (
		<div>
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-6 bg-primary text-left'>&nbsp;</div>
					<div className='col-6 bg-secondary text-right'>&nbsp;</div>
				</div>
			</div>
			<div className='wrapper'>
				<div className='main-panel'>
					<div className='content'>
						<div className='container-fluid'>
							<div className='row'>
								<div className='col-md-8 offset-md-1'>
									<div className=''>
										<Link
											className='navbar-brand'
											to='/signin'
										>
											<img
												src={logo}
												alt='Credibled Logo'
												className='credibled-logo'
											/>
										</Link>
									</div>
									<div className='card-plain mt2'>
										<h3 className='text-primary pt2'>
											Thank you for your time!
										</h3>
										{isReferenceCompleted ? (
											<Typography variant='body1'>
												Your reference has already been processed. No additional
												action required.
											</Typography>
										) : (
											<p>
												Your reference request has been declined and the
												candidate has been asked to provide an alternative
												contact. <br />
											</p>
										)}
									</div>
									<div className='clearfix'></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RefereeDecline;
