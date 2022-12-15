declare module 'island:site-data' {
	import type { UserConfig } from 'shared/types'
	const config: UserConfig
	export default config
}

declare module 'island:routes' {
	import type { RouteObject } from 'react-router-dom'
	export const routes: RouteObject[]
}
