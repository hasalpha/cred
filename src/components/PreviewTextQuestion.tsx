import React from 'react';
const PreviewTextQuestion = React.memo(() => (
	<div className='form-group bmd-form-group mt-0'>
		<input
			maxLength={200}
			className='form-control'
			readOnly
			placeholder='Your comments:'
		></input>
	</div>
));

export default PreviewTextQuestion;
