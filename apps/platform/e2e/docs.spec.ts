import { test, expect } from '@playwright/test'

test.describe('Platform Documentation', () => {
  test('docs index page renders', async ({ page }) => {
    await page.goto('/docs')
    await expect(page.getByText('Hanzo Platform')).toBeVisible()
    await expect(page.getByText('Key Features')).toBeVisible()
  })

  test('getting started page renders', async ({ page }) => {
    await page.goto('/docs/getting-started')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('quickstart page renders', async ({ page }) => {
    await page.goto('/docs/getting-started/quickstart')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('deployments page renders', async ({ page }) => {
    await page.goto('/docs/deployments')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('kubernetes docs render', async ({ page }) => {
    await page.goto('/docs/deployments/kubernetes')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('virtual machines docs render', async ({ page }) => {
    await page.goto('/docs/virtual-machines')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('clusters docs render', async ({ page }) => {
    await page.goto('/docs/clusters')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('access control docs render', async ({ page }) => {
    await page.goto('/docs/access-control')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('pricing docs render', async ({ page }) => {
    await page.goto('/docs/pricing')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('API docs render', async ({ page }) => {
    await page.goto('/docs/api')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('sidebar navigation is visible', async ({ page }) => {
    await page.goto('/docs')
    await expect(page.getByText('Getting Started')).toBeVisible()
    await expect(page.getByText('Deployments')).toBeVisible()
  })

  test('code blocks are styled', async ({ page }) => {
    await page.goto('/docs/getting-started/quickstart')
    const codeBlocks = page.locator('pre code')
    const count = await codeBlocks.count()
    expect(count).toBeGreaterThan(0)
  })
})
