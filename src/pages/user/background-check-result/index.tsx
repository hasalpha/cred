import React, { useMemo } from 'react';
import { useNavigation, useParams } from 'react-router-dom';
import Box from '@mui/material/Box/Box';
import { Divider, Stack, Typography } from '@mui/material';
import Loading from '../../../components/Loading';
import { downloadPDF, useBackgroundReportHTML } from '../../../Common';
import { getBackgroundCheck, getReport } from '../../../apis/user.api';
import { LoadingButton } from '@mui/lab';
import { useImmer } from 'use-immer';
import { BackgroundCheckRequests } from '../background-check/types';
import { useCheckTypes } from '../../../hooks';
import { GoBackLink } from 'components';

function BackgroundCheckResultPage() {
	const [downloading, setDownloading] = useImmer(false);
	const { state } = useNavigation();
	const { data: types, isLoading: typesLoading } = useCheckTypes();
	const typesMap = useMemo(
		() => types?.reduce((acc, v) => ({ ...acc, [v.uuid]: v.name }), {}),
		[types]
	) as { [k: string]: string };
	const { uuid } = useParams() as { uuid: string };
	const { data: html, isLoading } = useBackgroundReportHTML(uuid);
	if (state === 'loading' || typesLoading) {
		return <Loading />;
	}
	return (
		<>
			<Stack
				direction='row'
				justifyContent='space-between'
			>
				<GoBackLink relative />
				<LoadingButton
					loading={downloading}
					variant='contained'
					color='secondary'
					onClick={() => {
						setDownloading(true);
						getReport(uuid).then(async pdf => {
							const response = (await getBackgroundCheck({})) as {
								results: BackgroundCheckRequests;
							};
							const user = response.results.find(val => val.uuid === uuid)!;
							const type = typesMap[user.scan_type];
							downloadPDF(
								pdf,
								`${user.firstName}_${user.lastName}_${type
									.split(' ')
									.join('_')}`
							);
							setDownloading(false);
						});
					}}
				>
					Download PDF
				</LoadingButton>
			</Stack>
			<br />
			<Typography variant='h3'>Report</Typography>
			<Divider variant='fullWidth' />
			{isLoading ? (
				<Loading />
			) : (
				<Box dangerouslySetInnerHTML={{ __html: html ?? '' }} />
			)}
		</>
	);
}

const memoBackgroundCheckResultPage = React.memo(BackgroundCheckResultPage);
memoBackgroundCheckResultPage.displayName = 'BackgroundCheckResult';
export default memoBackgroundCheckResultPage;
