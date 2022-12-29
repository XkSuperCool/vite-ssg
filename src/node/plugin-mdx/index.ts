import type { Plugin } from 'vite'
import { pluginMdxRollup } from './pluginMdxRollup'

export async function createPluginMdx() {
	return [
		await pluginMdxRollup()
	]
}