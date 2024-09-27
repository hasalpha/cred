import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function ClientAdminCol({ data, index }) {
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

	const location = useLocation();

	return (
		<>
			<tbody>
				<tr>
					<td className='text-center'>{index + 1}</td>

					<td>
						{data?.firstName} {data?.lastName}
					</td>
					<td>{data?.email}</td>
					<td>{formatDate(data?.last_login)}</td>
					<td>
						<span
							className={data.is_active ? 'txt_green fw500' : 'txt_red fw500'}
						>
							{data.is_active ? 'Active' : 'Inactive'}
						</span>
					</td>
					<td>
						<Link
							to={location.pathname + '/edit-admin-info/' + data?.email}
							className='text-edit'
						>
							{' '}
							<i className='fa fa-edit'></i>&nbsp;&nbsp;Edit
						</Link>
					</td>
				</tr>
			</tbody>
		</>
	);
}
