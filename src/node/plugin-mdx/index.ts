import type { Plugin } from 'vite'
import { pluginMdxRollup } from './pluginMdxRollup'

export function createPluginMdx() {
	return [
		pluginMdxRollup()
	]
}