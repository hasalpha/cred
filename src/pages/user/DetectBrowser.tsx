import { Outlet } from 'react-router-dom';
import { detect } from 'detect-browser';
import { GenericErrorElement } from '../../components/GenericErrorElement';
import { Box, Link, Typography } from '@mui/material';
const supportedBrowsers = Object.freeze([
	'chrome',
	'edge',
	'safari',
	'firefox',
] as const);
type BrowserNames = (typeof supportedBrowsers)[number];

export function isCompatibleBrowser() {
	const browser = detect();
	if (browser) {
		const name = browser!.name as BrowserNames;
		const version = +browser!.version!.split('.')[0];
		switch (name) {
			case 'edge': {
				return version >= 81;
			}
			case 'chrome': {
				return version >= 85;
			}
			case 'firefox': {
				return version >= 86;
			}
			default: {
				return true;
			}
		}
	}
}

export default function DetectBrowser() {
	if (isCompatibleBrowser()) {
		return <Outlet />;
	}
	return (
		<GenericErrorElement showRedirect={false}>
			<Box className='rounded border-4 border-solid border-credibledOrange p-8 text-center'>
				<h2 className='mb-16'>
					Whoops! It appears your browser version may be out of date. To enjoy
					all the features of Credibled, please update your browser.
				</h2>
				<Typography>
					If you need further assistance, feel free to reach out to us at &nbsp;
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
			</Box>
		</GenericErrorElement>
	);
}
