import { renderToString } from 'react-dom/server'
import { App, initPageData } from './App'
import { StaticRouter } from 'react-router-dom/server'
import { DataContext } from './hooks'

export interface RenderResult {
  appHtml: string;
  islandProps: unknown[];
  islandToPathMap: Record<string, string>;
}

export async function render(path: string): Promise<RenderResult> {
	const pageData = await initPageData(path)
	const { data,  clearIslandData } = await import('./jsx-runtime')
	clearIslandData()
	const appHtml = renderToString(
		<DataContext.Provider value={pageData}>
			<StaticRouter location={path}>
				<App />
			</StaticRouter>
		</DataContext.Provider>
	)
	const { islandProps, islandToPathMap } = data
	return {
		appHtml,
		islandProps,
		islandToPathMap
	}
}

export { routes } from 'island:routes'
