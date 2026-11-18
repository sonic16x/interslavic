import { test, expect } from '@playwright/test';

// A row may hold several equal lemmas ("zaimę, zaimennik"); the windows show one lemma at a time.
test.describe('Lemmas of one row', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4173/');
    await expect(page.getByTestId('dictionary-loading')).toBeVisible();
    await expect(page.getByTestId('main-title')).toBeVisible();
    await page.getByTestId('search-input').click();
  });

  test('Declension opens the lemma window on its forms; the arrows step through the lemmas', async ({ page }) => {
    await page.getByTestId('lang-selector').selectOption('ru');
    await page.getByTestId('search-input').fill('местоимение');

    const card = page.locator('[data-testid^="result-"]', { hasText: 'zaimennik' }).first();
    await card.locator('.action-button').last().click();

    const modal = page.locator('.modal-dialog');
    const word = modal.locator('.intelligibility-modal__word');
    await expect(modal.locator('table').first()).toBeVisible();
    const before = await word.innerText();
    const forms = await modal.locator('.modal-dialog__body table').first().innerText();

    // the tab stays on the forms, the lemma changes
    await modal.locator('.intelligibility-modal__step').last().click();
    await expect(word).not.toHaveText(before);
    await expect(modal.locator('.modal-dialog__body table').first()).not.toHaveText(forms);
    await expect(modal.locator('.modal-dialog__body')).not.toContainText('Slovosbor');

    if (process.env.SHOTS) {
      await page.waitForTimeout(500);
      await modal.screenshot({ path: `${process.env.SHOTS}/detail-${test.info().project.name}.png` });
    }
  });

  test('The lemma window names the word as the card does: case questions, not the raw addition', async ({ page }) => {
    await page.getByTestId('lang-selector').selectOption('en');
    await page.getByTestId('search-input').fill('for');

    const card = page.locator('[data-testid^="result-"]', { hasText: 'dlja' }).first();
    await card.locator('.results-card-status__pill').first().click();
    const word = page.locator('.modal-dialog .intelligibility-modal__word');
    await expect(word).toContainText('dlja');
    await expect(word).not.toContainText('+2');
    if (process.env.SHOTS) {
      await page.locator('.modal-dialog').screenshot({ path: `${process.env.SHOTS}/dlja-${test.info().project.name}.png` });
    }
  });

  test('A click on a lemma copies it, as it always did; its pill opens its window', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByTestId('lang-selector').selectOption('ru');
    await page.getByTestId('search-input').fill('местоимение');

    const card = page.locator('[data-testid^="result-"]', { hasText: 'zaimennik' }).first();
    await card.locator('.clipboard', { hasText: 'zaimennik' }).first().click();
    // the dialog element is always in the page: no lemma window opened in it
    await expect(page.locator('.modal-dialog .intelligibility-modal__word')).toHaveCount(0);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('zaimennik');

    await card.locator('.results-card-status__pill').last().click();
    await expect(page.locator('.modal-dialog .intelligibility-modal__word')).toContainText('zaimennik');
    // ‹ ›, round at both ends
    await expect(page.locator('.modal-dialog .intelligibility-modal__step')).toHaveCount(2);
  });

  test('Translations: the full table; a share pill opens the votes', async ({ page }) => {
    await page.getByTestId('lang-selector').selectOption('ru');
    await page.getByTestId('search-input').fill('местоимение');

    const card = page.locator('[data-testid^="result-"]', { hasText: 'zaimennik' }).first();
    await card.getByRole('button', { name: /translat/i }).click();

    const modal = page.locator('.modal-dialog');
    // the site's translations table: Interslavic, English, the Slavic languages with the share pill
    await expect(modal.locator('td [lang="isv-Cyrl"]').first()).toContainText('заименник');
    const pill = modal.locator('tr', { hasText: 'Ukrainian' }).locator('.results-card-status__pill');
    await expect(pill).toBeVisible();
    // a click on the pill opens the votes
    await pill.click();
    const table = modal.locator('.intelligibility-modal__table');
    await expect(table.locator('th[lang="isv-Cyrl"]')).toBeVisible();
    await expect(table.locator('th[lang="uk"] b')).toHaveCount(0);
    // the other lemma in the Interslavic row steps to it, as ‹ › do
    const word = await modal.locator('.intelligibility-modal__word').innerText();
    await table.locator('th[lang="isv-Cyrl"] button').click();
    await expect(modal.locator('.intelligibility-modal__word')).not.toHaveText(word);

    if (process.env.SHOTS) {
      await modal.screenshot({ path: `${process.env.SHOTS}/translations-${test.info().project.name}.png` });
    }
  });

  test('Card pill opens the intelligibility window on its lemma', async ({ page }) => {
    await page.getByTestId('lang-selector').selectOption('ru');
    await page.getByTestId('search-input').fill('местоимение');

    const card = page.locator('[data-testid^="result-"]', { hasText: 'zaimennik' }).first();
    const pills = card.locator('.results-card-status__pill');
    await expect(pills).toHaveCount(2);
    if (process.env.SHOTS) {
      await card.screenshot({ path: `${process.env.SHOTS}/card-${test.info().project.name}.png` });
    }

    // "zaimę 60%, zaimennik 69%": the second pill belongs to zaimennik, the window shows the same number
    const onCard = (await pills.last().innerText()).trim();
    await pills.last().click();
    const modal = page.locator('.modal-dialog');
    await expect(modal.locator('.intelligibility-modal__word')).toContainText('zaimennik');
    await expect(modal.locator('tfoot .intelligibility-modal__score')).toContainText(onCard);
    // answers load lazily: the Russian row fills in with the votes
    await expect(modal.locator('tr:has(th[lang="ru"])')).toContainText(/\d/);
    await expect(modal.locator('.intelligibility-modal__flower ellipse.none')).not.toHaveCount(6);
    if (process.env.SHOTS) {
      await page.waitForTimeout(300);
      await modal.screenshot({ path: `${process.env.SHOTS}/intelligibility-${test.info().project.name}.png` });
    }
  });

  test('Card marks each lemma without people\'s votes with a bot', async ({ page }) => {
    await page.getByTestId('lang-selector').selectOption('en');
    await page.getByTestId('search-input').fill('at sign');

    // "uho, uško" [@]: slovosbor votes for uho belong to the row "ear", not to this one
    const card = page.locator('[data-testid^="result-"]', { hasText: 'uško' }).first();
    await expect(card.locator('.results-card-status__pill .results-card-status__bot')).toHaveCount(2);
    if (process.env.SHOTS) {
      await card.screenshot({ path: `${process.env.SHOTS}/card-at-${test.info().project.name}.png` });
    }

    // the pill opens the window on machine votes only
    await card.locator('.results-card-status__pill').first().click();
    const modal = page.locator('.modal-dialog');
    await expect(modal.locator('tr:has(th[lang="ru"])').locator('.intelligibility-modal__machine').first()).toBeVisible();
  });

  test('Machine votes a phrase lemma against phrase translations', async ({ page }) => {
    await page.getByTestId('lang-selector').selectOption('en');
    await page.getByTestId('search-input').fill('seaweed');

    // "morska trava" ~ ru "морская водоросль": a phrase is compared to phrases, not skipped
    const card = page.locator('[data-testid^="result-"]', { hasText: 'morska trava' }).first();
    await card.locator('.results-card-status__pill').first().click();
    const modal = page.locator('.modal-dialog');
    await expect(modal.locator('tr:has(th[lang="ru"])').locator('.intelligibility-modal__machine').first()).toBeVisible();
    if (process.env.SHOTS) {
      await modal.screenshot({ path: `${process.env.SHOTS}/seaweed-${test.info().project.name}.png` });
    }
  });
})
