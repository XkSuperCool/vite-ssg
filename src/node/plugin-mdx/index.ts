import type { Plugin } from 'vite'
import { pluginMdxHMR } from './pluginMdxHmr'
import { pluginMdxRollup } from './pluginMdxRollup'

export async function createPluginMdx() {
	return [
		await pluginMdxRollup(),
		pluginMdxHMR()
	]
}