import { test, expect, Page } from '@playwright/test';

// @axe-core/playwright is optional: without it the axe tests skip, the keyboard test still runs
let AxeBuilder: any;
test.beforeAll(async () => {
  const name = '@axe-core/playwright';
  try {
    AxeBuilder = (await import(name)).default;
  } catch {
    AxeBuilder = null;
  }
});

/**
 * Contrast that master already has: the site's primary blue on white (action buttons, LineSelector items),
 * the grey IPA and part-of-speech hint. Everything else serious or critical fails.
 */
const PRE_EXISTING_CONTRAST = ['class="ipa"', 'class="hint"', 'class="action-button"', 'class="item'];

async function serious(page: Page, include: string) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .include(include)
    .analyze();

  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => ({
      id: v.id,
      nodes: v.nodes
        .filter((n) => v.id !== 'color-contrast' || !PRE_EXISTING_CONTRAST.some((s) => n.html.includes(s)))
        .map((n) => n.target.join(' ')),
    }))
    .filter((v) => v.nodes.length);
}

async function search(page: Page) {
  await page.goto('http://localhost:4173/');
  await expect(page.getByTestId('dictionary-loading')).toBeVisible();
  await expect(page.getByTestId('main-title')).toBeVisible();
  await page.getByTestId('search-input').click();
  await page.getByTestId('lang-selector').selectOption('ru');
  await page.getByTestId('search-input').fill('местоимение');

  return page.locator('[data-testid^="result-"]', { hasText: 'zaimennik' }).first();
}

test.describe('Accessibility', () => {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`axe: the cards and every tab of the lemma window (${colorScheme})`, async ({ page }) => {
      test.skip(!AxeBuilder, '@axe-core/playwright is not installed');
      await page.emulateMedia({ colorScheme });
      const card = await search(page);
      await expect(card.locator('.results-card-status__pill')).toHaveCount(2);
      expect(await serious(page, '#app')).toEqual([]);

      await card.locator('.results-card-status__pill').last().click();
      const modal = page.locator('.modal-dialog');
      const tabs = modal.locator('.intelligibility-modal__tabs button');
      await expect(tabs).toHaveCount(3);
      for (let i = 0; i < 3; i++) {
        await tabs.nth(i).click();
        await expect(tabs.nth(i)).toHaveAttribute('aria-pressed', 'true');
        expect(await serious(page, '.modal-dialog'), await tabs.nth(i).innerText()).toEqual([]);
      }
    });
  }

  test('Keyboard: a pill opens the window, focus stays in it, Escape returns to the pill', async ({ page }) => {
    const card = await search(page);
    const pill = card.locator('.results-card-status__pill').last();
    // what the number is, not just "74%"
    await expect(pill).toHaveAccessibleName(/^Intelligibility \d+%/);
    await pill.focus();
    await page.keyboard.press('Enter');

    const dialog = page.locator('.modal-dialog');
    await expect(dialog).toBeFocused();
    await expect(dialog).toHaveAccessibleName(/zaimennik/);
    const word = dialog.locator('.intelligibility-modal__word');
    await expect(word).toContainText('zaimennik');

    // Tab cycles inside the window, never onto the page under it
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => {
        const active = document.activeElement;

        return active === document.body || !!active?.closest('.modal-dialog');
      });
      expect(inside, `Tab ${i + 1}`).toBe(true);
    }

    // the tabs are buttons: Enter switches, aria-pressed follows
    const translations = dialog.locator('.intelligibility-modal__tabs button', { hasText: 'Translations' });
    await translations.focus();
    await page.keyboard.press('Enter');
    await expect(translations).toHaveAttribute('aria-pressed', 'true');
    await expect(dialog.locator('.table')).toBeVisible();

    // ← steps to the other lemma (zaimennik is the last one)
    await page.keyboard.press('ArrowLeft');
    await expect(word).not.toContainText('zaimennik');

    await page.keyboard.press('Escape');
    await expect(page.locator('.modal-dialog-container.show')).toHaveCount(0);
    await expect(pill).toBeFocused();
  });
});
