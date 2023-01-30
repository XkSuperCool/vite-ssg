import type { VitePluginConfig } from 'unocss/vite'
import { presetAttributify, presetIcons, presetWind } from 'unocss'

const options: VitePluginConfig = {
	presets: [
		presetWind(),
		presetIcons(),
		presetAttributify()
	]
}

export default options
