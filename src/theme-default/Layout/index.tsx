import { usePageData } from '@runtime'
import '../style/base.css'
import '../style/vars.css'
import '../style/doc.css'
import { Nav } from '../components/Nav'
import { HomeLayout } from './HomeLayout'
import { DocLayout } from './DocLayout'

export function Layout() {
	const pageData = usePageData()
	const { pageType } = pageData

	function getContent() {
		if (pageType === 'home') {
			return <HomeLayout />
		} else if (pageType === 'doc') {
			return <DocLayout />
		} else {
			return '404'
		}
	}

	return (
		<div>
			<div>
				<Nav />
			</div>
			<section style={{ paddingTop: 'var(--island-nav-height)' }}>
				{getContent()}
			</section>
		</div>
	)
}
