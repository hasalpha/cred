import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
	borderRadius: 2,
};

export default React.memo(function BasicModal({
	open,
	handleClose,
	children = null,
	className,
}: {
	open: boolean;
	handleClose: () => void;
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<Box
					sx={style}
					className={className}
				>
					<IconButton
						className='absolute right-4 top-2'
						color='secondary'
						onClick={handleClose}
					>
						<CloseIcon />
					</IconButton>
					{children}
				</Box>
			</Modal>
		</div>
	);
});
