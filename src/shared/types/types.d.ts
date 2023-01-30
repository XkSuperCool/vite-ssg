declare module 'island:site-data' {
	import type { UserConfig } from 'shared/types'
	const config: UserConfig
	export default config
}

declare module 'island:routes' {
	import type { RouteObject } from 'react-router-dom'
	import type { PageModule } from 'shared/types'

	export const routes: (RouteObject & {
		preload: () => Promise<PageModule>
	})[]
}
