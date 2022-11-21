import react from '@vitejs/plugin-react'
import { createServer as createViteDevServe } from 'vite'
import { pluginIndexHtml } from './plugin-island/indexHtml'

export async function createDevServe(root: string) {
	return createViteDevServe({
		root,
		plugins: [pluginIndexHtml(), react()]
	})
}
