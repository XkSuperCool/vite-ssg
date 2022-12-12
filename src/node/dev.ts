import react from '@vitejs/plugin-react'
import { createServer as createViteDevServe } from 'vite'
import { resolveConfig } from './config'
import { PACKAGE_ROOT } from './constants'
import { pluginIndexHtml } from './plugin-island/indexHtml'

export async function createDevServe(root: string) {
	const config = await resolveConfig(root, 'serve', 'development')
	return createViteDevServe({
		root,
		plugins: [pluginIndexHtml(), react()],
		server: {
			fs: {
				allow: [PACKAGE_ROOT]
			}
		}
	})
}
