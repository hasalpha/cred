/* eslint-disable eqeqeq */
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { getMinReference, updateLifeCycle } from '../apis';
import logo from '../assets/img/credibled_logo_205x45.png';
import { detectBrowser, getDate, useIP, useISP, useJobData } from '../Common';

function CandidateJobHistory() {
	const { current: cityName } = useRef(localStorage.getItem('cityName'));
	const params = useParams();
	const [archivedFlag] = useState('');
	const navigate = useNavigate();
	const { data: ipAddress } = useIP();
	const { data: isp } = useISP();
	const { data: item = {} } = useJobData();

	const [minReference, setMinReference] = useState(2);

	useEffect(() => {
		const currentURL = window.location.href;
		const segments = currentURL.split('/');
		const uuid = segments[segments.length - 1];
		const res = getMinReference(uuid);
		res.then(response => {
			setMinReference(response.data.min_reference);
		});
	}, []);

	if (item?.emailFlag == false)
		navigate(`/job-history/${params.name}/${params.id}`);

	if (item?.emailFlag == true)
		navigate(`/job-summary/${params.name}/${params.id}`);

	const startClicked = async () => {
		const body = {
			uuid: params.id,
			name: params.name,
			userType: 'candidate',
			date: getDate(),
			osBrowser: detectBrowser(),
			ipAddress: !!ipAddress ? ipAddress : null,
			locationISP: cityName ? `${isp}/${cityName}` : isp,
		};

		const bodyAccessed = { action: 'Accessed', ...body };
		const bodyAgreed = { action: 'Agreed', ...body };

		await updateLifeCycle(bodyAccessed);
		await updateLifeCycle(bodyAgreed);
		navigate('/job-info/' + params.name + '/' + params.id);
	};
	console.log(minReference);
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
				id='divStartJobHistory'
			>
				<div className='main-panel w-100'>
					<div className='content'>
						<div className='container-fluid'>
							<div className='row justify-content-center align-items-center mt-4'>
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
										<h3 className='jh-title pt2'>
											{' '}
											Tell Us Your Job History, {params.name}
										</h3>

										<h5 className='jh-subtitle'>
											Please, complete your work history with the following
											requirements:
										</h5>

										<ul className='cretiria'>
											{minReference === 1 ? (
												<li>Minimum {minReference} reference</li>
											) : (
												<li>Minimum {minReference} references</li>
											)}
											<li>All fields are mandatory.</li>
										</ul>

										<button
											className='btn btn-primary mt2'
											onClick={startClicked}
										>
											Start
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default CandidateJobHistory;
