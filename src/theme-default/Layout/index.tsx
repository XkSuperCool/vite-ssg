import { Context } from '@runtime'

export function Layout() {
	return (
		<div>
			<h1 color='red' p="2" m="4">Layout SSG</h1>
			<div>
				<Context />
			</div>
		</div>
	)
}
