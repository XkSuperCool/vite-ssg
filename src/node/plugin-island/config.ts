import { join } from 'path'
import { PACKAGE_ROOT } from 'node/constants'
import type { SiteConfig } from 'shared/types'
import type { Plugin } from 'vite'

const SITE_DATA_ID = 'island:site-data'

export function pluginConfig(config: SiteConfig, restart?: () => void): Plugin {
	return {
		name: 'island:config',
		config() {
			return {
				resolve: {
					alias: {
						'@runtime': join(PACKAGE_ROOT, 'src', 'runtime', 'index.ts')
					}
				},
				css: {
					modules: {
						localsConvention: 'camelCaseOnly'
					}
				}
			}
		},
		resolveId(id) {
			if (id === SITE_DATA_ID) {
				return '\0' + SITE_DATA_ID
			}
		},
		load(id) {
			if (id === '\0' + SITE_DATA_ID) {
				return `export default ${JSON.stringify(config.siteData)}`
			}
		},
		handleHotUpdate(ctx) {
			const customWatchedFiles = [config.configPath]
			const isRestart = customWatchedFiles.some((path) => path === ctx.file)
			if (isRestart) {
				restart()
			}
		}
	}
}
