import { cac } from 'cac'
import path = require('path')
import { createDevServe } from './dev'

const version = require('../../package.json').version

const cli = cac('island').version(version).help()

cli
	.command('[root]', 'start dev server')
	.alias('dev')
	.action(async (root: string) => {
		root = root ? path.resolve(root) : process.cwd()
		const server = await createDevServe(root)
		await server.listen(3000)
		server.printUrls()
	})

cli
	.command('build [root]', 'build for production')
	.action(async (root: string) => {
		console.log('build', root)
	})

cli.parse()
