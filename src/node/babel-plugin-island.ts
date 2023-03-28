import { declare } from '@babel/helper-plugin-utils'
import type { Visitor} from '@babel/traverse'
import type { PluginPass } from '@babel/core'
import { types } from '@babel/core'
import { MASK_SPLITTER } from './constants'

export default declare(api => {
	const visitor: Visitor<PluginPass> = {
		JSXOpeningElement(path, state) {
			const name = path.node.name
			let bidingName 
			if (name.type === 'JSXIdentifier') {
				bidingName = name.name
			} else if (name.type === 'JSXMemberExpression') {
				let object = name.object
				while (object.type === 'JSXMemberExpression') {
					object = object.object
				}
				bidingName = object.name
			} else {
				return
			}

			if (!bidingName) return

			const binding = path.scope.getBinding(bidingName)
			if (binding?.path.parent.type === 'ImportDeclaration') {
				const source = binding.path.parent.source.value
				for (let attr of path.node.attributes) {
					if (attr.type === 'JSXAttribute' && attr.name.name === '__island') {
						attr.value = types.stringLiteral(`${source}${MASK_SPLITTER}${state.filename || ''}`)
					}
				}
			}
		}
	}

	return {
		name: 'transform-jsx-island',
		visitor
	}
})