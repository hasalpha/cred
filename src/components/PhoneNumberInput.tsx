import { MuiTelInput, MuiTelInputCountry } from 'mui-tel-input';
import { useMemo } from 'react';
import { AcceptedCountries, countries, countryCodeMapping } from '../Common';

const styles = {
	'& label.Mui-focused': {
		color: '#aaaaaa',
	},
	'& .MuiInput-underline:after': {
		borderBottomColor: '#2a2872',
	},
	'& .MuiInput-underline:before': {
		borderBottomColor: 'lightgray',
	},
	'& .MuiInput-underline:before:hover': {
		borderBottomColor: 'lightgray',
	},
	'& .MuiInput-root:hover:not(.Mui-disabled, .Mui-error):before': {
		borderBottomColor: 'lightgray',
	},
	marginBottom: '.5em',
};

const PhoneInput = ({
	phoneNumber,
	handlePhoneNumberChange,
	isFullWidth = true,
	defaultCountry = 'Canada',
	...rest
}: {
	phoneNumber: string | undefined;
	handlePhoneNumberChange: (e?: any) => void;
	isFullWidth?: boolean;
	defaultCountry?: AcceptedCountries;
	tabIndex?: number;
}) => {
	const defaultCountryCode = useMemo(() => {
		let countryCode = countryCodeMapping[defaultCountry];
		if (!countryCode) {
			const country = countries.find(v =>
				v.toLowerCase().includes(defaultCountry.toLowerCase())
			) as AcceptedCountries;
			const newCountry = countryCodeMapping[country];
			if (newCountry) countryCode = newCountry;
		}
		Object.keys(countryCodeMapping).find(value =>
			value.toLowerCase().includes(defaultCountry.toLowerCase())
		);
		return countryCode ?? 'US';
	}, [defaultCountry]) as MuiTelInputCountry;

	return (
		<MuiTelInput
			id='phone-field'
			className='relative bottom-3'
			name='phone'
			value={phoneNumber}
			onChange={handlePhoneNumberChange}
			preferredCountries={['CA', 'US']}
			defaultCountry={defaultCountryCode}
			variant='standard'
			label='Phone Number'
			sx={styles}
			fullWidth={isFullWidth}
			{...rest}
			required
			InputLabelProps={{
				sx: { color: '#aaaaaa', fontSize: '14px', fontWeight: 400 },
			}}
			inputProps={{
				onClick(e) {
					e.currentTarget.select();
				},
			}}
		/>
	);
};

export default PhoneInput;
