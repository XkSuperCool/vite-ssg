import type { Plugin } from 'vite'
import { RouteService } from './RouteService';

interface PluginOptios {
	root: string,
	ssr: boolean
}

const CONVENTIONAL_ROUTE_ID = 'island:routes';

export function pluginRoutes(options: PluginOptios): Plugin {
	const routeService = new RouteService(options.root)
	return {
		name: 'islnad:routes',
		configResolved() {
			routeService.init()
		},
		resolveId(id) {
			if (id === CONVENTIONAL_ROUTE_ID) {
				return '\0' + CONVENTIONAL_ROUTE_ID
			}
		},
		load(id) {
			if (id === '\0' + CONVENTIONAL_ROUTE_ID) {
				return routeService.generatorRouteCode(options.ssr)
			}
		}
	}
}