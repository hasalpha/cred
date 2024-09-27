import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { API } from '../Api';
import logo from '../assets/img/credibled_logo_205x45.png';
import LeadGenJob from './LeadGenJob';

function RefereeSummary() {
	const params = useParams();
	const [conditionalLoading, setConditionalLoading] = useState(true);
	useEffect(() => {
		if (params.candidateHash && params.refereeHash) {
			API.getRefereeResponseCount({ candidateHash: params.candidateHash })
				.then(data => {
					if (data.count > 1) {
						API.updateRequestResponse({
							candidateHash: params.candidateHash,
							response: 'criteriamet',
						});
					}
				})
				.catch(error => console.log(error));
		}
	}, []);

	const HandleLeadHire = () => {
		setConditionalLoading(false);
	};
	const HandleLeadJob = () => {
		setConditionalLoading(true);
	};

	const handleFeedback = feedback => {
		API.updateFeedback({
			candidateHash: params.candidateHash,
			refereeHash: params.refereeHash,
			feedback,
		}).then(resp => {
			if (resp.message === 'success') {
				var x = document.getElementById('msg');
				x.style.display = 'block';
				setTimeout(() => {
					window.location.href = 'https://www.credibled.com/';
				}, 3000);
			}
		});
	};

	return (
		<>
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
								<div className='col-md-8'>
									<div>
										<Link
											className='navbar-brand'
											to='/'
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
											Great! You're all done,{' '}
											<span className='text-secondary'>{params.name}</span>
										</h3>

										<h4>
											Your confidential reference has been successfully
											submitted.
										</h4>

										<p style={{ fontSize: '.9rem' }}>
											Your comments are invaluable in helping with their career
											search.{' '}
										</p>

										<p style={{ fontSize: '.9rem' }}>
											If you wish to connect with one of our representatives at{' '}
											<span className='text-secondary'>
												<b>Credibled</b>
											</span>{' '}
											for hiring purposes in your current organization or for
											help with finding a new and exciting role for yourself,
											please select one of the options below.
										</p>

										<div className='box-pad'>
											<a
												href='#!'
												id='lh'
												className='btn btn-primary'
												onClick={HandleLeadHire}
											>
												I'm looking to hire
											</a>
											&nbsp;
											<a
												href='#!'
												id='lj'
												className='btn btn-primary'
												onClick={HandleLeadJob}
											>
												I'm looking for a job
											</a>
											<div
												id='msg'
												className='mt1 pl1 notes'
												style={{ display: 'none', marginTop: '1em' }}
											>
												Notification has been sent!
											</div>
										</div>
									</div>
									<div className='clearfix'>
										<LeadGenJob conditionalLoading={conditionalLoading} />
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

export default RefereeSummary;
