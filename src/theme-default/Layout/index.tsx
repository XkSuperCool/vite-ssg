import { Context, usePageData } from '@runtime'
import '../style/base.css'
import '../style/vars.css'
import { Nav } from '../components/Nav'

export function Layout() {
	const pageData = usePageData()
	const { pageType } = pageData

	function getContent() {
		if (pageType === 'home') {
			return 'home'
		} else if (pageType === 'doc') {
			return <Context />
		} else {
			return '404'
		}
	}

	return (
		<div>
			<div>
				<Nav />
			</div>
			<div>
				{getContent()}
			</div>
		</div>
	)
}
