interface IPage {
    title: string,
    subTitle?: string,
    value: string,
    path: string,
    online?: boolean,
}

export const pages: IPage[] = [
    {
        title: 'dictionaryTitle',
        value: 'dictionary',
        path: BASE_URL,
    },
    {
        title: 'communityTitle',
        value: 'community',
        path: `${BASE_URL}community`,
        online: true,
    },
    {
        title: 'grammarTitle',
        value: 'grammar',
        path: `${BASE_URL}grammar`,
    },
    {
        title: 'translatorTitle',
        value: 'translator',
        path: `${BASE_URL}translator`,
        subTitle: 'Beta',
    },
    {
        title: 'viewerTitle',
        value: 'viewer',
        path: `${BASE_URL}viewer`,
        online: true,
    },
    {
        title: 'settingsTitle',
        value: 'settings',
        path: `${BASE_URL}settings`,
    },
    {
        title: 'aboutTitle',
        value: 'about',
        path: `${BASE_URL}about`,
    },
];

export const defaultPages = ['dictionary', 'community', 'grammar', 'settings', 'about'];

export function goToPage(path: string) {
    window.history.pushState({}, document.title, `${path}`);
}

export function getPageFromPath(): string {
    const currentPath = window.location.pathname.split('#')[0];
    const page = pages.find(({ path }) => (path === currentPath));
    if (page) {
        return page.value;
    }

    return 'dictionary';
}

export function setInitialPage() {
    const currentPath = window.location.pathname.split('#')[0];
    const page = pages.find(({ path }) => (path === currentPath));
    if (!page) {
        window.history.replaceState({}, document.title, BASE_URL);
    }
}

export function getPathFromPage(page: string): string {
    const finded = pages.find(({ value }) => (value === page));
    if (finded) {
        return finded.path;
    }

    return BASE_URL;
}
