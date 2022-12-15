import { useRoutes } from 'react-router-dom'
import { routes } from 'island:routes'

export function Context() {
	return useRoutes(routes)
}
