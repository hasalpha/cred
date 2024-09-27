import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react';

interface IOptionMenuProps {
	options: Array<string>;
	handleMenuSelect: (menuOption: IOptionMenuProps['options'][number]) => void;
}

const ITEM_HEIGHT = 48;

function OptionMenu({ options, handleMenuSelect }: IOptionMenuProps) {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
	};
	const handleClose = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		e.stopPropagation();
		const clickedOption = e.currentTarget.textContent;
		setAnchorEl(null);
		if (Boolean(clickedOption) && clickedOption != null)
			handleMenuSelect(clickedOption);
	};
	return (
		<Box>
			<IconButton
				aria-label='more options'
				id='long-button'
				aria-controls={open ? 'long-menu' : undefined}
				aria-expanded={open ? 'true' : undefined}
				aria-haspopup='true'
				onClick={handleClick}
				size='large'
			>
				<MoreVertIcon />
			</IconButton>
			<Menu
				id='long-menu'
				MenuListProps={{
					'aria-labelledby': 'long-button',
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				PaperProps={{
					style: {
						maxHeight: ITEM_HEIGHT * 4.5,
					},
				}}
			>
				{options.map((option, i) => (
					<MenuItem
						key={option + i}
						selected={option === 'Pyxis'}
						onClick={handleClose}
					>
						{option}
					</MenuItem>
				))}
			</Menu>
		</Box>
	);
}

export default OptionMenu;
