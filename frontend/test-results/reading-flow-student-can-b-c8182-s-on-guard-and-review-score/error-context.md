# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reading-flow.spec.ts >> student can browse Reading catalog, answer Bees on guard, and review score
- Location: e2e\reading-flow.spec.ts:3:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/skills/reading
Call log:
  - navigating to "http://localhost:3000/skills/reading", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('student can browse Reading catalog, answer Bees on guard, and review score', async ({ page }) => {
  4  |   // 1. Open Reading Hub
> 5  |   await page.goto('/skills/reading');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/skills/reading
  6  |   await expect(page.getByText('[Simulation Q4] Bees on guard')).toBeVisible();
  7  | 
  8  |   // 2. Open Practice Room
  9  |   await page.getByText('[Simulation Q4] Bees on guard').click();
  10 |   await expect(page).toHaveURL(/\/practice\/reading\/.+/);
  11 |   await expect(page.getByRole('heading', { name: 'Bees on guard' })).toBeVisible();
  12 | 
  13 |   // 3. Answer Q1 (TFNG) and Q5 (inline gap fill)
  14 |   await page.locator('#question-1').getByText('FALSE', { exact: true }).click();
  15 |   await page.getByLabel('Answer for question 5').fill('maize');
  16 | 
  17 |   // 4. Open Finish modal and verify guest check displays review screen
  18 |   await page.getByRole('button', { name: 'Finish' }).click();
  19 |   await page.getByRole('button', { name: 'Check Locally' }).click();
  20 | 
  21 |   await expect(page.getByText('Answer Key & Review')).toBeVisible();
  22 |   await expect(page.getByText('2 / 7')).toBeVisible();
  23 | });
```