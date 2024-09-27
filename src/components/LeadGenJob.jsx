import { useState } from 'react';
import LeadGenHire from './LeadGenHire';

const LeadGenJob = ({ conditionalLoading }) => {
	const [position, setPosition] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const HandlePosition = e => {
		setPosition(e.target.value);
	};
	const HandleEmail = e => {
		setEmail(e.target.value);
	};
	const HandlePhone = e => {
		setPhone(e.target.value);
	};
	const HandleSubmit = e => {
		e.preventDefault();
	};
	if (conditionalLoading == true)
		return (
			<>
				<div className='row looking-for-job'>
					<form onSubmit={HandleSubmit}>
						<label>
							Position: <br />
							<input
								type='text'
								name={position}
								onChange={HandlePosition}
							/>
						</label>
						<label>
							Email: <br />
							<input
								type='text'
								name={email}
								onChange={HandleEmail}
							/>
						</label>
						<label>
							Phone Number: <br />
							<input
								type='text'
								name={phone}
								onChange={HandlePhone}
							/>
						</label>
						<label>
							<button
								type='submit'
								value='Submit'
							>
								Submit
							</button>
						</label>
					</form>
				</div>
			</>
		);
	else return <LeadGenHire />;
};

export default LeadGenJob;
