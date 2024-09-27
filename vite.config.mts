import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [
		react(),
		viteTsconfigPaths(),
		svgrPlugin(),
		sentryVitePlugin({
			org: 'credibled',
			project: 'credibled',
		}),
		nodePolyfills(),
	],
	build: {
		outDir: 'build',
		sourcemap: true,
	},
	server: {
		open: true,
		port: 3000,
	},
});
