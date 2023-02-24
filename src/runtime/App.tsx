import { Layout } from '../theme-default'
import siteData from 'island:site-data'
import { matchRoutes } from 'react-router-dom'
import { routes } from 'island:routes'
import type { PageData } from 'shared/types'

export async function initPageData(routerPath: string): Promise<PageData> {
	const matched = matchRoutes(routes, routerPath)
	if (matched) {
		// 动态加载模块，从而获取模块暴露的数据
		const moduleInfo = await matched[0].route.preload()
		return {
			siteData,
			pageType: moduleInfo.frontmatter?.pageType ?? 'doc',
			frontMatter: moduleInfo.frontmatter,
			pagePath: routerPath
		}
	}
	return {
		siteData,
		pageType: '404',
		frontMatter: {},
		pagePath: routerPath
	}
}

export function App() {
	return (
		<div>
			<Layout />
		</div>
	)
}
