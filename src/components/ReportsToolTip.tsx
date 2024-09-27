import React from 'react';

export const ReportsToolTip = ({
	content,
	...props
}: {
	content: Array<any>;
	className: Array<any>;
}) => {
	return (
		<a
			id='pop'
			className='a__relative'
			href='/'
			onClick={e => e.preventDefault()}
			data-toggle='popover'
			data-content={content}
			data-original-title=''
			title=''
		>
			<div
				className='show popover fade bs-popover-top custom-popover'
				role='tooltip'
				id='popover'
			>
				{/* <div className="arrow"></div> */}
				{/* <h3 className='popover-header'>{null}</h3> */}
				<div className='popover-body'>
					<ol>
						{content.map((item, index) => {
							return (
								<li key={index}>
									<b>{item[0]}</b>: {item[1]}
								</li>
							);
						})}
					</ol>
				</div>
			</div>
			<i className='material-icons icon_info text-secondary'>info</i>
		</a>
	);
};
