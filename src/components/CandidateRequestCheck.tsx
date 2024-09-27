import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCheckRequestArchive, useJobHistory } from '../Common';
import ArchivedResponse from '../pages/user/ArchivedResponse';
import CandidateJobHistory from './CandidateJobHistory';
import Loading from './Loading';
import Referee from './Referee';
type JobHistoryParameters = 'name' | 'id';
type JobHistoryParams = Record<JobHistoryParameters, string>;

export default function CandidateRequestCheck() {
	const navigate = useNavigate();
	const { data: requestStatus, isLoading } = useCheckRequestArchive();
	const { pathname } = useLocation();
	const { name, id } = useParams() as JobHistoryParams;
	const { data: jobHistories, isLoading: isJobHistoryLoading } =
		useJobHistory();
	if (isLoading || isJobHistoryLoading) return <Loading />;
	if (jobHistories?.length) {
		navigate(`/job-history/${name}/${id}`, { replace: true });
		return null;
	}

	if (requestStatus === 200)
		return pathname.includes('jobHistory') ? (
			<Referee />
		) : (
			<CandidateJobHistory />
		);
	return <ArchivedResponse />;
}
