import Slider from '@mui/material/Slider/Slider';
import styled from '@mui/material/styles/styled';

export const PrettoSlider = styled(Slider)({
	root: {
		color: '#250c77',
		height: 8,
		width: '80%',
		position: 'absolute',
	},
	thumb: {
		height: 24,
		width: 24,
		backgroundColor: '#ef7441',
		'&:focus, &:hover, &$active': {
			boxShadow: 'inherit',
		},
	},
	active: {},
	valueLabel: {
		left: 'calc(-50% + 4px)',
	},
	track: {
		height: 8,
		borderRadius: 4,
	},
	rail: {
		height: 8,
		borderRadius: 4,
	},
});

export default PrettoSlider;
