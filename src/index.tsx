import './apis/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './contexts';
import { RouterProvider } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';

//IMPORTANT: DO NOT CHANGE CSS ORDER. IT WILL CAUSE CASCADING
import './tailwind-import.css';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import './assets/css/material-credibled.css';
import './assets/css/custom_credibled.css';
import './components/RefSum.css';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline/CssBaseline';
import { credibledTheme } from './utils/theme';
import { credibledRouter } from './contexts/RouterContext';
import * as Sentry from '@sentry/react';
import { enableMapSet, enablePatches } from 'immer';
enablePatches();
enableMapSet();

Sentry.init({
	dsn: 'https://d9175f1810e291c1b85e2b0cd8eac001@o4506394490241024.ingest.sentry.io/4506422757425152',
	integrations: [Sentry.browserTracingIntegration()],
	tracesSampleRate: 1.0,
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,
	enabled: process.env.NODE_ENV !== 'development',
});

export const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	year: 'numeric',
});

export const credibledQueryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
	<QueryClientProvider client={credibledQueryClient}>
		<CssBaseline />
		<CookiesProvider>
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={credibledTheme}>
					<AuthProvider>
						<RouterProvider router={credibledRouter} />
					</AuthProvider>
				</ThemeProvider>
			</StyledEngineProvider>
		</CookiesProvider>
		<ToastContainer
			theme='colored'
			closeOnClick
			closeButton
		/>
	</QueryClientProvider>
);
