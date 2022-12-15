import path from 'path'
import { RouteService } from '../RouteService'
import { describe, expect, it } from 'vitest'

describe('测试 RouterService', () => {
	const root = path.join(__dirname, 'fixtures')
	const routeService = new RouteService(root)
	routeService.init()

	it('测试路径扫描信息是否正确', () => {
		const files = routeService.getRouteMeta().map((item) => ({
			...item,
			absolutePath: item.absolutePath.replace(root, 'TEST_PATH')
		}))
		expect(files).toMatchInlineSnapshot(`
			[
			  {
			    "absolutePath": "TEST_PATH/a/index.ts",
			    "routerPath": "/a/",
			  },
			  {
			    "absolutePath": "TEST_PATH/index.ts",
			    "routerPath": "/",
			  },
			]
		`)
	})

	it('测试生成的 RoutesCode 是否正常', () => {
		const code = routeService.generatorRouteCode()

		expect(code).toMatchInlineSnapshot(`
			"
					import React from 'react'
					import Route0 from '/Users/liukai/Desktop/vite-ssg/src/node/plugin-routes/__test__/fixtures/a/index.ts'
			import Route1 from '/Users/liukai/Desktop/vite-ssg/src/node/plugin-routes/__test__/fixtures/index.ts'
					
					export const routes = [
						{ path: '/a/', element: React.createElement(Route0)},
			{ path: '/', element: React.createElement(Route1)}
					]
					"
		`)
	})
})
