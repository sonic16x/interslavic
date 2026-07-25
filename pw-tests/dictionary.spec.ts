import { test, expect } from '@playwright/test';

test.describe('Dictionary', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4173/');

    await expect(page.getByTestId('dictionary-loading')).toBeVisible();
    await expect(page.getByTestId('main-title')).toBeVisible();
    await page.getByTestId('search-input').click();
  });

  test('Translate word en->isv', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('cat');

    const firstResult = page.getByTestId('result-0');

    await expect(firstResult).toContainText('kot');
    await expect(firstResult).toContainText('кот');
    await expect(firstResult).toContainText('cat, tom-cat');
  });

  test('Change direction isv->en', async ({ page }) => {
    await page.getByTestId('change-direction').click()

    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('kot');

    const firstResult = page.getByTestId('result-0');

    await expect(firstResult).toContainText('cat, tom-cat');
    await expect(firstResult).toContainText('kot');
    await expect(firstResult).toContainText('кот');
  });

  test('Change lang ru->isv', async ({ page }) => {
    await page.getByTestId('lang-selector').selectOption('ru');

    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('кошка');

    const firstResult = page.getByTestId('result-0');

    await expect(firstResult).toContainText('kotka');
    await expect(firstResult).toContainText('котка');
    await expect(firstResult).toContainText('кошка');
  });

  test('Filter by target language', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('absen');

    // "odsutny" is marked as unintelligible for Poles
    await expect(page.getByTestId('result-0')).toContainText('odsutny');

    await page.locator('#expand').click();

    const picker = page.getByTestId('intelligibility-selector');
    await expect(picker).toContainText('any');
    await picker.click();
    await page.locator('.multi-selector__option', { hasText: 'Polish' }).locator('.checkbox__box').click();
    await expect(picker).toContainText('Polish');

    // only the words that Poles may understand are left
    await expect(page.getByTestId('result-0')).toContainText('absencija');
    await expect(page.getByTestId('result-1')).toContainText('razsějany profesor');
    await expect(page.getByTestId('result-2')).toHaveCount(0);

    // the partially intelligible one is flagged with a warning sign about Polish,
    // while the other one is fine for the Poles - whatever happens in other languages
    await expect(page.getByTestId('result-0').locator('.results-card-status')).toHaveCount(0);
    await expect(page.getByTestId('result-1').locator('.results-card-status'))
      .toHaveAttribute('title', /Polish/);

    // there is no data for Slovene, so both words get a question mark on top of that
    await page.locator('.multi-selector__option', { hasText: 'Slovene' }).locator('.checkbox__box').click();
    await expect(picker).toContainText('Polish, Slovene');

    const firstStatuses = page.getByTestId('result-0').locator('.results-card-status');
    await expect(firstStatuses).toHaveCount(1);
    await expect(firstStatuses).toHaveText('❓');
    await expect(firstStatuses).toHaveAttribute('title', /Slovene/);

    const secondStatuses = page.getByTestId('result-1').locator('.results-card-status');
    await expect(secondStatuses).toHaveText(['⚠️', '❓']);
    await expect(secondStatuses.nth(0)).toHaveAttribute('title', /Polish/);
    await expect(secondStatuses.nth(1)).toHaveAttribute('title', /Slovene/);
  });

  test('Reset the target language filter when nothing is found', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    // every "abundance" synonym is marked as unintelligible for Poles
    await searchInput.fill('abund');
    await expect(page.getByTestId('result-0')).toBeVisible();

    await page.locator('#expand').click();
    await page.getByTestId('intelligibility-selector').click();
    await page.locator('.multi-selector__option', { hasText: 'Polish' }).locator('.checkbox__box').click();

    const empty = page.getByTestId('result-empty');
    await expect(empty).toBeVisible();

    await empty.getByRole('button').click();
    await expect(page.getByTestId('result-0')).toBeVisible();
    await expect(page.getByTestId('intelligibility-selector')).toContainText('any');
  });

  test('Empty result', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('ololololo');

    await expect(page.getByTestId('result-empty')).toBeVisible();
  });
})

