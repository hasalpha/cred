import { useContext, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PhReport from '../../assets/img/ph_reports.png';
import { UserCol } from '../../components/tables';
import { AdminContext } from '../../contexts';
import { Typography } from '@mui/material';

function AdminUsers() {
	const currLink = useLocation().pathname;
	const baseLink = currLink.split('/')[1];
	const {
		users,
		usersLoading,
		inputSearchValue,
		handleSearchText,
		fetchUsers,
	} = useContext(AdminContext);
	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const time = useRef(
		new Date(localStorage.getItem('loginTime') ?? null).toString().slice(4, 25)
	);

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

	return (
		<div className='content'>
			<div className='container-fluid p-0'>
				<div className='card-plain'>
					<div className='card-body'>
						<div className='row'>
							<div className='col-md-12'>
								<div className='card-plain bb10'>
									<div className='row'>
										<div className='col-md-4 mb-2'>
											<Typography variant='h3'>Users List</Typography>
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

				<div className='row'>
					<div className='col text-right'>
						<Link
							to={`/${baseLink}/add-new-user`}
							className='btn btn-secondary'
						>
							Add New User
						</Link>
						&nbsp;&nbsp;
					</div>
					<div className='col-md-12 lrpad'>
						<div
							style={{ marginTop: 5 }}
							className='card mt_zero pad_zero'
						>
							<div className='search-box mx-0'>
								<div className='col-md-4'>
									<form className='navbar-form'>
										<div className='input-group no-border'>
											<i className='material-icons sr_icon'>search</i>
											<input
												value={inputSearchValue}
												type='text'
												onChange={handleSearchText}
												className='form-control'
												placeholder='Search...'
												maxLength={40}
											/>
										</div>
									</form>
								</div>
							</div>
							<div>
								{usersLoading ? (
									<div
										id='ph'
										className='text-center'
										style={{ margin: '5em 0' }}
									>
										<p>Loading Users ....</p>
										<img
											src={PhReport}
											style={{ width: '30%', cursor: 'pointer' }}
											alt='PhReport'
										/>
									</div>
								) : (
									<>
										{users.length ? (
											<>
												<div className='table-responsive hideonmobile'>
													<div id='utable'>
														<table className='table-hover table'>
															<thead>
																<tr>
																	<th className='text-center'>#</th>
																	<th className='sorting'>User Name</th>
																	<th className='sorting'>Email</th>
																	<th className='sorting'>Last Login</th>
																	<th className='sorting'>Status</th>
																	<th className='sorting'>Action</th>
																</tr>
															</thead>
															{users.map((data, index) => {
																return (
																	<UserCol
																		data={data}
																		index={index}
																		key={data.email}
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
													{users.map(data => (
														<table
															key={data.email}
															className='mobile-data-table br5_primary mx-0 table w-full table-fixed'
														>
															<tr key={data.id}>
																<td>Name</td>
																<td>
																	{data.firstName} {data.lastName}
																</td>
															</tr>
															<tr></tr>
															<tr>
																<td>Email</td>
																<td>{data.email}</td>
															</tr>
															<tr></tr>
															<tr>
																<td>Last login</td>
																<td>{formatDate(data.last_login)}</td>
															</tr>
															<tr></tr>
															<tr>
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
																<td>Action</td>
																<td>
																	<Link
																		class='text-edit'
																		to={
																			'/admin/users/edit-user-info/' +
																			data.email
																		}
																	>
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
												<p>No user found!</p>
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
export default AdminUsers;
