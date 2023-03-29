import { ComponentType } from 'react'
import type { UserConfig as ViteUserConfig } from 'vite'

export interface NavItemWithLink {
	text: string
	link: string
}

export type SidebarItem = 
	| { text: string, link: string }
	| { text: string, link?: string, items: SidebarItem }

export interface SidebarGroup {
	text?: string
	items: SidebarItem[]
}

export interface Sidebar {
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

export interface Hero {
	name: string
	text: string
	tagline: string
	image?: {
		src: string
		alt: string
	}
	actions: {
		text: string
		link: string
		theme: 'brand' | 'alt'
	}[]
}

export interface Feature {
	icon: string
	title: string
	details: string
}

export interface FrontMatter {
	title?: string
	description?: string
	pageType?: PageType
	sidebar?: boolean
	outline?: boolean
	features?: Feature[]
	hero?: Hero
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
	toc?: Header[]
}

export type PropsWithIsland = {
  __island?: boolean;
}
