import clsx from 'clsx';

export const CustomToolTip = ({
	content,
	className = '',
}: {
	content: string;
	className?: string;
}) => {
	return (
		<a
			tabIndex={-1}
			id='pop'
			className={clsx('a__relative', className)}
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
				<h3 className='popover-header'>{null}</h3>
				<div className='popover-body'>{content}</div>
			</div>
			<i className='material-icons icon_info text-secondary'>info</i>
		</a>
	);
};
