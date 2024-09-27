import createTheme from '@mui/material/styles/createTheme';
import { credibledColors } from './colors';
import orange from '@mui/material/colors/orange';

declare module '@mui/material/styles' {
	interface Theme {
		status: {
			danger: string;
		};
	}

	interface ThemeOptions {
		status?: {
			danger?: string;
		};
	}

	interface MuiCircularProgress {
		defaultProps: {
			color: any;
		};
	}
}

export const credibledTheme = createTheme({
	palette: {
		primary: {
			main: credibledColors.orange,
		},
		secondary: {
			main: credibledColors.purple,
		},
		info: {
			main: credibledColors.blue,
		},
	},
	status: {
		danger: orange[500],
	},
	typography: {
		h1: {
			fontSize: '3.3125rem',
		},
		h2: {
			fontSize: '2.25rem',
		},
		h5: {
			fontSize: '1.2rem',
		},
		body1: {
			fontSize: '.9rem',
			lineHeight: '1.2em',
			fontWeight: 300,
		},
		button: {
			textTransform: 'none',
			fontWeight: 400,
		},
	},
	components: {
		MuiFormLabel: {
			styleOverrides: {
				asterisk: { color: credibledColors.orange },
			},
		},
		MuiStepIcon: {
			styleOverrides: {
				root: {
					scale: '170%',
				},
			},
		},
	},
});
