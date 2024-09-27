import type { Config } from 'tailwindcss';

export default {
	corePlugins: {
		preflight: false,
	},
	content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			screens: {
				laptop: '992px',
				mobile: '900px',
			},
			colors: {
				tahiti: {
					100: '#cffafe',
					200: '#a5f3fc',
					300: '#67e8f9',
					400: '#22d3ee',
					500: '#06b6d4',
					600: '#0891b2',
					700: '#0e7490',
					800: '#155e75',
					900: '#164e63',
				},
				credibledPurple: '#250c77',
				credibledOrange: '#ed642b',
				credibledGray: '#eeeeee',
				credibledGreen: '#96cb88',
				reportGreen: '#a0e085',
				reportLightGreen: '#d1f1c4',
			},
			borderWidth: {
				'1': '1px',
			},
		},
	},
	plugins: [],
	important: true,
} satisfies Config;
