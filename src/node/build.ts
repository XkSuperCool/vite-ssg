import * as path from 'path'
import fse from 'fs-extra'
import { build as viteBuild } from 'vite'
import type { InlineConfig } from 'vite'
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants'
import type { RollupOutput } from 'rollup'
import react from '@vitejs/plugin-react'

export async function bundle(root: string) {
  const resolveViteConfig = (isServerBuild: boolean): InlineConfig => {
    return {
      root,
      mode: 'production',
      plugins: [react()],
      build: {
        ssr: isServerBuild,
        outDir: isServerBuild ? '.temp' : 'build',
        rollupOptions: {
          input: isServerBuild ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
          output: {
            format: isServerBuild ? 'cjs' : 'esm'
          }
        }
      }
    }
  }

  const clientBuild = () => {
    return viteBuild(resolveViteConfig(false))
  }

  const serverbuild = () => {
    return viteBuild(resolveViteConfig(true))
  }
  
  return (await Promise.all([clientBuild(), serverbuild()])) as [
    RollupOutput,
    RollupOutput
  ]
}

export async function build(root: string) {
  const [clientBundle] = await bundle(root)
  const serverEnterPath = path.join(root, '.temp', 'ssr-entry.js')
  const { render } = await import(serverEnterPath)
  await renderPage(render, root, clientBundle)
}

async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  let appHtml = render()
  // 注水
  const clientChunk = clientBundle.output.find((item) => item.type === 'chunk' && item.isEntry)
  
  appHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="${clientChunk.fileName}"></script>
  </body>
  </html>
  `
  const dir = path.join(root, 'build')
  await fse.ensureDir(dir)
  await fse.writeFile(path.join(dir, 'index.html'), appHtml)
  await fse.remove(path.join(root, '.temp'))
}
