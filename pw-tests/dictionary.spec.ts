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

  test('Empty result', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('ololololo');

    await expect(page.getByTestId('result-empty')).toBeVisible();
  });
})

