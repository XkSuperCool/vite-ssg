import { ComponentType } from 'react'
import type { UserConfig as ViteUserConfig } from 'vite'

interface NavItemWithLink {
	text: string
	link: string
}

type SidebarItem = 
	| { text: string, link: string }
	| { text: string, link?: string, items: SidebarItem }

interface SidebarGroup {
	text?: string
	items: SidebarItem[]
}

interface Sidebar {
	[path: string]: SidebarGroup[]
}

interface Footer {
	message?: string
	copyright?: string
}

interface ThemeConfig {
	nav?: NavItemWithLink[]
	sidebar?: Sidebar
	footer?: Footer
}

export interface UserConfig {
	title?: string
	description?: string
	themeConfig?: ThemeConfig
	vite?: ViteUserConfig
}

export interface SiteConfig {
	root: string
	configPath: string
	siteData: UserConfig
}

export type PageType = 'home' | 'doc' | 'custom' | '404'

export interface Header {
	id: string
	text: string
	depth: number
}

export interface FrontMatter {
	title?: string
	description?: string
	pageType?: PageType
	sidebar?: boolean
	outline?: boolean
}

export interface PageData {
	siteData: UserConfig
	pagePath: string
	frontMatter: FrontMatter
	pageType: PageType
	toc?: Header[]
}

export interface PageModule {
	default?: ComponentType
	frontmatter?: FrontMatter
}
