import { createContext, useContext } from 'react'
import type { PageData } from 'shared/types'

export const DataContext = createContext({} as PageData)

export function usePageData() {
	return useContext(DataContext)
}
