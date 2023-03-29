import * as jsxRuntime from 'react/jsx-runtime'

const originJsx = jsxRuntime.jsx
const originJsxs = jsxRuntime.jsxs

export const data = {
	islandProps: [],
	islandToPathMap: {}
}

export const clearIslandData = () => {
	data.islandProps = []
	data.islandToPathMap = {}
}

const internalJsx = (jsx, type, props, ...args) => {
	if (props && props.__island) {
		data.islandProps.push(props)
		const id = type.name // 组件名称 <Aside __island /> --> Aside
		data['islandToPathMap'][id] = props.__island
		Reflect.deleteProperty(props, '__island')
		return jsx('div', {
			// data.islandProps.length - 1, 为当前组件的 props 存放的位置 (index)
			// 使用这个 index 就可以取出当前组件所对应的 props
			__island: `${id}:${data.islandProps.length - 1}`,
			children: jsx(type, props, ...args)
		})
	}

	return jsx(type, props, ...args)
}

export const jsx = (...args) => internalJsx(originJsx, ...args)
export const jsxs = (...args) => internalJsx(originJsxs, ...args)
export const Fragment = jsxRuntime.Fragment
 