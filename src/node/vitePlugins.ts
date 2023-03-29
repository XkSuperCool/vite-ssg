import react from '@vitejs/plugin-react'
import type { SiteConfig } from "shared/types";
import { pluginIndexHtml } from './plugin-island/indexHtml'
import { pluginConfig } from './plugin-island/config'
import { pluginRoutes } from './plugin-routes'
import { createPluginMdx } from './plugin-mdx'
import pluginUnocss from 'unocss/vite'
import unocssOptions from './unocssOptions'
import { PACKAGE_ROOT } from './constants'
import * as path from 'path'
import babelPluginIsland from './babel-plugin-island';

export async function createVitePlugins(config: SiteConfig, restart?: () => void, ssr = false) {
	return [
		pluginUnocss(unocssOptions),
		pluginIndexHtml(),
		react({
			/**
			 * automatic: 会使用 react/jsx-runtime 创建组件, 性能更好
			 * classic: 则使用 React.createElement 创建组件
			 */
			jsxRuntime: 'automatic',
			jsxImportSource: ssr ? path.join(PACKAGE_ROOT, 'src', 'runtime') : 'react',
			babel: {
				plugins: [babelPluginIsland]
			}
		}),
		pluginConfig(config, restart),
		pluginRoutes({ root: config.root, ssr }),
		await createPluginMdx(),
	]
}