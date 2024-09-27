import React from 'react';
import styled from '@mui/material/styles/styled';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment/InputAdornment';
import { Cancel, CheckCircle } from '@mui/icons-material';

const someCss = {
	root: {
		border: '1px solid #ed642b',
		overflow: 'hidden',
		borderRadius: 5,
		backgroundColor: '#ffffff',
		'&:hover': {
			backgroundColor: '#fff',
		},
		'&$focused': {
			backgroundColor: '#fff',
			boxShadow: `0 2px 4px 0 rgba(176, 73, 149, 0.21)`,
			borderColor: 'lightgreen',
		},
		'&.Mui-error': {
			borderColor: 'red',
		},
	},
};

const CustomizedTextField = styled(TextField)({
	root: {
		fontFamily: 'Roboto',
		'& .MuiFormLabel-root': {
			color: '#ed642b',
			fontSize: 16,
			fontFamily: 'Roboto',
			top: -5,
		},
		'& .MuiFormLabel-root.Mui-error': {
			color: 'grey',
		},
		'& input': {
			color: '#250c77',
			fontSize: 16,
			fontWeight: 400,
			padding: '26px 12px 0',
			transition: 'padding 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
		},
		'& .MuiFormLabel-filled + .MuiInputBase-root input': {
			padding: '35px 12px 14px',
		},
		'& .Mui-focused input': {
			padding: '35px 12px 14px',
		},
		'& .Mui-focused.MuiFormLabel-root': {
			color: 'darkgreen',
		},
		'& .Mui-focused.MuiFormLabel-root.Mui-error': {
			color: 'red',
		},
		'& .MuiFormHelperText-root.Mui-error': {
			color: 'red',
			fontSize: 12,
			fontWeight: 500,
		},
	},
});

function StyledTextField({ text, setText, ...rest }: any) {
	function handleSetText(e: any) {
		const { value } = e?.target;
		setText(
			value?.trim?.()?.length === 0 && value?.at?.(-1) === ' '
				? value?.trim?.()
				: value
		);
	}
	return (
		<CustomizedTextField
			InputProps={{
				sx: someCss,
				disableUnderline: true,
				endAdornment: (
					<InputAdornment position='end'>
						<Icon
							aria-label='validity check'
							sx={{ paddingRight: '25px', paddingBottom: '25px' }}
						>
							{text.length > 0 ? (
								<CheckCircle className='custom-green' />
							) : (
								<Cancel color='error' />
							)}
						</Icon>
					</InputAdornment>
				),
			}}
			{...rest}
			value={text}
			onChange={handleSetText}
		/>
	);
}

const CustomTextField = ({
	label,
	input,
	meta: { touched, invalid, error },
	...custom
}: any) => (
	<StyledTextField
		variant='filled'
		fullWidth={true}
		label={label}
		error={touched && invalid}
		helperText={touched && invalid && error}
		{...input}
		{...custom}
	/>
);

export default CustomTextField;
