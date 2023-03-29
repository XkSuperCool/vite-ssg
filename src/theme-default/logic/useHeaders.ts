import { useEffect, useState } from "react";
import { Header } from "shared/types";

export function useHeaders(initHeaders: Header[]) {
	const [headers, setHeaders] = useState(initHeaders)

	useEffect(() => {
		// @ts-ignore
		if (import.meta.env.DEV) {
			// @ts-ignore
			import.meta.hot.on('mdx-changed', ({ filePath }: { filePath: string }) => {
				import(/*! @vite-ignore */ `${filePath}?import&t=${Date.now()}`).then((res) => {
					setHeaders(res.toc)
				})
			})
		}
	})

	return headers
}