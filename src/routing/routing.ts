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
        path: '/',
    },
    {
        title: 'grammarTitle',
        value: 'grammar',
        path: '/grammar',
    },
    {
        title: 'viewerTitle',
        value: 'viewer',
        path: '/viewer',
        online: true,
    },
    {
        title: 'settingsTitle',
        value: 'settings',
        path: '/settings',
    },
    {
        title: 'aboutTitle',
        value: 'about',
        path: '/about',
    },
];

export const defaultPages = ['dictionary', 'grammar', 'settings', 'about'];

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
        window.history.replaceState({}, document.title, '/');
    }
}

export function getPathFromPage(page: string): string {
    const finded = pages.find(({ value }) => (value === page));
    if (finded) {
        return finded.path;
    }

    return '/';
}
