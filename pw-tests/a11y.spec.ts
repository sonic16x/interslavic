import { test, expect, Page } from '@playwright/test';

// @axe-core/playwright is optional: without it the axe tests skip, the keyboard tests still run
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
/** master's verb button reads "Conjugation" but is named "Declension" */
const PRE_EXISTING = ['label-content-name-mismatch'];

async function serious(page: Page, include: string) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .include(include)
    .analyze();

  return violations
    .filter((v) => (v.impact === 'serious' || v.impact === 'critical') && !PRE_EXISTING.includes(v.id))
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
  await page.getByTestId('search-input').fill('cat');

  return page.getByTestId('result-0');
}

test.describe('Accessibility', () => {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`axe: the cards and the translations window (${colorScheme})`, async ({ page }) => {
      test.skip(!AxeBuilder, '@axe-core/playwright is not installed');
      await page.emulateMedia({ colorScheme });
      const card = await search(page);
      await expect(card).toContainText('kot');
      expect(await serious(page, '#app')).toEqual([]);

      await card.getByRole('button', { name: 'Translations' }).click();
      await expect(page.locator('.modal-dialog .table')).toBeVisible();
      expect(await serious(page, '.modal-dialog')).toEqual([]);
    });
  }

  test('Keyboard: a card button opens the window, focus stays in it, Escape returns to the button', async ({ page }) => {
    const card = await search(page);
    const button = card.getByRole('button', { name: 'Translations' });
    await button.focus();
    await page.keyboard.press('Enter');

    const dialog = page.locator('.modal-dialog');
    await expect(dialog).toBeFocused();
    await expect(dialog).toHaveAccessibleName(/Translations/);

    // Tab cycles inside the window, never onto the page under it
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => {
        const active = document.activeElement;

        return active === document.body || !!active?.closest('.modal-dialog');
      });
      expect(inside, `Tab ${i + 1}`).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(page.locator('.modal-dialog-container.show')).toHaveCount(0);
    await expect(button).toBeFocused();
  });

  test('Keyboard: the part of speech shows its full name on focus; Escape hides it', async ({ page }) => {
    const card = await search(page);
    const hint = card.locator('.hint').first();
    // Tab, not focus(): the tooltip follows a keyboard focus (:focus-visible), not a programmatic one
    for (let i = 0; i < 20 && !(await hint.evaluate((el) => el === document.activeElement)); i++) {
      await page.keyboard.press('Tab');
    }
    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await expect(hint).toHaveAccessibleDescription(await tooltip.innerText());

    await page.keyboard.press('Escape');
    await expect(tooltip).toBeHidden();
  });
});
