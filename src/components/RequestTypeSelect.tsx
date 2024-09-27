/** @jsxImportSource @emotion/react */
import FormControl from '@mui/material/FormControl/FormControl';
import FormHelperText from '@mui/material/FormHelperText/FormHelperText';
import InputLabel from '@mui/material/InputLabel/InputLabel';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select/Select';
import React from 'react';
import { RequestType } from '../pages/user/NewRequest';
import { css } from '@emotion/react';
import { useTheme } from '@mui/material/styles';

function RequestTypeSelect({
	requestType,
	handleChange,
}: {
	requestType: RequestType;
	handleChange: (e: SelectChangeEvent) => void;
}) {
	const theme = useTheme();
	return (
		<FormControl
			fullWidth
			className='mt-10 lg:mt-0'
		>
			<InputLabel id='request-type-label'>Request Type</InputLabel>
			<Select
				labelId='request-type-label'
				id='request-type-select-helper'
				value={requestType}
				label='Request Type'
				onChange={handleChange}
			>
				<MenuItem value='reference-check'>Reference Check</MenuItem>
				<MenuItem value='background-check'>Background Check</MenuItem>
			</Select>
			<FormHelperText
				css={css`
					color: ${theme.palette.primary.main};
				`}
			>
				Select the type of request
			</FormHelperText>
		</FormControl>
	);
}

export default React.memo(RequestTypeSelect);
