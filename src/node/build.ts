import * as path from 'path'
import fse from 'fs-extra'
import { build as viteBuild } from 'vite'
import type { InlineConfig } from 'vite'
import { CLIENT_ENTRY_PATH, MASK_SPLITTER, PACKAGE_ROOT, SERVER_ENTRY_PATH } from './constants'
import type { RollupOutput } from 'rollup'
import type { SiteConfig } from 'shared/types'
import { createVitePlugins } from './vitePlugins'
import { RouteObject } from 'react-router-dom'
import type { RenderResult } from 'runtime/ssr-entry'

export async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = async (isServerBuild: boolean): Promise<InlineConfig> => {
    return {
      root,
      mode: 'production',
      plugins: await createVitePlugins(config, undefined, true),
      ssr: {
        noExternal: ['react-router-dom']
      },
      build: {
        ssr: isServerBuild,
        outDir: path.join(root, isServerBuild ? '.temp' : 'build'),
        rollupOptions: {
          input: isServerBuild ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
          output: {
            format: isServerBuild ? 'cjs' : 'esm'
          },
          external: EXTERNALS
        }
      }
    }
  }

  const clientBuild = async () => {
    return viteBuild(await resolveViteConfig(false))
  }

  const serverbuild = async () => {
    return viteBuild(await resolveViteConfig(true))
  }
  
  const res =  (await Promise.all([clientBuild(), serverbuild()])) as [
    RollupOutput,
    RollupOutput
  ]

  const publicDir = path.join(root, 'public')
  if (fse.pathExistsSync(publicDir)) {
    await fse.copy(publicDir, path.join(root, 'build'))
  }
  await fse.copy(path.join(PACKAGE_ROOT, 'vendors'), path.join(root, 'build'))

  return res
}

export async function build(root: string, config: SiteConfig) {
  const [clientBundle] = await bundle(root, config)
  const serverEnterPath = path.join(root, '.temp', 'ssr-entry.js')
  const { render, routes } = await import(serverEnterPath)
  await renderPage(render, routes, root, clientBundle)
}

async function buildIslands(root: string, islandToPathMap: RenderResult['islandToPathMap']) {
  // island-props.textContent 获取的是 <script> 标签中的数据
  // 它里面存着 Hydration 组件的 props
  const islandInjectCode = `
    ${Object.entries(islandToPathMap).map(([islandName, islandPath]) => {
      return `import { ${islandName} } from '${islandPath}'`
    }).join('')}

    window.ISLANDS = { ${Object.keys(islandToPathMap).join(', ')} }
    window.ISLAND_PROPS = JSON.parse(
      document.getElementById('island-props').textContent
    )
  `

  const injectId = 'island:inject'
  return viteBuild({
    mode: 'production',
    build: {
      outDir: path.join(root, '.temp'),
      rollupOptions: {
        input: injectId,
        external: EXTERNALS
      },
    },
    esbuild: {
      jsx: 'automatic'
    },
    plugins: [
      {
        name: 'island:inject',
        enforce: 'post',
        resolveId(id) {
          if (id.includes(MASK_SPLITTER)) {
            const [originId, importer] = id.split(MASK_SPLITTER)
            return this.resolve(originId, importer, { skipSelf: true })
          }

          if (id === injectId) {
            return id
          }
        },
        load(id) {
          if (id === injectId) {
            return islandInjectCode
          }
        },
        generateBundle(_, bundle) {
          // Hydration 代码不需要静态资源，只要JS代码即可
          for (const name in bundle) {
            if (bundle[name].type === 'asset') {
              delete bundle[name]
            }
          }
        }
      }
    ]
  })
}

const normalizeVendorFilename = (fileName: string) =>
  fileName.replace(/\//g, '_') + '.js'

const EXTERNALS = ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime']

async function renderPage(
  render: (path: string) => Promise<RenderResult>,
  routes: RouteObject[],
  root: string,
  clientBundle: RollupOutput
) {
  const clientChunk = clientBundle.output.find((item) => item.type === 'chunk' && item.isEntry)
  const styleAssets = clientBundle.output.filter((item) => item.type === 'asset' && item.fileName.endsWith('.css'))
  const dir = path.join(root, 'build')
  await Promise.all(routes.map(async (route) => {
    const routePath = route.path
    let { appHtml, islandToPathMap, islandProps } = await render(routePath)
    const islandBundle = await buildIslands(root, islandToPathMap)
    const islandCode = (islandBundle as RollupOutput).output[0].code
    appHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      ${styleAssets.map((item) => `<link rel="stylesheet" href="/${item.fileName}" />`).join('\n')}
      <script type="importmap">
        {
          "imports": {
            ${EXTERNALS.map(
              (name) => `"${name}": "/${normalizeVendorFilename(name)}"`
            ).join(',')}
          }
        }
      </script>
    </head>
    <body>
      <div id="root">${appHtml}</div>
      <script type="module">${islandCode}</script>
      <script type="module" src="${clientChunk.fileName}"></script>
      <script id="island-props">${JSON.stringify(islandProps)}</script>
    </body>
    </html>
    `
    const fileName = routePath.endsWith('/') ? `${routePath}index.html` : `${routePath}.html`
    await fse.ensureDir(path.join(dir, path.dirname(fileName)))
    await fse.writeFile(path.join(dir, fileName), appHtml)
  }))
  await fse.remove(path.join(root, '.temp'))
}
