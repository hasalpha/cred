import { useState } from 'react';

const LeadGenHire = () => {
	const [position, setPosition] = useState('');
	const [noOfPositions, setNoOfPositions] = useState('');
	const [location, setLocation] = useState('');

	const HandlePosition = e => {
		setPosition(e.target.value);
	};

	const HandleNoOfPositions = e => {
		setNoOfPositions(e.target.value);
	};

	const HandleLocation = e => {
		setLocation(e.target.value);
	};

	const HandleSubmit = e => {
		e.preventDefault();
	};

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
						No Of Positions: <br />
						<input
							type='text'
							name={noOfPositions}
							onChange={HandleNoOfPositions}
						/>
					</label>
					<label>
						Location: <br />
						<input
							type='text'
							name={location}
							onChange={HandleLocation}
						/>
					</label>
					<label>
						<input
							type='submit'
							value='Submit'
							className='lead-hire-button'
						/>
					</label>
				</form>
			</div>
		</>
	);
};

export default LeadGenHire;
