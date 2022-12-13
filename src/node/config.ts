import fse from 'fs-extra'
import { resolve } from 'path'
import { loadConfigFromFile } from 'vite'
import type { UserConfig, SiteConfig } from 'shared/types'

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

export async function resolveUserConfig(
	root: string,
	command: 'serve' | 'build',
	mode: 'production' | 'development'
): Promise<readonly [string, UserConfig]> {
	const configPath = getUserConfigPath(root)
	const result = await loadConfigFromFile({
		command,
		mode
	}, configPath, root)

	if (result) {
		const { config } = result
		return [configPath, config as UserConfig] as const
	} else {
		return [configPath, {}] as const
	}
}

function resolveSiteData(config: UserConfig): UserConfig {
	return {
		title: config.title || 'Island.js',
		description: config.description || 'SSG Framework',
		themeConfig: config.themeConfig || {},
		vite: config.vite || {}
	}
}

export async function resolveConfig(...args: Parameters<typeof resolveUserConfig>): Promise<SiteConfig> {
	const [root] = args
	const [configPath, userConfig] = await resolveUserConfig(...args)
	return {
		root,
		configPath,
		siteData: resolveSiteData(userConfig)
	}
}

export function defineConfig(config: UserConfig): UserConfig {
	return config
}
