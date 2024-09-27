import React, { useEffect, useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SuperAdminContext } from '../../contexts';
import Chart from 'chart.js/auto';
import { LocalizationProvider as LocalizaitonProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker/DatePicker';
import { CustomToolTip } from '../../components/CustomToolTip';
import { ReportsToolTip } from '../../components';
import { useLocalStorageHook } from '../../Common';
import { downloadcsvreport } from '../../apis';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const addDays = (date, days) => {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return dayjs(result).toISOString();
};

export default function Reports() {
	const {
		reports,
		setReports,
		superAdminReportsFilter,
		Allclients,
		fetchClients,
	} = useContext(SuperAdminContext);
	const navigate = useNavigate();
	const today = useMemo(() => dayjs().toISOString(), []);
	const lastMonth = useMemo(() => addDays(today, -30), [today]);
	const [startDate, setStartDate] = useLocalStorageHook('lastmonth', lastMonth);
	const [endDate, setEndDate] = useLocalStorageHook('today', today);
	const [Orgnization, setOrganization] = useLocalStorageHook(
		'organization',
		''
	);
	const [OrganizationName, setOrganizationName] = useState('');
	const [clientId, setClientId] = useLocalStorageHook('clientId', '');
	const [chartObject, setChartObject] = useState(null);
	console.log(startDate, endDate);

	useEffect(() => {
		fetchClients();
	}, [fetchClients]);

	const renderReport = () => {
		const chart = new Chart(document.getElementById('acquisitions'), {
			type: 'bar',
			data: {
				datasets: [
					{
						label: OrganizationName,
						backgroundColor: [
							'#24B6F7',
							'#CCE5FF',
							'#AE95FF',
							'#F8C87F',
							'#96CB88',
						],
						data: [
							{
								y: 'Total requested',
								x: reports?.requestedCount,
							},
							{ y: 'Pending', x: reports?.pending },
							{ y: 'In progress', x: reports?.in_progress },
							{ y: '1 ref completed', x: reports?.one_ref_completed },
							{ y: 'Acceptance criteria met', x: reports?.acceptance_met },
						],
					},
				],
			},
			options: {
				plugins: {
					legend: {
						display: false,
					},
					datalabels: {
						anchor: 'end',
						align: 'end',
						color: '#000',
						font: {
							weight: 'bold',
						},
						formatter: value => {
							return value;
						},
					},
				},
				tooltips: {
					enabled: false,
				},
				responsive: true,
				maintainAspectRatio: false,
				indexAxis: 'y',
			},
		});
		setChartObject(chart);
	};

	const download_Csv = async e => {
		e.preventDefault();
		const resp = await downloadcsvreport({
			start_date: startDate,
			end_date: endDate,
		});
		if (resp.status === 200) {
			toast.success('File downloaded successfully');
			const data = await resp.blob();
			const downloadUrl = window.URL.createObjectURL(data);
			const link = document.createElement('a');
			link.href = downloadUrl;
			link.setAttribute('download', startDate + '_' + endDate + '_.csv');
			document.body.appendChild(link);
			link.click();
			link.remove();
		}
	};

	useEffect(() => {
		if (Object.keys(reports).length > 0) {
			chartObject?.destroy();
			renderReport();
		}
	}, [reports]);

	const toolTipContent = [
		[
			'Total requested',
			'Total reference checks requested in the selected period, including all statuses.',
		],
		[
			'Pending',
			'Reference checks sent to candidates but not yet acted upon (link not clicked).',
		],
		[
			'In Progress',
			'Reference checks sent to referees and awaiting their responses.',
		],
		[
			'1 Ref completed',
			'Reference checks with at least one completed response from referees.',
		],
		[
			'Acceptance Criteria met',
			'Reference checks that are fully completed and meet acceptance criteria.',
		],
	];

	console.log(OrganizationName);
	return (
		<div className='content'>
			<div className='container-fluid'>
				<div className='card-plain'>
					<div className='card-body'>
						<div className='row'>
							<div className='col-md-12'>
								<div className='card-plain bb10'>
									<div className='row'>
										<div className='col-md-4'>
											<h3> Reports</h3>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='col-md-12 lrpad'>
						<div className='card mt_zero pad_zero'>
							<div className='search-box1'>
								<div className='row'>
									<div className='col-md-3'>
										<label className='bmd-label-static'>Start Date</label>
										<CustomToolTip content='Select the start date from which want to display report' />
										<LocalizaitonProvider dateAdapter={AdapterDayjs}>
											<div id='stdtc'>
												<DatePicker
													views={['year', 'month', 'day']}
													defaultValue={dayjs(startDate)}
													maxDate={endDate ? dayjs(endDate) : dayjs()}
													onChange={newValue => {
														setStartDate(
															new Date(
																newValue.toDate().setHours(0, 0, 0, 0)
															).toISOString()
														);
													}}
												/>
											</div>
										</LocalizaitonProvider>
									</div>

									<div className='col-md-3'>
										<label className='bmd-label-static'>End Date</label>
										<CustomToolTip content='Select the end date untill this day report will generated' />
										<LocalizaitonProvider dateAdapter={AdapterDayjs}>
											<div id='endtc'>
												<DatePicker
													views={['year', 'month', 'day']}
													defaultValue={dayjs(endDate)}
													maxDate={dayjs()}
													minDate={dayjs(startDate)}
													onChange={newValue => {
														setEndDate(
															new Date(
																newValue.toDate().setHours(23, 59, 59, 59)
															).toISOString()
														);
													}}
												/>
											</div>
										</LocalizaitonProvider>
									</div>

									<div className='col-md-3'>
										<label className='bmd-label-static'>Client</label>
										<CustomToolTip content='Select the client for which want to generate the report' />
										<select
											className='form-control'
											value={Orgnization}
											onChange={evt => {
												if (evt.target.value === 'all_client') {
													setOrganizationName(evt.target.value);
													setOrganization(evt.target.value);
												} else {
													let client = Allclients.find(
														val => val.uuid === evt.target.value
													);
													setClientId(client?.uuid);
													setOrganization(evt.target.value);
													setOrganizationName(client?.organization);
												}
											}}
										>
											<option value=''>Filter by Client</option>
											<option value='all_client'>All Clients</option>
											{Allclients.map(val => (
												<option
													key={val.uuid}
													value={val.uuid}
												>
													{val.organization}, {val.country}
												</option>
											))}
										</select>
									</div>

									<div className='col-md-3 text-right'>
										{OrganizationName === 'all_client' ? (
											<button
												className='btn btn-primary mt2 outline-focus mx-3'
												onClick={download_Csv}
											>
												Download
											</button>
										) : (
											<button
												className='btn btn-primary mt2 outline-focus mx-3'
												onClick={superAdminReportsFilter(
													startDate,
													endDate,
													clientId
												)}
											>
												Search
											</button>
										)}

										<button
											className='btn btn-primary mt2 outline-focus'
											onClick={() => {
												setStartDate(lastMonth);
												setEndDate(today);
												setOrganization('');
												setChartObject(null);
												setReports({});
											}}
										>
											Clear
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='col-md-12 lrpad'>
						<div className='card mt_zero pad_zero'>
							<h4 className='ml-8'>
								{' '}
								Engagement <ReportsToolTip content={toolTipContent} />{' '}
							</h4>

							<div style={{ height: '400px' }}>
								{Object.keys(reports).length > 0 ? (
									<canvas id='acquisitions'></canvas>
								) : (
									<div className='ml-8'>
										To run this report, please adjust the filters above and
										click "Search"
									</div>
								)}
							</div>
						</div>
					</div>

					<div>
						<div className='col-md-12 lrpad'>
							<div className='card mt_zero pad_zero'>
								<h4 className='ml-8'>
									{' '}
									Background Checks{' '}
									<CustomToolTip content='Background Check for the client' />{' '}
								</h4>
								{reports?.background_scan_breakup ? (
									<>
										<div className='table-responsive hideonmobile'>
											<div id='utable'>
												<table className='table-hover table'>
													<thead>
														<tr>
															<th className='sorting'></th>
															<th className='sorting'>Scan Type</th>
															<th className='sorting'>Sent</th>
															<th className='sorting'>In progress</th>
															<th className='sorting'>Complete</th>
															<th className='sorting'>Other</th>
														</tr>
													</thead>
													{Object.entries(reports.background_scan_breakup).map(
														([key, values]) => (
															<tbody>
																<tr>
																	<td className='text-center'></td>

																	<td>{key}</td>
																	<td>{values.sent}</td>
																	<td>{values.in_progress}</td>
																	<td>{values.complete}</td>
																	<td>{values.other}</td>
																</tr>
															</tbody>
														)
													)}
												</table>
											</div>
										</div>
									</>
								) : (
									<div className='ml-8'>
										To run this report, please adjust the filters above and
										click "Search"
									</div>
								)}
							</div>
						</div>
					</div>

					<div className='col-md-12 lrpad'>
						<div className='card mt_zero pad_zero'>
							<h4 className='ml-8'> Lead Generation</h4>
							{Object.keys(reports).length > 0 ? (
								<div className='flex'>
									<div className='flex w-full flex-col items-center'>
										<h3 className='font-bold'>{reports.looking_to_hire}</h3>{' '}
										<h4>Leads looking to hire</h4>
									</div>
									<div className='flex w-full flex-col items-center'>
										<h3 className='font-bold'>{reports.looking_for_job}</h3>{' '}
										<h4>Leads looking for a job</h4>
									</div>
									<div className='flex w-full flex-col items-center'>
										<h3 className='font-bold'>{reports.success}%</h3>{' '}
										<h4>Answered</h4>
									</div>
								</div>
							) : (
								<div className='ml-8'>
									To run this report, please adjust the filters above and click
									"Search"
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
