import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import logo from '../assets/img/credibled_logo_205x45.png';

function JobHistorySuccess() {
	const params = useParams();
	return (
		<>
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-6 bg-primary text-left'>&nbsp;</div>
					<div className='col-6 bg-secondary text-right'>&nbsp;</div>
				</div>
			</div>

			<div className='wrapper'>
				<div className='container-fluid'>
					<div className='row justify-content-center align-items-center mt-5'>
						<div className='col-sm-6 col-md-6 col-lg-6 text-justify'>
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
								<h3 className='text-primary'>
									Amazing! Thanks so much for submitting the referee information{' '}
									<span className='text-secondary'>{params.name},</span>
								</h3>
								<p className='mt2 font-weight-bold'>
									You're one step closer to having your reference checks
									completed. To speed up the process, please let your referees
									know that they should have the reference notification in their
									inbox and to check their spam folder if their email settings
									happen to redirect there.
								</p>
								<p className='mt2 font-weight-bold'>
									You'll be notified when they complete the reference check.
								</p>
								<p className='pt2 font-weight-bold'>Thanks again!</p>
								<p>
									<a
										href='https://www.credibled.com/'
										className='btn btn-primary btn-lg mt2'
									>
										Try Credibled
									</a>
								</p>
							</div>
							<div className='clearfix'></div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default JobHistorySuccess;
