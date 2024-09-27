import { Link, useLocation } from 'react-router-dom';

export default function FlagCol({ data, index }) {
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
					<td>{data?.name}</td>
					<td>{formatDate(data.updated_at)}</td>
					<td>
						<span
							className={
								data.everyone === false ? 'txt_red fw500' : 'txt_green fw500'
							}
						>
							{data.everyone === false
								? 'No One'
								: data.everyone === true
									? 'EveryOne'
									: 'User Specific'}
						</span>
					</td>
					<td>
						<Link
							to={location.pathname + '/edit-xmode/' + data.uuid}
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
