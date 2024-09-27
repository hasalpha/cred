import React from 'react';
export default function SuperAdminAuditLog() {
	return (
		<div class='content'>
			<div class='container-fluid'>
				<div class='card-plain'>
					<div class='card-body'>
						<div class='row'>
							<div class='col-md-12'>
								<div class='card-plain bb10'>
									<div class='row'>
										<div class='col-md-4'>
											<h3> Audit Log</h3>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class='row'>
					<div class='col-md-12 lrpad'>
						<div class='card mt_zero pad_zero'>
							<div class='search-box1'>
								<div class='row'>
									<div class='col-md-6'>
										<form class='navbar-form'>
											<div class='input-group no-border'>
												<input
													type='text'
													value=''
													class='form-control'
													placeholder='Search...'
												/>
												<i class='material-icons sr_icon'>search</i>
											</div>
										</form>
									</div>

									<div class='col-md-6'>
										<div class='form-group pfem'>
											<select class='form-control select-top'>
												<option value='0: Object'>Filter by Client</option>
												<option value='1: Object'>AGS Info</option>
												<option value='2: Object'>Bitcoin</option>
												<option value='3: Object'>T-mobile</option>
											</select>
											<span class='fa fa-fw fa-angle-down field_icon eye'></span>
										</div>
									</div>

									<div class='col-md-2'>
										<div class='form-group pfem'>
											<select class='form-control'>
												<option value='0: Object'>Object</option>
												<option value='1: Object'>Company</option>
												<option value='2: Object'>Delegation</option>
												<option value='3: Object'>Client</option>
												<option value='4: Object'>Client User</option>
												<option value='5: Object'>Client Admin</option>
												<option value='6: Object'>Client Article</option>
											</select>
											<span class='fa fa-fw fa-angle-down field_icon eye'></span>
										</div>
									</div>

									<div class='col-md-2'>
										<div class='form-group pfem'>
											<select class='form-control'>
												<option value='0: Object'>Action</option>
												<option value='1: Object'>List</option>
												<option value='2: Object'>Get</option>
												<option value='3: Object'>Login</option>
												<option value='4: Object'>Logout</option>
											</select>
											<span class='fa fa-fw fa-angle-down field_icon eye'></span>
										</div>
									</div>

									<div class='col-md-3'>
										<div class='form-group'>
											<label class='label-static'>
												Start Date
												<span class='sup_char'>
													<sup>*</sup>
												</span>
											</label>
											<input
												type='date'
												value=''
												class='form-control'
											/>
										</div>
									</div>

									<div class='col-md-3'>
										<div class='form-group'>
											<label class='label-static'>
												End Date
												<span class='sup_char'>
													<sup>*</sup>
												</span>
											</label>
											<input
												type='date'
												value=''
												class='form-control'
											/>
										</div>
									</div>

									<div class='col-md-2'>
										<div
											class='form-group'
											style={{ marginTop: '1em' }}
										>
											<a
												id='srh'
												href='#!'
												class='btn btn-primary'
											>
												Search
											</a>
										</div>
									</div>
								</div>
							</div>

							<div class='col-md-12 pt2 text-right'>
								<a
									href='#!'
									className='btn btnxs btn-secondary mr2'
								>
									Download Report CSV
								</a>
							</div>

							{/* <!--Mobile View Table starts here --> */}

							<div
								class='showonmobile mt3 lrpad'
								style={{ display: 'none' }}
							>
								<div class='row'>
									<table class='mobile-data-table table'>
										<tr>
											{' '}
											<td>Client Name</td>
											<td>The Fun Master</td>
										</tr>
										<tr>
											{' '}
											<td>Email</td>
											<td>contact@thefunmaster.com</td>
										</tr>
										<tr>
											{' '}
											<td>Object</td>
											<td>Company</td>
										</tr>
										<tr>
											{' '}
											<td>Action</td>
											<td>LIST</td>
										</tr>
										<tr>
											{' '}
											<td>Details</td>
											<td>{`{"search":null,"options":{}}`}</td>
										</tr>
										<tr>
											{' '}
											<td>Date</td>
											<td>04/03/2021</td>
										</tr>
									</table>
									<table class='mobile-data-table table'>
										<tr>
											{' '}
											<td>Client Name</td>
											<td>Verizon</td>
										</tr>
										<tr>
											{' '}
											<td>Email</td>
											<td>contact@Verizon.com</td>
										</tr>
										<tr>
											{' '}
											<td>Object</td>
											<td>Delegation</td>
										</tr>
										<tr>
											{' '}
											<td>Action</td>
											<td>GET</td>
										</tr>
										<tr>
											{' '}
											<td>Details</td>
											<td>{`{"search":null,"options":{}}`}</td>
										</tr>
										<tr>
											{' '}
											<td>Date</td>
											<td>04/03/2021</td>
										</tr>
									</table>
									<table class='mobile-data-table table'>
										<tr>
											{' '}
											<td>Client Name</td>
											<td>AGS Info</td>
										</tr>
										<tr>
											{' '}
											<td>Email</td>
											<td>contact@AGS Info.com</td>
										</tr>
										<tr>
											{' '}
											<td>Object</td>
											<td>Company</td>
										</tr>
										<tr>
											{' '}
											<td>Action</td>
											<td>LIST</td>
										</tr>
										<tr>
											{' '}
											<td>Details</td>
											<td>{`{"search":null,"options":{}}`}</td>
										</tr>
										<tr>
											{' '}
											<td>Date</td>
											<td>04/03/2021</td>
										</tr>
									</table>
									<table class='mobile-data-table table'>
										<tr>
											{' '}
											<td>Client Name</td>
											<td>Xtreme Inc</td>
										</tr>
										<tr>
											{' '}
											<td>Email</td>
											<td>contact@Xtreme.com</td>
										</tr>
										<tr>
											{' '}
											<td>Object</td>
											<td>Client admin</td>
										</tr>
										<tr>
											{' '}
											<td>Action</td>
											<td>LIST</td>
										</tr>
										<tr>
											{' '}
											<td>Details</td>
											<td>{`{"search":null,"options":{}}`}</td>
										</tr>
										<tr>
											{' '}
											<td>Date</td>
											<td>04/03/2021</td>
										</tr>
									</table>
									<table class='mobile-data-table table'>
										<tr>
											{' '}
											<td>Client Name</td>
											<td>T-Mobile</td>
										</tr>
										<tr>
											{' '}
											<td>Email</td>
											<td>contact@tmobile.com</td>
										</tr>
										<tr>
											{' '}
											<td>Object</td>
											<td>Company</td>
										</tr>
										<tr>
											{' '}
											<td>Action</td>
											<td>LIST</td>
										</tr>
										<tr>
											{' '}
											<td>Details</td>
											<td>{`{"search":null,"options":{}}`}</td>
										</tr>
										<tr>
											{' '}
											<td>Date</td>
											<td>04/03/2021</td>
										</tr>
									</table>
									<table class='mobile-data-table table'>
										<tr>
											{' '}
											<td>Client Name</td>
											<td>AXE</td>
										</tr>
										<tr>
											{' '}
											<td>Email</td>
											<td>contact@axe.com</td>
										</tr>
										<tr>
											{' '}
											<td>Object</td>
											<td>Company</td>
										</tr>
										<tr>
											{' '}
											<td>Action</td>
											<td>LIST</td>
										</tr>
										<tr>
											{' '}
											<td>Details</td>
											<td>{`{"search":null,"options":{}}`}</td>
										</tr>
										<tr>
											{' '}
											<td>Date</td>
											<td>04/03/2021</td>
										</tr>
									</table>
									<table class='mobile-data-table table'>
										<tr>
											{' '}
											<td>Client Name</td>
											<td>Xtreme Inc</td>
										</tr>
										<tr>
											{' '}
											<td>Email</td>
											<td>contact@Xtreme.com</td>
										</tr>
										<tr>
											{' '}
											<td>Object</td>
											<td>Client admin</td>
										</tr>
										<tr>
											{' '}
											<td>Action</td>
											<td>LIST</td>
										</tr>
										<tr>
											{' '}
											<td>Details</td>
											<td>{`{"search":null,"options":{}}`}</td>
										</tr>
										<tr>
											{' '}
											<td>Date</td>
											<td>04/03/2021</td>
										</tr>
									</table>
									<table class='mobile-data-table table'>
										<tr>
											{' '}
											<td>Client Name</td>
											<td>T-Mobile</td>
										</tr>
										<tr>
											{' '}
											<td>Email</td>
											<td>contact@tmobile.com</td>
										</tr>
										<tr>
											{' '}
											<td>Object</td>
											<td>Company</td>
										</tr>
										<tr>
											{' '}
											<td>Action</td>
											<td>LIST</td>
										</tr>
										<tr>
											{' '}
											<td>Details</td>
											<td>{`{"search":null,"options":{}}`}</td>
										</tr>
										<tr>
											{' '}
											<td>Date</td>
											<td>04/03/2021</td>
										</tr>
									</table>
									<table class='mobile-data-table table'>
										<tr>
											{' '}
											<td>Client Name</td>
											<td>AXE</td>
										</tr>
										<tr>
											{' '}
											<td>Email</td>
											<td>contact@axe.com</td>
										</tr>
										<tr>
											{' '}
											<td>Object</td>
											<td>Company</td>
										</tr>
										<tr>
											{' '}
											<td>Action</td>
											<td>LIST</td>
										</tr>
										<tr>
											{' '}
											<td>Details</td>
											<td>{`{"search":null,"options":{}}`}</td>
										</tr>
										<tr>
											{' '}
											<td>Date</td>
											<td>04/03/2021</td>
										</tr>
									</table>
								</div>
							</div>

							{/* <!--Mobile View Table starts here --> */}

							<div class='table-responsive hideonmobile'>
								<table class='table-hover table'>
									<thead>
										<tr>
											<th class='text-center'>#</th>
											<th class='sorting'>Client Name</th>
											<th class='sorting'>Email</th>
											<th class='sorting'>Object</th>
											<th class='sorting'>Action</th>
											<th class='sorting'>Details</th>
											<th class='sorting'>Date</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td class='text-center'>1</td>
											<td>The Fun Master</td>
											<td>contact@thefunmaster.com</td>
											<td>Company</td>
											<td>LIST</td>
											<td>{`{"search":null,"options":{}}`}</td>
											<td>04/03/2021</td>
										</tr>
										<tr>
											<td class='text-center'>2</td>
											<td>Verizon</td>
											<td>contact@varizon.com</td>
											<td>Delegation</td>
											<td>GET</td>
											<td>{`{"options":{'limit':5,"skip":0},"search":null}`}</td>
											<td>04/03/2021</td>
										</tr>

										<tr>
											<td class='text-center'>3</td>
											<td>T-Mobile</td>
											<td>contact@tmobile.com</td>
											<td>Company</td>
											<td>GET</td>
											<td>{`{"search":null,"options":{}}`}</td>
											<td>04/03/2021</td>
										</tr>

										<tr>
											<td class='text-center'>4</td>
											<td>AGS Info</td>
											<td>contact@agsinfo.com</td>
											<td>Delegation</td>
											<td>LIST</td>
											<td>{`{"options":{"limit":5,"skip":0},"search":null}`}</td>
											<td>04/03/2021</td>
										</tr>

										<tr>
											<td class='text-center'>5</td>
											<td>Xtreme Inc</td>
											<td>contact@xtremeinc.com</td>
											<td>Client Admin</td>
											<td>LIST</td>
											<td>{`{"options":{"limit":5,"skip":0},"search":null}`}</td>
											<td>04/03/2021</td>
										</tr>

										<tr>
											<td class='text-center'>6</td>
											<td>MTS mobile</td>
											<td>contact@mtsmobile.com</td>
											<td>Client</td>
											<td>LOGIN</td>
											<td>{`{"search":null,"options":{}}`}</td>
											<td>04/03/2021</td>
										</tr>

										<tr>
											<td class='text-center'>7</td>
											<td>AXE</td>
											<td>contact@axe.com</td>
											<td>Client Admin</td>
											<td>LIST</td>
											<td>{`{"options":{"limit":5,"skip":0},"search":null}`}</td>
											<td>04/03/2021</td>
										</tr>

										<tr>
											<td class='text-center'>8</td>
											<td>Mod Furn Limited</td>
											<td>contact@modfurn.com</td>
											<td>Company</td>
											<td>LOGIN</td>
											<td>{`{"search":null,"options":{}}`}</td>
											<td>04/03/2021</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
