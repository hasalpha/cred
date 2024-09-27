import { HorizontalLinearStepper } from 'components/HorizontalLinearStepper';
import { Outlet } from 'react-router-dom';
import { PoliceSessionContextProvider } from '../context/PersonalDetailsContext';

export default function PoliceCheckMultiStepLayout() {
	return (
		<PoliceSessionContextProvider>
			<HorizontalLinearStepper />
			<Outlet />
			<br />
		</PoliceSessionContextProvider>
	);
}
