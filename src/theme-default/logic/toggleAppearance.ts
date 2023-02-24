const APPEARANCE_KEY = 'appearance'

const classList = document.documentElement.classList

const setClassList = (isDark = false) => {
	classList[isDark ? 'add' : 'remove']('dark')
	localStorage.setItem(APPEARANCE_KEY, isDark ? 'dark' : 'light')
}

const updateAppearance = () => {
	const userPreference = localStorage.getItem(APPEARANCE_KEY)
	setClassList(userPreference === 'dark')
}

if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
	updateAppearance()
	window.addEventListener('storage', updateAppearance);
}

export function toggle() {
	setClassList(!classList.contains('dark'))
}