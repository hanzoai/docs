import { test, expect, devices } from '@playwright/test'

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]

for (const vp of viewports) {
  test.describe(`Responsive — ${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })

    test('landing page renders without overflow', async ({ page }) => {
      await page.goto('/')
      // No horizontal scrollbar
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })

    test('hero section is visible', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByText('Deploy Anywhere.')).toBeVisible()
    })

    test('feature cards render', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByText('Kubernetes Orchestration')).toBeVisible()
    })

    test('docs page renders', async ({ page }) => {
      await page.goto('/docs')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })

    test('screenshot baseline', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot(`landing-${vp.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
      })
    })
  })
}
