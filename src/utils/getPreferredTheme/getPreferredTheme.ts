export function getPreferredTheme(): 'dark' | 'light' {
    if (typeof window === 'undefined') {
        return 'light' // Fallback to default theme
    }

    const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches

    return prefersDarkTheme ? 'dark' : 'light'
}

