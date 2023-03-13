import type { Plugin } from 'vite'
import assert from 'assert'

export function pluginMdxHMR(): Plugin {
	let viteReactPlugin: Plugin
	return {
		name: 'vite-plugin-mdx-hmr',
		apply: 'serve',
		configResolved(config) {
			viteReactPlugin = config.plugins.find((plugin) => plugin.name === 'vite:react-babel')
		},
		async transform(code, id, opts) {
			if (/\.mdx?$/.test(id)) {
				assert(typeof viteReactPlugin.transform === 'function')
				// + ?.jsx, 不能处理 .mdx 所以改为 .jsx
				const result = await viteReactPlugin.transform?.call(this, code, id + '?.jsx', opts)
				if (result && typeof result === 'object' && !result.code.includes('import.meta.hot.accept(')) {
					result.code += 'import.meta.hot.accept()'
				}
				return result
			}
		},
		handleHotUpdate(ctx) {
			if (/\.mdx?/.test(ctx.file)) {
				ctx.server.ws.send({
					type: 'custom',
					event: 'mdx-changed',
					data: {
						filePath: ctx.file
					}
				})
			}
		}
	}
}