import { useEffect } from 'react';

export default function ThankYou() {
	useEffect(() => {
		localStorage.removeItem('index-store');
	}, []);
	return (
		<div className='card-plain mt2'>
			<div className='_box'>
				<h2 className='text-primary pt2'>
					Thank You for Trusting{' '}
					<span className='text-secondary'>
						<b>Credibled</b>
					</span>{' '}
					for Your Criminal Background Check!
				</h2>
				<br />

				<p className='highlight'>
					Your check is now completed and the information has been sent to a
					police station for further verification. You will receive the results
					via email shortly.
				</p>

				<p className='highlight'>
					While we've taken measures to ensure that our email doesn't land in
					your junk folder, we recommend checking there within 24 hours if you
					haven't received your results. We strive to provide a transparent and
					timely service, making sure you stay informed every step of the way.
				</p>

				<p className='highlight'>
					Join leading organizations around the world that trust{' '}
					<span className='text-secondary'>
						<b>Credibled</b>
					</span>{' '}
					for accurate and efficient background checks.{' '}
					<span className='text-secondary'>
						<b>Hire better, faster.</b>
					</span>
				</p>
			</div>

			<div className='_footer'>
				<a
					className='btn'
					href='https://www.credibled.com/'
				>
					Try Credibled<div className='ripple-container'></div>
				</a>
			</div>

			<h5 className='text-primary'>
				{' '}
				<p>Connect with us</p>
			</h5>

			<div className=''>
				<a
					className=''
					href='https://www.facebook.com/Credibled'
					target='_blank'
					rel='noreferrer'
				>
					<svg
						role='presentation'
						viewBox='0 0 24 24'
						style={{ height: '1.8rem', width: '1.8rem' }}
					>
						<title>facebook</title>
						<path
							d='M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z'
							style={{ fill: 'currentcolor' }}
						></path>
					</svg>
				</a>

				<a
					className=''
					href='https://www.twitter.com/Credibled1'
					target='_blank'
					rel='noreferrer'
				>
					<svg
						role='presentation'
						viewBox='0 0 24 24'
						style={{ height: '1.8rem', width: '1.8rem' }}
					>
						<title>twitter</title>
						<path
							d='M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z'
							style={{ fill: 'currentcolor' }}
						></path>
					</svg>
				</a>

				<a
					className=''
					href='https://www.linkedin.com/company/credibled'
					target='_blank'
					rel='noreferrer'
				>
					<svg
						role='presentation'
						viewBox='0 0 24 24'
						style={{ height: '1.8rem', width: '1.8rem' }}
					>
						<title>linkedin</title>
						<path
							d='M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z'
							style={{ fill: 'currentcolor' }}
						></path>
					</svg>
				</a>
			</div>
		</div>
	);
}
