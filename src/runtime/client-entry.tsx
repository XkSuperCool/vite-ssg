import { createRoot } from 'react-dom/client'
import { App } from './App'

function renderInBrowser() {
	const el = document.getElementById('root')

	if (!el) {
		throw new Error('#root element not found')
	}

	createRoot(el).render(<App />)
}

renderInBrowser()

