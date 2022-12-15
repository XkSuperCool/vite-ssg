import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'

function renderInBrowser() {
	const el = document.getElementById('root')

	if (!el) {
		throw new Error('#root element not found')
	}

	createRoot(el).render(
		<BrowserRouter>
			<App />
		</BrowserRouter>
	)
}

renderInBrowser()

