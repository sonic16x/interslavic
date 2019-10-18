const homePage = process.env.NODE_ENV === 'production' ? '/interslavic' : '';

export const pages = [
    {
        name: 'Dictionary',
        value: 'dictionary',
        path: `${homePage}/`,
    },
    {
        name: 'Grammar basics',
        value: 'grammar',
        path: `${homePage}/grammar`,
    },
    {
        name: 'About',
        value: 'about',
        path: `${homePage}/about`,
    },
];

export function getPageFromPath(): string {
    const currentPath = window.location.pathname;
    const page = pages.find(({path}) => (path === currentPath));
    if (page) {
        return page.value;
    }

    return 'dictionary';
}

export function setInitialPage() {
    const currentPath = window.location.pathname;
    const page = pages.find(({path}) => (path === currentPath));
    if (!page) {
        window.history.replaceState({}, document.title, homePage);
    }
}

export function getPathFromPage(page: string): string {
    const finded = pages.find(({value}) => (value === page));
    if (finded) {
        return finded.path;
    }
    return homePage;
}
