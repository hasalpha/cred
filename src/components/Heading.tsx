import React from 'react';

interface IHeadingProps {
	heading: string;
}

function Heading({ heading }: IHeadingProps) {
	return (
		<div className='card-plain'>
			<div className='card-body'>
				<div className='row'>
					<div className='col-md-12'>
						<div className='card-plain bb10'>
							<div className='row'>
								<div className='col-md-4'>
									<h3 className='my-0'>{heading}</h3>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default React.memo(Heading);
