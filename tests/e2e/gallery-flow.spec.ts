import { expect, test } from '@playwright/test';

const corsHeaders = {
  'content-type': 'image/jpeg',
  'access-control-allow-origin': '*',
};

test('search, sort, select, and download selected images', async ({ page }) => {
  const downloads: string[] = [];

  page.on('download', (download) => {
    downloads.push(download.suggestedFilename());
  });

  await page.route('https://images.pexels.com/**', async (route) => {
    if (route.request().method() === 'HEAD') {
      await route.fulfill({
        status: 200,
        headers: {
          ...corsHeaders,
          'content-length': '2048',
        },
      });
      return;
    }

    await route.fulfill({
      status: 200,
      headers: {
        ...corsHeaders,
        'content-length': '2048',
      },
      body: Buffer.alloc(2048, 1),
    });
  });

  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Pet Gallery' })).toBeVisible();

  const searchInput = page.getByRole('searchbox', { name: /search pets/i });
  await searchInput.fill('Barky Spears');

  await expect(page.getByRole('heading', { name: 'Barky Spears', level: 3 })).toBeVisible();
  await expect(page.locator('article h3')).toHaveCount(1);

  await searchInput.fill('');
  await expect(page.locator('article h3')).toHaveCount(12);

  const sortSelect = page.getByRole('combobox', { name: /sort pets/i });
  await sortSelect.selectOption('name-desc');
  await expect(page.locator('article h3').first()).toHaveText('Woody');

  const checkboxes = page.locator('article input[type="checkbox"]');
  await checkboxes.nth(0).check();
  await checkboxes.nth(1).check();

  await expect(page.getByText('2 selected', { exact: false })).toHaveCount(2);

  await page.getByRole('button', { name: 'Download Selected' }).click();

  await expect(page.getByText(/Downloaded 2 image\(s\)\./)).toBeVisible();
  await expect
    .poll(() => downloads.length, {
      message: 'expected two browser downloads to be triggered',
    })
    .toBeGreaterThanOrEqual(2);
});
