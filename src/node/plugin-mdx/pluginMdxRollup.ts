import pluginMdx from '@mdx-js/rollup'
import remarkPluginGFM from 'remark-gfm'
import rehypePluginSlug from 'rehype-slug'
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings'
import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter'
import remarkPluginFrontmatter from 'remark-frontmatter'
import { rehypePluginPreWrapper } from './rehypePlugins/preWrapper'

export function pluginMdxRollup() {
	return [
		pluginMdx({
			remarkPlugins: [
				remarkPluginGFM,
				remarkPluginFrontmatter,
				[remarkPluginMDXFrontMatter, { name: 'frontmatter' }]
			],
			rehypePlugins: [
				rehypePluginSlug,
				rehypePluginPreWrapper,
				[
					rehypePluginAutolinkHeadings,
					{
						properties: {
							class: 'header-anchor'
						},
						content: {
							type: 'text',
							value: '#'
						}
					}
				]
			]
		})
	]
}
