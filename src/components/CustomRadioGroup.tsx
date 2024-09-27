import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const PREFIX = 'CustomRadioGroup';

const classes = {
	root: `${PREFIX}-root`,
	checked: `${PREFIX}-checked`,
};

const StyledFormControl = styled(FormControl)({
	[`& .${classes.root}`]: {
		color: grey[500],
		'&$checked': {
			color: '#ed642b',
		},
	},
	[`& .${classes.checked}`]: {},
});

const GreenRadio = (props: any) => (
	<Radio
		color='primary'
		{...props}
	/>
);

export default function CustomRadioGroup({ value, handleChange }: any) {
	return (
		<StyledFormControl sx={{ mt: 3 }}>
			<FormLabel
				id='QuestionType'
				sx={{ color: '#ed642b', '&.Mui-focused': { color: '#ed642b' } }}
			>
				Question Type
			</FormLabel>
			<RadioGroup
				aria-labelledby='QuestionType'
				name='question-type-radio-group'
				value={value}
				onChange={handleChange}
				row
			>
				<FormControlLabel
					value={'0'}
					control={
						<GreenRadio
							classes={{
								root: classes.root,
								checked: classes.checked,
							}}
						/>
					}
					label='Text'
					sx={{ color: 'black' }}
				/>
				<FormControlLabel
					value={'1'}
					control={
						<GreenRadio
							classes={{
								root: classes.root,
								checked: classes.checked,
							}}
						/>
					}
					label='Rating'
					sx={{ color: 'black' }}
				/>
			</RadioGroup>
		</StyledFormControl>
	);
}
