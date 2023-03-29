import fg from 'fast-glob'
import * as path from 'path'
import { normalizePath } from 'vite'

interface RouterMeta {
	routerPath: string
	absolutePath: string
}

export class RouteService {
	#scanDir: string
	#routeData: RouterMeta[] = []

	constructor(scanDir: string) {
		this.#scanDir = scanDir
	}

	init() {
		const files = fg.sync(['**/*.{js,jsx,ts,tsx,md,mdx}'], {
			cwd: this.#scanDir,
			absolute: true,
			ignore: ['**/build/**', 'island.config.ts', '**/node_modules/**']
		}).sort()

		files.forEach((file) => {
			// 取得相对路径
			const fileRelativePath = normalizePath(path.relative(this.#scanDir, file))
			const routerPath = this.normailzeroutePath(fileRelativePath)
			this.#routeData.push({
				routerPath,
				absolutePath: file
			})
		})
	}

	generatorRouteCode(ssr: boolean) {
		const code = `
		import React from 'react'
		${ssr ? '' : "import loadable from '@loadable/component';"}
		${
			this.#routeData
				.map((route, index) => {
					return ssr
						? `import Route${index} from '${route.absolutePath}'`
						: `const Route${index} = loadable(() => import('${route.absolutePath}'))`
				})
				.join('\n')
		}
		
		export const routes = [
			${
				this.#routeData
					.map((route, index) => {
						return `{
							path: '${route.routerPath}',
							element: React.createElement(Route${index}),
							preload: () => import('${route.absolutePath}')
						}`
					})
					.join(',\n')
			}
		]
		`
		return code
	}

	getRouteMeta(): RouterMeta[] {
		return this.#routeData
	}

	normailzeroutePath(raw: string) {
		const routerPath = raw.replace(/\.(.*)?$/, '').replace(/index$/, '')
		return routerPath.startsWith('/') ? routerPath : `/${routerPath}`
	}
}