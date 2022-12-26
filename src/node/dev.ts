import { createServer as createViteDevServe } from 'vite'
import { resolveConfig } from './config'
import { PACKAGE_ROOT } from './constants'
import { createVitePlugins } from './vitePlugins'

export async function createDevServe(root: string, restart: () => void) {
	const config = await resolveConfig(root, 'serve', 'development')
	return createViteDevServe({
		root,
		plugins: createVitePlugins(config, restart),
		server: {
			fs: {
				allow: [PACKAGE_ROOT]
			}
		}
	})
}
