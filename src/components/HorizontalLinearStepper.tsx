import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box/Box';
import { useLocation } from 'react-router-dom';

export const steps = [
	['personal-information', 'Personal Information'],
	['address', 'Address & CRJMC'],
	['identity-verification', 'Identity Verification'],
	['preview', 'Preview'],
	['payment', 'Payment'],
];

export function HorizontalLinearStepper() {
	const location = useLocation();
	const activeStep = steps.findIndex(
		step => step[0] === location.pathname.split('/').at(-1)!
	);
	return (
		<Box className='my-8'>
			<Stepper
				activeStep={activeStep}
				alternativeLabel
			>
				{steps.map(label => {
					return (
						<Step key={label[1]}>
							<StepLabel>{label[1]}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
		</Box>
	);
}
