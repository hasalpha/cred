import { styled } from '@mui/material';
import Slider from '@mui/material/Slider';
import clsx from 'clsx';
import React from 'react';

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
		// border: "2px solid currentColor",
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

const PreviewSlider = React.memo(
	({ classNames = [] }: { classNames: Array<unknown> }) => (
		<>
			<h6 className='pt1 ml1'>
				1-<span> Poor</span>&nbsp; 2-
				<span> Average</span>&nbsp; 3-
				<span> Fair</span> &nbsp; 4-
				<span> Good </span> &nbsp; 5-
				<span> Excellent</span>{' '}
			</h6>
			<span
				className='notes'
				style={{
					display: `none`,
					textAlign: 'center',
				}}
			>
				Ratings are Required
				<input
					id='ratingRequired'
					style={{
						opacity: '0',
						width: '0',
					}}
				/>
			</span>
			<div className='col-md-12'>
				<div className='range-slider position-relative mb-3'>
					<span
						className='range-slider__value'
						style={{ marginRight: '20px' }}
					>
						{0}
					</span>
					<PrettoSlider
						sx={{ width: '89% !important' }}
						className={clsx(['slider-value', ...classNames])}
						valueLabelDisplay='auto'
						aria-label='pretto slider'
						step={1}
						marks
						min={0}
						max={5}
						value={0}
						defaultValue={0}
					/>
				</div>
				<div className='form-group bmd-form-group mt-0'>
					<input
						readOnly
						placeholder='Your comments:'
						maxLength={200}
						className='form-control'
					></input>
				</div>
			</div>
		</>
	)
);
export default PreviewSlider;
