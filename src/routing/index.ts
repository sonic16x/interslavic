export const pages = [
    {
        name: 'dictionaryTitle',
        value: 'dictionary',
        path: BASE_URL,
    },
    {
        name: 'grammarTitle',
        value: 'grammar',
        path: `${BASE_URL}grammar`,
    },
    {
        name: 'settingsTitle',
        value: 'settings',
        path: `${BASE_URL}settings`,
    },
    {
        name: 'aboutTitle',
        value: 'about',
        path: `${BASE_URL}about`,
    },
];

export function goToPage(path: string) {
    window.history.pushState({}, document.title, `${path}`);
}

export function getPageFromPath(): string {
    const currentPath = window.location.pathname.split('#')[0];
    const page = pages.find(({path}) => (path === currentPath));
    if (page) {
        return page.value;
    }

    return 'dictionary';
}

export function setInitialPage() {
    const currentPath = window.location.pathname.split('#')[0];
    const page = pages.find(({path}) => (path === currentPath));
    if (!page) {
        window.history.replaceState({}, document.title, BASE_URL);
    }
}

export function getPathFromPage(page: string): string {
    const finded = pages.find(({value}) => (value === page));
    if (finded) {
        return finded.path;
    }
    return BASE_URL;
}
