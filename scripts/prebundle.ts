import path from 'path'
import fse from 'fs-extra'
import { build } from 'esbuild'
import resolve from 'resolve'
import { normalizePath } from 'vite'

const PRE_BUNDLE_DIR = 'vendors'

async function preBundle(deps: string[]) {
	const flattenDepMaps: Record<string, string> = {}
	deps.map((item) => {
		const flattenName = item.replace(/\//g, '_') // react/client -> react_client
		flattenDepMaps[flattenName] = item
	})

	const outputAbsolutePath = path.join(process.cwd(), PRE_BUNDLE_DIR)
	if (await fse.pathExists(outputAbsolutePath)) {
		await fse.remove(outputAbsolutePath)
	}

	await build({
		entryPoints: flattenDepMaps,
		outdir: PRE_BUNDLE_DIR,
		bundle: true,
		minify: true,
		splitting: true,
		format: 'esm',
		platform: 'browser',
		plugins: [
			{
				name: 'pre-bundle',
				setup(build) {
					build.onResolve({ filter: /^[\w@][^:]/ }, (args) => {
						if (!deps.includes(args.path)) {
							return
						}
						const isEntry = !args.importer
						const resolved = resolve.sync(args.path, {
							basedir: args.importer || process.cwd()
						})
						return isEntry ? { path: resolved, namespace: 'dep' } : { path: resolved }
					})

					build.onLoad({ filter: /.*/, namespace: 'dep' }, async (args) => {
						const entryPath = normalizePath(args.path)
						const res = require(entryPath)
						// 拿出所有的具名导出
						const specifiers = Object.keys(res)
						// 导出 ESM 格式的入口代码
						return {
							contents: `export { ${specifiers.join(
								','
							)} } from "${entryPath}"; export default require("${entryPath}")`,
							loader: 'js',
							resolveDir: process.cwd()
						}
					})
				}
			}
		]
	})
}

preBundle(['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'])
