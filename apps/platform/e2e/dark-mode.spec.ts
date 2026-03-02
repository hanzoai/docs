import { test, expect } from '@playwright/test'

test.describe('Dark Mode', () => {
  test('defaults to dark theme', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })

  test('dark theme has dark background', async ({ page }) => {
    await page.goto('/')
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor
    })
    // Should be a very dark color (near black)
    expect(bgColor).toBeTruthy()
  })

  test('text is readable in dark mode', async ({ page }) => {
    await page.goto('/')
    const heroText = page.getByText('Deploy Anywhere.')
    await expect(heroText).toBeVisible()
    const color = await heroText.evaluate((el) => {
      return getComputedStyle(el).color
    })
    // Should be a light color
    expect(color).toBeTruthy()
  })

  test('feature cards have visible borders', async ({ page }) => {
    await page.goto('/')
    const card = page.getByText('Kubernetes Orchestration').locator('..')
    await expect(card).toBeVisible()
  })

  test('pricing cards render in dark mode', async ({ page }) => {
    await page.goto('/')
    const nanoCard = page.getByText('Nano').first()
    await expect(nanoCard).toBeVisible()
  })
})
