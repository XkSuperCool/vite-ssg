import type { Plugin } from 'unified'
import type { Element, Root } from 'hast'
import { visit } from 'unist-util-visit'

export const rehypePluginPreWrapper: Plugin<[], Root> = () => {
	return (tree) => {
		visit(tree, 'element', (node) => {
			if (
				node.tagName === 'pre' &&
				node.children[0]?.type === 'element' &&
				node.children[0].tagName === 'code' &&
				!node.data?.isVisited
			) {
				const codeNode = node.children[0]
				const codeClassName = codeNode.properties?.className?.toString() || ''
				const lang = codeClassName.split('-')[1]
				const cloneNode: Element = {
					type: 'element',
					tagName: 'pre',
					children: node.children,
					data: {
						isVisited: true
					}
				}
				node.children = [
					{
						type: 'element',
						tagName: 'span',
						properties: {
							className: 'lang'
						},
						children: [
							{
								type: 'text',
								value: lang
							}
						]
					},
					cloneNode
				]
			}
		})
	}
}