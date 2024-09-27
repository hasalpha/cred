import { TextField, styled } from '@mui/material';

export const CommentField = styled(TextField)(({ theme }) => ({
	'& .MuiFilledInput-input': { backgroundColor: '#fff' },
	'& .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused:after': {
		borderColor: (theme as any)?.palette?.secondary?.main,
	},
	'& label.Mui-focused': {
		color: '#402693',
	},
	'& label.Mui-error': {
		color: 'red',
	},
	'& .MuiOutlinedInput-root': {
		'& fieldset': {
			borderColor: '#402693',
		},
		'&.Mui-focused fieldset': {
			borderColor: '#402693',
		},
		'&.Mui-error.Mui-focused fieldset': {
			borderColor: 'red',
		},
	},
}));
