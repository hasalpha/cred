import { useEffect, useContext } from 'react';
import { SuperAdminContext } from '../../contexts';
import PhReport from '../../assets/img/ph_reports.png';
import { FlagCol } from '../../components/tables';
import type { FlagObject } from './Types';
import { Outlet, useLocation } from 'react-router-dom';

export type SuperAdminContextType = {
	flags: FlagObject[];
	flagsLoading: boolean;
	// inputSearchValue: string;
	// handleSearchText: (...rest: any) => any;
	// handleClientFilterText: (...rest: any) => any;
	// handleClientClearFilterText: (...rest: any) => any;
	fetchFlags: (...rest: any) => any;
};

function useSuperAdmin() {
	const values = useContext(SuperAdminContext);
	if (!values)
		throw new Error(
			'useSuperAdmin can only be used inside a SuperAdminContext provider'
		);
	return values;
}

export default function SuperAdminXMode() {
	const { flags, flagsLoading, fetchFlags } = useSuperAdmin();
	const location = useLocation();

	useEffect(() => {
		fetchFlags();
	}, [fetchFlags]);

	if (location.pathname.includes('edit-xmode')) {
		return <Outlet />;
	}

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
											<h3> X Mode</h3>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='row'>
					<div className='col-md-12 lrpad'>
						<div className='card mt_zero pad_zero'>
							<div className='search-box1'>
								<div className='row'>
									{/* <div className='col-md-4'>
										<form className='navbar-form'>
											<div className='input-group no-border'>
												<input
													// value={inputSearchValue}
													type='text'
													onChange={async e => {
														setSearch(e?.target?.value);
														// await handleSearchText(e);
													}}
													className='form-control'
													placeholder='Search...'
													maxLength={40}
													onKeyDown={handleEnterPress}
												/>
												<i className='material-icons sr_icon'>search</i>
											</div>
										</form>
									</div> */}

									{/* <div className='col-md-4'>
										<div className='form-group pfem'>
											<select
												className='form-control select-top'
												value={is_active}
												onChange={evt => {
													setIsActive(evt.target.value);
												}}
											>
												<option value=''>Filter by Status</option>
												<option value='True'>No One</option>
												<option value='False'>EveryOne</option>
												<option value='False'>User Specific</option>
											</select>
											<span className='fa fa-fw fa-angle-down field_icon eye'></span>
										</div>
									</div> */}

									{/* <div className='col-md-4 text-right'> */}
									{/* <button
											className='btn btn-primary mt2 outline-focus'
											// onClick={handleClientFilterText(is_active, search)}
										>
											Search
										</button> */}

									{/* <button
											className='btn btn-primary mt2 outline-focus'
											// onClick={async () => {
											// 	await handleClientClearFilterText();
											// 	setIsActive('');
											// 	setSearch('');
											// }}
										>
											Clear
										</button> */}
									{/* </div> */}
								</div>
							</div>

							<div>
								{flagsLoading ? (
									<div
										id='ph'
										className='text-center'
										style={{ margin: '5em 0' }}
									>
										<p>Loading Features ....</p>
										<img
											src={PhReport}
											style={{ width: '30%', cursor: 'pointer' }}
											alt='PhReport'
										/>
									</div>
								) : (
									<>
										{flags.length ? (
											<>
												<div className='table-responsive hideonmobile'>
													<div id='utable'>
														<table className='table-hover table'>
															<thead>
																<tr>
																	<th className='text-center'>#</th>
																	<th className='sorting'>Feature Name</th>
																	<th className='sorting'>Last Updated</th>
																	<th className='sorting'>Permissions</th>
																	<th className='sorting'>Action</th>
																</tr>
															</thead>
															{flags.map((data, index) => {
																return (
																	<FlagCol
																		key={index}
																		data={data}
																		index={index}
																	/>
																);
															})}
														</table>
													</div>
												</div>
											</>
										) : (
											<div
												id='ph'
												className='text-center'
												style={{ margin: '5em 0' }}
											>
												<p>No Feature found!</p>
												<img
													src={PhReport}
													style={{ width: '30%', cursor: 'pointer' }}
													alt='PhReport'
												/>
											</div>
										)}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
