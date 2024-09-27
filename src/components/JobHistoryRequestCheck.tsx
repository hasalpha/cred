import { useLocation } from 'react-router-dom';
import { useCheckJobHistoryArchive } from '../Common';
import Loading from './Loading';
import Referee from './Referee';
import JobHistory from './JobHistory';
import ArchivedResponse from 'pages/user/ArchivedResponse';

export default function JobHistoryRequestCheck() {
	const { data: requestStatus, isLoading } = useCheckJobHistoryArchive();
	const { pathname } = useLocation();
	if (isLoading) {
		return <Loading />;
	}
	if (requestStatus === 200) {
		return pathname.includes('jobHistory') ? <Referee /> : <JobHistory />;
	}
	return <ArchivedResponse />;
}
