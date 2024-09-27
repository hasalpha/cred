import { useEffect, useContext, useState, useMemo } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { SuperAdminContext } from '../../contexts';
import PhReport from '../../assets/img/ph_reports.png';
import { AdminCol } from '../../components/tables';

export default function SuperAdmins() {
	const [,] = useState('');
	const [clientId, setClientId] = useState('');
	const [is_active, setIsActive] = useState('');
	const [Organization, setOrganization] = useState('');
	const [search, setSearch] = useState('');
	const {
		admins,
		Allclients,
		fetchClients,
		adminsLoading,
		inputSearchValue,
		handleAdminSearchText,
		handleUserFilterText,
		handleClearFilterText,
	} = useContext(SuperAdminContext);

	const clients = useMemo(
		() =>
			Allclients.reduce((acc, v) => {
				if (acc.find(val => val.label === v.organization)) {
					return acc;
				}
				return [...acc, { label: v.organization, id: v.uuid }];
			}, []),
		[Allclients]
	);

	const handleEnterPress = e => {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	};

	useEffect(() => {
		fetchClients();
	}, [fetchClients]);

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
											<h3> Admins List</h3>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='row'>
					<div className='col text-right'>
						<Link
							to='/super-admin/admins/add-new-admin'
							className='btn btn-secondary'
						>
							{' '}
							Add New Admin
						</Link>
						&nbsp;&nbsp;
					</div>

					<div className='col-md-12 lrpad'>
						<div className='card mt_zero pad_zero'>
							<div className='search-box1'>
								<div className='row'>
									<div className='col-md-3'>
										<form className='navbar-form'>
											<div className='input-group no-border'>
												<input
													value={inputSearchValue}
													type='text'
													onChange={async e => {
														setSearch(e?.target?.value);
														await handleAdminSearchText(e);
													}}
													className='form-control'
													placeholder='Search...'
													maxLength={40}
													onKeyDown={handleEnterPress}
												/>
												<i className='material-icons sr_icon'>search</i>
											</div>
										</form>
									</div>
									<div className='col-md-3'>
										<Autocomplete
											sx={{ mt: '-10px' }}
											options={clients}
											value={{ label: Organization, id: clientId }}
											renderInput={params => (
												<TextField
													{...params}
													label='Select client'
													variant='standard'
												/>
											)}
											onChange={(_e, v) => {
												if (!v) {
													setOrganization('');
													setClientId('');
												}
												setOrganization(v.label);
												setClientId(v.id);
											}}
										/>
									</div>

									<div className='col-md-3'>
										<div className='form-group pfem'>
											<select
												className='form-control select-top'
												value={is_active}
												onChange={evt => {
													setIsActive(evt.target.value);
												}}
											>
												<option value=''>Filter by Status</option>
												<option value='True'>Active</option>
												<option value='False'>InActive</option>
											</select>
											<span className='fa fa-fw fa-angle-down field_icon eye'></span>
										</div>
									</div>

									<div className='col-md-3 text-right'>
										<button
											className='btn btn-primary mt2 outline-focus'
											onClick={handleUserFilterText(
												clientId,
												is_active,
												'CLIENT_ADMIN',
												search
											)}
										>
											Search
										</button>

										<button
											className='btn btn-primary mt2 outline-focus'
											onClick={async () => {
												await handleClearFilterText('CLIENT_ADMIN');
												setClientId('');
												setOrganization('');
												setIsActive('');
												setSearch('');
											}}
										>
											Clear
										</button>
									</div>
								</div>
							</div>

							{/* <!--Mobile View Table starts here --> */}

							<div
								className='showonmobile mt3 lrpad'
								style={{ display: 'none' }}
							>
								<div className='row'>
									<table className='mobile-data-table table'>
										<tr>
											{' '}
											<td>Client</td>
											<td>The Fun Master</td>
										</tr>
										<tr>
											{' '}
											<td>Name</td>
											<td>
												<a href='edit_admin_info.html'>Elvine</a>
											</td>
										</tr>
										<tr>
											{' '}
											<td>Email</td>
											<td>contact@thefunmaster.com</td>
										</tr>
										<tr>
											{' '}
											<td>Last Updated</td>
											<td>2 hours ago</td>
										</tr>
										<tr>
											{' '}
											<td>Last Login</td>
											<td>04/03/2021 12.30PM</td>
										</tr>
										<tr>
											{' '}
											<td>Status</td>
											<td>
												<span className='txt_green fw500'>Active</span>
											</td>
										</tr>
										<tr>
											{' '}
											<td>Actions</td>
											<td>
												<Link to='admin/admins/edit-admin-info'>
													{' '}
													<i className='fa fa-edit'></i>&nbsp;&nbsp;Edit
												</Link>
											</td>
										</tr>
									</table>
								</div>
							</div>

							{/* <!--Mobile View Table starts here --> */}
							<div>
								{adminsLoading ? (
									<div
										id='ph'
										className='text-center'
										style={{ margin: '5em 0' }}
									>
										<p>Loading Admins ....</p>
										<img
											src={PhReport}
											style={{ width: '30%', cursor: 'pointer' }}
											alt='PhReport'
										/>
									</div>
								) : (
									<>
										{admins && admins.length ? (
											<>
												<div className='table-responsive hideonmobile'>
													<div id='utable'>
														<table className='table-hover table'>
															<thead>
																<tr>
																	<th className='text-center'>#</th>
																	<th className='sorting'>Client</th>
																	<th className='sorting'>Name</th>
																	<th className='sorting'>Email</th>
																	<th className='sorting'>Last Updated</th>
																	<th className='sorting'>Last Login</th>
																	<th className='sorting'>Status</th>
																	<th className='sorting'>Action</th>
																</tr>
															</thead>
															{admins.map((data, index) => {
																return (
																	<AdminCol
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
												<p>No Admins found!</p>
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
