import react from '@vitejs/plugin-react'
import { createServer as createViteDevServe } from 'vite'
import { resolveConfig } from './config'
import { PACKAGE_ROOT } from './constants'
import { pluginIndexHtml } from './plugin-island/indexHtml'
import { pluginConfig } from './plugin-island/config'
import { pluginRoutes } from './plugin-routes'

export async function createDevServe(root: string, restart: () => void) {
	const config = await resolveConfig(root, 'serve', 'development')
	return createViteDevServe({
		root,
		plugins: [
			pluginIndexHtml(),
			react(),
			pluginConfig(config, restart),
			pluginRoutes({ root })
		],
		server: {
			fs: {
				allow: [PACKAGE_ROOT]
			}
		}
	})
}
