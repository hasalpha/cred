import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import { getJobHistorybyId, sendRefereeDeclineMail } from '../apis';
import logo from '../assets/img/credibled_logo_205x45.png';
import { detectBrowser, getDate, useIP, useISP } from '../Common';
import { updateCandidateJobHistory, updateLifeCycle } from './../apis';
import { Button } from '@mui/material';

export const ipApi =
	'https://dr5uhki0g9.execute-api.us-east-1.amazonaws.com/dev/whois/';

function Referee() {
	const { current: cityName } = useRef(localStorage.getItem('cityName'));
	const params = useParams();
	const [archivedFlag] = useState('');
	const [someErrorMessage, setSomeErrorMessage] = useState('');
	const navigate = useNavigate();
	const { data: ipAddress } = useIP();
	const { data: isp } = useISP();

	useEffect(() => {
		(async () => {
			if (params.refereeName && params.id) {
				const resp = await getJobHistorybyId(params.id);
				if (
					resp.data.refereeResponse === 'Accepted' &&
					resp.data.emailFlag === true
				) {
					navigate(
						`/referee-summary/${params.candidateName}/${params.refereeName}/${params.id}`
					);
				} else if (
					resp.data.refereeResponse === 'Declined' ||
					resp.data.refereeResponse === 'declined'
				) {
					navigate(
						'/jobHistory/decline/' +
							params.candidateName +
							'/' +
							params.refereeName +
							'/' +
							params.id
					);
				}
			}
		})();
	}, [navigate, params.candidateName, params.id, params.refereeName]);

	const startClicked = async () => {
		if (navigator.onLine === false) {
			setSomeErrorMessage('Device is offline, please connect to Internet');
			const x = document.querySelector('#errorCode') as HTMLElement;
			x!.style.display = 'block';
			return false;
		}
		//   await updateCandidateJobHistory(params.id,body);

		const body = {
			uuid: params.id,
			name: params.refereeName,
			userType: 'Referee',
			date: getDate(),
			osBrowser: detectBrowser(),
			// ipAddress: "43.252.33.117",
			ipAddress: !!ipAddress ? ipAddress : null,
			locationISP: cityName ? `${isp}/${cityName}` : isp,
			refereeUUID: params.id,
		};

		const bodyAccessed = { action: 'Accessed', ...body };
		const bodyAgreed = { action: 'Agreed', ...body };
		const refereeBody = { refereeResponse: 'Agreed' };
		await updateCandidateJobHistory(params.id, refereeBody);
		await updateLifeCycle(bodyAccessed);
		await updateLifeCycle(bodyAgreed);

		if (params.refereeName && params.id) {
			navigate(
				'/referee-accept/' +
					params.candidateName +
					'/' +
					params.refereeName +
					'/' +
					params.id
			);
		}
	};

	const handleDecline = async () => {
		const body = {
			uuid: params.id,
			name: params.refereeName,
			userType: 'Referee',
			date: getDate(),
			osBrowser: detectBrowser(),
			ipAddress: !!ipAddress ? ipAddress : null,
			locationISP: cityName ? `${isp}/${cityName}` : isp,
			refereeUUID: params.uuid,
		};
		const refereeBody = { refereeResponse: 'Declined' };
		const bodyDeclined = { action: 'Declined', ...body };
		const resp = await updateCandidateJobHistory(params.id, refereeBody);
		await updateLifeCycle(bodyDeclined);
		await sendRefereeDeclineMail(params.id);
		if (resp && resp.status === 200) {
			navigate(
				'/jobHistory/decline/' +
					params.candidateName +
					'/' +
					params.refereeName +
					'/' +
					params.id
			);
		} else {
			setSomeErrorMessage(
				'Error processing your request, Please refresh the page and try again'
			);
			const x = document.querySelector('#errorCode') as HTMLElement;
			x.style.display = 'block';
			return false;
		}
	};

	return (
		<>
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-6 bg-primary text-left'>&nbsp;</div>
					<div className='col-6 bg-secondary text-right'>&nbsp;</div>
				</div>
			</div>
			{archivedFlag === 'archived' ? (
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
												The requested link is no longer active.
											</h3>
											<p>
												The requested information has been archived and
												deactivated in our application.
											</p>
										</div>

										<div className='clearfix'></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : null}
			<div
				className='wrapper'
				id='divRefereeInfoStart'
				// style={{ display: "none" }}
			>
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
												style={{ height: '43px' }}
											/>
										</Link>
									</div>

									<div className='card-plain mt2'>
										<h3 className='jh-title pt2'>
											<span className='text-primary'>Hi</span>
											&nbsp;{params.refereeName},
										</h3>

										<h5 className='jh-subtitle'>
											{params.candidateName} has provided your name as a referee
											and Credibled helps you to complete the referencing
											process quickly and securely online
										</h5>

										<ul className='cretiria'>
											<li className='title'>You will be asked to:</li>
											<li>
												<span className='first-word'>Confirm</span> your details
											</li>
											<li>
												<span className='first-word'>Agree</span> to the{' '}
												<span className='text-primary'>Credibled</span>{' '}
												Collection Statement
											</li>
											<li>
												<span className='first-word'>Verify</span>{' '}
												<span className='text-primary'>
													{params.candidateName}'s
												</span>{' '}
												information
											</li>
											<li>
												<span className='first-word'>Answer</span> a
												questionnaire about{' '}
												<span className='text-primary'>
													{params.candidateName}
												</span>
											</li>
										</ul>

										<div className='box-pad'>
											<Button
												onClick={handleDecline}
												variant='outlined'
												size='large'
											>
												Decline
											</Button>
											&nbsp; &nbsp;
											<Button
												onClick={startClicked}
												color='secondary'
												variant='contained'
												size='large'
											>
												Let's do it
											</Button>
											<div
												className='notes p-1'
												id='errorCode'
												style={{ display: `block` }}
											>
												{someErrorMessage}
											</div>
										</div>
									</div>

									<div className='clearfix'></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Referee;
