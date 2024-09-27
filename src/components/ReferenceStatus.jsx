import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { API } from '../Api';
import { getCandidateSummary, getJobHistorybyId } from '../apis';
import ReferenceResult from './ReferenceResult';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

function ReferenceStatus() {
	const params = useParams();
	const [, setJobhistory] = useState({});
	const [questionnaire] = useState('');
	const [qtnType] = useState('');
	const [, setQuestionList] = useState('');
	const [recruiterEmail] = useState('');
	const [timestamp, setTimestamp] = useState('');

	const [timestampArray, setTimestampArray] = useState([]);
	const [lifeCycle, setLifeCycle] = useState([]);
	const pdfExportComponent = React.useRef(null);
	useEffect(() => {
		const func = async () => {
			const response = await getJobHistorybyId(params.jobId);
			if (response.status === 401) {
				window.location.href = '/signin';
			}
			setJobhistory(response.data);
			const fetchData = async () => {
				const resp = await getCandidateSummary(params.candidateId);
				if (response.status === 401) {
					window.location.href = '/signin';
				}
				setLifeCycle(resp.data.lifeCycle);
			};
			fetchData();
		};
		func();
	}, [params.candidateId, params.jobId]);

	useEffect(() => {
		if (lifeCycle) {
			const data = lifeCycle.filter(
				m =>
					m.userType === 'Referee' /*&& m.name === jobhistory.name */ &&
					m.action === 'Reference Submitted'
			);
			setTimestampArray(data);
		}
	}, [lifeCycle]);

	useEffect(() => {
		if (timestampArray[0] !== undefined)
			setTimestamp(timestampArray[0].created_at);
	}, [timestampArray]);

	const convertDate = date => {
		const strDateTime = date;
		const myDate = dayjs(strDateTime).toDate().toUTCString();
		return myDate;
	};

	useEffect(() => {
		if (qtnType === 'user') {
			API.getTemplates({ questionnaire, email: recruiterEmail }).then(resp => {
				if (resp[0].questions) {
					setQuestionList(resp[0].questions);
				}
			});
		}
	}, [qtnType, questionnaire, recruiterEmail]);

	return (
		<div className='overflow-x-hidden'>
			<ReferenceResult
				timestamp={convertDate(timestamp)}
				pdfExportComponent={pdfExportComponent}
			/>
		</div>
	);
}

export default ReferenceStatus;
