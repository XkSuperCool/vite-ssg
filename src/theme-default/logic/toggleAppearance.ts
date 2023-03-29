const APPEARANCE_KEY = 'appearance'

let classList: DOMTokenList = null

const setClassList = (isDark = false) => {
	classList[isDark ? 'add' : 'remove']('dark')
	localStorage.setItem(APPEARANCE_KEY, isDark ? 'dark' : 'light')
}

const updateAppearance = () => {
	const userPreference = localStorage.getItem(APPEARANCE_KEY)
	setClassList(userPreference === 'dark')
}

if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
	classList = document.documentElement.classList
	updateAppearance()
	window.addEventListener('storage', updateAppearance);
}

export function toggle() {
	setClassList(!classList.contains('dark'))
}