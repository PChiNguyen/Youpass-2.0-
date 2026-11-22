import { test, expect } from '@playwright/test';

test('student can browse Reading catalog, answer Bees on guard, and review score', async ({ page }) => {
  // 1. Open Reading Hub
  await page.goto('/skills/reading');
  await expect(page.getByText('[Simulation Q4] Bees on guard')).toBeVisible();

  // 2. Open Practice Room
  await page.getByText('[Simulation Q4] Bees on guard').click();
  await expect(page).toHaveURL(/\/practice\/reading\/.+/);
  await expect(page.getByRole('heading', { name: 'Bees on guard' })).toBeVisible();

  // 3. Answer Q1 (TFNG) and Q5 (inline gap fill)
  await page.locator('#question-1').getByText('FALSE', { exact: true }).click();
  await page.getByLabel('Answer for question 5').fill('maize');

  // 4. Open Finish modal and verify guest check displays review screen
  await page.getByRole('button', { name: 'Finish' }).click();
  await page.getByRole('button', { name: 'Check Locally' }).click();

  await expect(page.getByText('Answer Key & Review')).toBeVisible();
  await expect(page.getByText('2 / 7')).toBeVisible();
});