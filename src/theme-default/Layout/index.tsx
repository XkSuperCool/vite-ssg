import { Context, usePageData } from '@runtime'

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
			<div mb="10" text="red 10">Nav</div>
			<div>
				{getContent()}
			</div>
		</div>
	)
}
