import pluginMdx from '@mdx-js/rollup'
import remarkPluginGFM from 'remark-gfm'
import rehypePluginSlug from 'rehype-slug'
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings'
import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter'
import remarkPluginFrontmatter from 'remark-frontmatter'
import { rehypePluginPreWrapper } from './rehypePlugins/preWrapper'
import { rehypePluginShiki } from './rehypePlugins/shiki'
import shiki from 'shiki'
import type { Plugin } from 'vite';
import { remarkPluginToc } from './remarkPlugins/toc'

export async function pluginMdxRollup() {
	return [
		pluginMdx({
			remarkPlugins: [
				remarkPluginGFM,
				remarkPluginToc,
				remarkPluginFrontmatter,
				[remarkPluginMDXFrontMatter, { name: 'frontmatter' }]
			],
			rehypePlugins: [
				rehypePluginSlug,
				rehypePluginPreWrapper,
				[
					rehypePluginShiki,
					{
						highlighter: await shiki.getHighlighter({ theme: 'nord' })
					}
				],
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
	] as unknown as Plugin
}
