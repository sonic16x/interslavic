import { test, expect } from '@playwright/test';

test('A tooltip in the scrolled vote table shows whole; Escape closes it, not the window', async ({ page, isMobile }) => {
  await page.goto('http://localhost:4173/');
  await expect(page.getByTestId('dictionary-loading')).toBeVisible();
  await expect(page.getByTestId('main-title')).toBeVisible();
  await page.getByTestId('search-input').click();
  await page.getByTestId('lang-selector').selectOption('ru');
  await page.getByTestId('search-input').fill('местоимение');

  const card = page.locator('[data-testid^="result-"]', { hasText: 'zaimennik' }).first();
  await card.getByRole('button', { name: /translat/i }).click();

  const modal = page.locator('.modal-dialog');
  await modal.locator('tr', { hasText: 'Ukrainian' }).locator('.results-card-status__pill').click();
  const scroll = modal.locator('.intelligibility-modal__scroll');
  await expect(scroll).toBeVisible();
  // to the right edge; wait for its scroll event (on a phone): a late one would close a tapped tooltip, as it should
  await scroll.evaluate((el) => new Promise((resolve) => {
    if (el.scrollWidth <= el.clientWidth) return resolve(null);
    el.addEventListener('scroll', resolve, { once: true });
    el.scrollLeft = el.scrollWidth;
  }));

  // Σ, the last head, at the right edge of the scrolled table
  const sum = modal.locator('thead th').last();
  if (isMobile) {
    await sum.tap();
  } else {
    await sum.hover();
  }

  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toHaveText('All answers for the language');
  await expect(tooltip).toBeInViewport({ ratio: 1 });

  await page.keyboard.press('Escape');
  await expect(tooltip).toBeHidden();
  await expect(scroll).toBeVisible();
});
