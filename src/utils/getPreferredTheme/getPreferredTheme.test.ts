import { getPreferredTheme } from './getPreferredTheme';

describe('getPreferredTheme', () => {
    let originalWindow: typeof window;

    beforeEach(() => {
        originalWindow = global['window'];
        delete global['window'];
    });

    afterEach(() => {
        global['window'] = originalWindow;
    });

    it('should return "dark" when prefers dark theme', () => {
        global['window'] = { matchMedia: jest.fn(() => ({ matches: true })) } as any;
        expect(getPreferredTheme()).toBe('dark');
    });

    it('should return "light" when prefers light theme', () => {
        global['window'] = { matchMedia: jest.fn(() => ({ matches: false })) } as any;
        expect(getPreferredTheme()).toBe('light');
    });

    it('should return "light" when window is not defined', () => {
        global['window'] = undefined;
        expect(getPreferredTheme()).toBe('light');
    });
});
