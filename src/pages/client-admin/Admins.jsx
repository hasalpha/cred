import React, { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PhReport from '../../assets/img/ph_reports.png';
import { ClientAdminCol } from '../../components/tables';
import { AdminContext } from '../../contexts';
import { Typography } from '@mui/material';

const formatDate = dateString => {
	if (dateString) {
		let d = new Date(dateString);
		let time = new Intl.DateTimeFormat('en', {
			dateStyle: 'full',
			timeStyle: 'short',
		}).format(d);
		return time;
	}
};

export default function Admins() {
	const {
		admins,
		adminsLoading,
		inputSearchValue,
		handleSearchAdmins,
		fetchAdmins,
	} = useContext(AdminContext);

	const time = useRef(
		new Date(localStorage.getItem('loginTime')).toString().slice(4, 25)
	);

	useEffect(() => {
		fetchAdmins();
	}, [fetchAdmins]);

	return (
		<div className='content p-0'>
			<div className='container-fluid p-0'>
				<div className='card-plain p-0'>
					<div className='card-body p-0'>
						<div className='row'>
							<div className='col-md-12'>
								<div className='card-plain bb10'>
									<div className='row'>
										<div className='col-md-4 mb-2'>
											<Typography variant='h3'> Admins List</Typography>
										</div>
										<div className='col-md-8 text-right'>
											<Typography className='login_info'>
												Logged in as <strong>Admin</strong> on{' '}
												<span className='text-secondary'>{time?.current}</span>
											</Typography>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='row p-3'>
					<Link
						to='/admin/add-new-admin'
						className='btn btn-secondary'
					>
						Add New Admin
					</Link>
					<div
						style={{ marginTop: 5 }}
						className='card mt_zero pad_zero'
					>
						<div className='search-box mx-0 mb-2'>
							<div className='col-md-4'>
								<form className='navbar-form'>
									<div className='input-group no-border'>
										<i className='material-icons sr_icon'>search</i>
										<input
											value={inputSearchValue}
											type='text'
											onChange={handleSearchAdmins}
											className='form-control'
											placeholder='Search...'
											maxLength={40}
										/>
									</div>
								</form>
							</div>
						</div>
						<div>
							{adminsLoading ? (
								<div
									id='ph'
									className='text-center'
									style={{ margin: '5em 0' }}
								>
									<p>Loading Admins ....</p>
									<img
										alt='PhReport'
										src={PhReport}
										style={{ width: '30%', cursor: 'pointer' }}
									/>
								</div>
							) : (
								<>
									{admins.length ? (
										<>
											<div className='table-responsive hideonmobile'>
												<div id='utable'>
													<table className='table-hover table'>
														<thead>
															<tr>
																<th className='text-center'>#</th>
																{/* <th className="sorting">Client</th> */}
																<th className='sorting'>Name</th>
																<th className='sorting'>Email</th>
																{/* <th className="sorting">Admin Type</th> */}
																{/* <th className="sorting">Last Updated</th> */}
																<th className='sorting'>Last Login</th>
																<th className='sorting'>Status</th>
																<th className='sorting'>Action</th>
															</tr>
														</thead>
														{admins.map((data, index) => {
															return (
																<ClientAdminCol
																	data={data}
																	index={index}
																/>
															);
														})}
													</table>
												</div>
											</div>
											<div
												className='showonmobile'
												style={{ display: 'none' }}
											>
												{admins.map(data => (
													<table
														className='mobile-data-table br5_primary mx-0 table w-full table-fixed'
														key={data.id}
													>
														<tr>
															{' '}
															<td>Name</td>
															<td>
																{data.firstName} {data.lastName}
															</td>
														</tr>
														<tr></tr>
														<tr>
															{' '}
															<td>Email</td>
															<td>{data.email}</td>
														</tr>
														<tr></tr>
														<tr>
															{' '}
															<td>Last login</td>
															<td>{formatDate(data.last_login)}</td>
														</tr>
														<tr></tr>
														<tr>
															{' '}
															<td>Status</td>
															<td>
																<span
																	className={
																		data.is_active
																			? 'txt_green fw500'
																			: 'txt_red fw500'
																	}
																>
																	{data.is_active ? 'Active' : 'Inactive'}
																</span>
															</td>
														</tr>
														<tr></tr>
														<tr>
															{' '}
															<td>Action</td>
															<td>
																<Link
																	class='text-edit'
																	to={
																		'/admin/admins/edit-admin-info/' +
																		data.email
																	}
																>
																	{' '}
																	<i className='fa fa-edit'></i>
																	&nbsp;&nbsp;Edit
																</Link>
															</td>
														</tr>
													</table>
												))}
											</div>
										</>
									) : (
										<div
											id='ph'
											className='text-center'
											style={{ margin: '5em 0' }}
										>
											<p>No Admins Found !</p>
											<img
												alt='PhReport'
												src={PhReport}
												style={{ width: '30%', cursor: 'pointer' }}
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
	);
}
