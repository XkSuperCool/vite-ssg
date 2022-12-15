import { cac } from 'cac'
import * as path from 'path'
import { resolveConfig } from './config'
import { build } from './build'

const version = require('../../package.json').version

const cli = cac('island').version(version).help()

cli
	.command('[root]', 'start dev server')
	.alias('dev')
	.action(async (root: string) => {
		root = root ? path.resolve(root) : process.cwd()
		const { createDevServe } = await import('./dev')
		async function createServer() {
			const server = await createDevServe(root, async () => {
				await server.close()
				await createServer()
			})
			await server.listen()
			server.printUrls()
		}

		await createServer()
	})

cli
	.command('build [root]', 'build for production')
	.action(async (root: string) => {
		try {
			root = path.resolve(root)
			const config = await resolveConfig(root, 'build', 'production')
			await build(root, config)
		} catch(e) {
			console.log(e)
		}
	})

cli.parse()
