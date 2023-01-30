import react from '@vitejs/plugin-react'
import type { SiteConfig } from "shared/types";
import { pluginIndexHtml } from './plugin-island/indexHtml'
import { pluginConfig } from './plugin-island/config'
import { pluginRoutes } from './plugin-routes'
import { createPluginMdx } from './plugin-mdx'
import pluginUnocss from 'unocss/vite'
import unocssOptions from './unocssOptions'

export async function createVitePlugins(config: SiteConfig, restart?: () => void, ssr = false) {
	return [
		pluginUnocss(unocssOptions),
		pluginIndexHtml(),
		react(),
		pluginConfig(config, restart),
		pluginRoutes({ root: config.root, ssr }),
		await createPluginMdx(),
	]
}