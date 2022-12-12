import fse from 'fs-extra'
import { resolve } from 'path'
import { loadConfigFromFile } from 'vite'
import type { UserConfig } from '../shared/types'

function getUserConfigPath(root: string) {
	try {
		const supportConfigFiles = ['island.config.js', 'island.config.ts']
		return supportConfigFiles
			.map(file => resolve(root, file))
			.find(fse.pathExistsSync)
	} catch(e) {
		console.error(`Failed to load user config: ${e}`)
		throw e
	}
}

export async function resolveConfig(
	root: string,
	command: 'serve' | 'build',
	mode: 'production' | 'development'
) {
	const configPath = getUserConfigPath(root)
	const result = await loadConfigFromFile({
		command,
		mode
	}, configPath, root)

	if (result) {
		const { config: rawConfig } = result
		const userConfig = rawConfig
		return [configPath, userConfig] as const
	} else {
		return [configPath, {} as UserConfig] as const
	}
}