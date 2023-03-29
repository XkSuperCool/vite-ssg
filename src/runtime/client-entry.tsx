import type { ComponentType } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App, initPageData } from './App'
import { DataContext } from './hooks'

declare global {
  interface Window {
    ISLANDS: Record<string, ComponentType<unknown>>;
    ISLAND_PROPS: unknown[];
  }
}

async function renderInBrowser() {
	const el = document.getElementById('root')

	if (!el) {
		throw new Error('#root element not found')
	}

	// @ts-ignore
	if (import.meta.env.DEV) {
		const pageData = await initPageData(location.pathname)
	
		createRoot(el).render(
			<DataContext.Provider value={pageData}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</DataContext.Provider>
		)
	} else {
		const islands = document.querySelectorAll('[__island]')
		if (islands.length === 0) {
			return
		}
		for (const island of islands) {
			const [id, index] = island.getAttribute('__island').split(':')
			// 获取组件代码
			const Element = window.ISLANDS[id] as ComponentType<unknown>
			// 注水
			hydrateRoot(island, <Element {...window.ISLAND_PROPS[index]} />)
		}
	}
}

renderInBrowser()

