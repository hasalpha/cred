import { darken, lighten, styled } from '@mui/material';

export const GroupHeader = styled('div')(({ theme }) => ({
	position: 'sticky',
	top: '-8px',
	padding: '4px 10px',
	color: theme.palette.primary.light,
	backgroundColor:
		theme.palette.mode === 'light'
			? lighten(theme.palette.primary.light, 0.85)
			: darken(theme.palette.primary.main, 0.8),
}));

export const GroupItems = styled('ul')({
	padding: 0,
});
