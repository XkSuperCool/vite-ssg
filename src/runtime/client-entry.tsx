import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App, initPageData } from './App'
import { DataContext } from './hooks'

async function renderInBrowser() {
	const el = document.getElementById('root')

	if (!el) {
		throw new Error('#root element not found')
	}

	const pageData = await initPageData(location.pathname)
	createRoot(el).render(
		<DataContext.Provider value={pageData}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</DataContext.Provider>
	)
}

renderInBrowser()

