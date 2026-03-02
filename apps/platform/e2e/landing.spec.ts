import { test, expect } from '@playwright/test'

test.describe('Platform Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders hero section', async ({ page }) => {
    await expect(page.getByText('Deploy Anywhere.')).toBeVisible()
    await expect(page.getByText('One Dashboard.')).toBeVisible()
    await expect(page.getByText('Get Started Free').first()).toBeVisible()
    await expect(page.getByText('Read the Docs').first()).toBeVisible()
  })

  test('renders terminal preview', async ({ page }) => {
    await expect(page.getByText('hanzo deploy --cluster prod-k8s')).toBeVisible()
    await expect(page.getByText('Health checks passing')).toBeVisible()
  })

  test('renders orchestrator strip', async ({ page }) => {
    await expect(page.getByText('Kubernetes')).toBeVisible()
    await expect(page.getByText('Docker Swarm')).toBeVisible()
    await expect(page.getByText('Docker Compose')).toBeVisible()
    await expect(page.getByText('Virtual Machines')).toBeVisible()
  })

  test('renders feature cards', async ({ page }) => {
    await expect(page.getByText('Kubernetes Orchestration')).toBeVisible()
    await expect(page.getByText('Docker Swarm & Compose')).toBeVisible()
    await expect(page.getByText('VM Management')).toBeVisible()
    await expect(page.getByText('Git-Powered Builds')).toBeVisible()
    await expect(page.getByText('Multi-Cluster Fleet')).toBeVisible()
    await expect(page.getByText('Real-Time Monitoring')).toBeVisible()
  })

  test('renders pricing section', async ({ page }) => {
    await expect(page.getByText('Simple, Transparent Pricing')).toBeVisible()
    await expect(page.getByText('Nano')).toBeVisible()
    await expect(page.getByText('Power Dedicated')).toBeVisible()
    await expect(page.getByText('$5')).toBeVisible()
  })

  test('renders architecture section', async ({ page }) => {
    await expect(page.getByText('How It Works')).toBeVisible()
    await expect(page.getByText('Push Code')).toBeVisible()
    await expect(page.getByText('Build')).toBeVisible()
    await expect(page.getByText('Deploy', { exact: false })).toBeTruthy()
    await expect(page.getByText('Live')).toBeVisible()
  })

  test('CTA links to app.platform.hanzo.ai', async ({ page }) => {
    const ctaLink = page.getByRole('link', { name: /Get Started Free/i }).first()
    await expect(ctaLink).toHaveAttribute('href', 'https://app.platform.hanzo.ai')
  })

  test('docs link navigates to /docs', async ({ page }) => {
    const docsLink = page.getByRole('link', { name: /Read the Docs/i }).first()
    await expect(docsLink).toHaveAttribute('href', '/docs')
  })
})
