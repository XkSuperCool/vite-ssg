import { renderToString } from 'react-dom/server'
import { App } from './App'
import { StaticRouter } from 'react-router-dom/server'

export function render(path: string) {
	return renderToString(
		<StaticRouter location={path}>
			<App />
		</StaticRouter>
	)
}

export { routes } from 'island:routes'
