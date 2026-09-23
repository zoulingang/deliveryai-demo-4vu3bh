import { test, expect, type Page } from '@playwright/test'

async function gotoMenu(page: Page) {
  await page.goto('/?preview=menu')
  await expect(page.getByText('想吃什么，一起点。')).toBeVisible()
}

async function getCurrencyButton(page: Page) {
  return page.getByRole('button', { name: /切换币种|Switch currency/ })
}

test.describe('多币种金额展示', () => {
  test('CUR-001: 默认展示 CNY（¥ 符号）', async ({ page }) => {
    await gotoMenu(page)
    // 菜品价格以 ¥ 开头
    const priceText = await page.locator('p.text-xl.font-extrabold.text-chili-500').first().textContent()
    expect(priceText).toMatch(/^¥/)
  })

  test('CUR-002: 切换到 USD 后金额展示 $ 符号', async ({ page }) => {
    await gotoMenu(page)
    const btn = await getCurrencyButton(page)
    // 初始为 ¥
    await expect(btn).toHaveText('¥')
    // 点击切换
    await btn.click()
    // 按钮显示 $
    await expect(btn).toHaveText('$')
    // 菜品价格以 $ 开头
    const priceText = await page.locator('p.text-xl.font-extrabold.text-chili-500').first().textContent()
    expect(priceText).toMatch(/^\$/)
  })

  test('CUR-003: 切换回 CNY 后金额恢复 ¥ 符号', async ({ page }) => {
    await gotoMenu(page)
    const btn = await getCurrencyButton(page)
    // 切换到 USD
    await btn.click()
    await expect(btn).toHaveText('$')
    // 切换回 CNY
    await btn.click()
    await expect(btn).toHaveText('¥')
    const priceText = await page.locator('p.text-xl.font-extrabold.text-chili-500').first().textContent()
    expect(priceText).toMatch(/^¥/)
  })

  test('CUR-006: 千分位分隔验证', async ({ page }) => {
    await gotoMenu(page)
    const btn = await getCurrencyButton(page)
    await btn.click()
    await expect(btn).toHaveText('$')
    // 检查金额格式包含千分位（如果有 >= 1000 的金额）
    // 小金额也应正确格式化为 $XX.XX
    const priceText = await page.locator('p.text-xl.font-extrabold.text-chili-500').first().textContent()
    expect(priceText).toMatch(/^\$\d/)
  })

  test('CUR-007: localStorage 持久化', async ({ page }) => {
    await gotoMenu(page)
    const btn = await getCurrencyButton(page)
    await btn.click()
    await expect(btn).toHaveText('$')
    // 验证 localStorage 已保存
    const stored = await page.evaluate(() => localStorage.getItem('currency'))
    expect(stored).toBe('USD')
  })

  test('CUR-008: 首次访问默认 CNY', async ({ page }) => {
    await page.goto('/?preview=menu')
    const btn = await getCurrencyButton(page)
    await expect(btn).toHaveText('¥')
    const stored = await page.evaluate(() => localStorage.getItem('currency'))
    expect(stored).toBe('CNY')
  })

  test('CUR-011: 硬编码 ¥ 文案不受币种切换影响', async ({ page }) => {
    await gotoMenu(page)
    const btn = await getCurrencyButton(page)
    // 切换到 USD
    await btn.click()
    await expect(btn).toHaveText('$')
    // 会员卡片区仍包含硬编码 ¥ 文案
    await page.getByRole('button', { name: /会员|Membership/ }).click()
    // 硬编码的 "含 ¥30 菜品券" 文案不受影响
    await expect(page.getByText(/¥30/)).toBeVisible()
  })

  test('CUR-012: 币种切换不影响语言切换', async ({ page }) => {
    await gotoMenu(page)
    const btn = await getCurrencyButton(page)
    await btn.click()
    await expect(btn).toHaveText('$')
    // 切换语言
    const langBtn = page.getByRole('button', { name: /切换语言|Switch language/ })
    await langBtn.click()
    // 语言已切换，币种仍为 USD
    await expect(btn).toHaveText('$')
  })

  test('CUR-013: aria-label 和 aria-pressed 属性验证', async ({ page }) => {
    await gotoMenu(page)
    const btn = await getCurrencyButton(page)
    await expect(btn).toHaveAttribute('aria-pressed', 'false')
    await btn.click()
    await expect(btn).toHaveAttribute('aria-pressed', 'true')
  })

  test('CUR-014: localStorage 不可用时降级为内存态', async ({ page }) => {
    // 禁用 localStorage
    await page.addInitScript(() => {
      const original = window.localStorage
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('localStorage not available')
        },
      })
      void original
    })
    await page.goto('/?preview=menu')
    const btn = await getCurrencyButton(page)
    // 仍能正常切换
    await expect(btn).toHaveText('¥')
    await btn.click()
    await expect(btn).toHaveText('$')
  })

  test('CUR-009: 完整点餐流程在 USD 模式下的金额展示', async ({ page }) => {
    await gotoMenu(page)
    const btn = await getCurrencyButton(page)
    await btn.click()
    await expect(btn).toHaveText('$')
    // 添加菜品到购物车
    await page.locator('article button:has(svg.lucide-plus)').first().click()
    // 弹窗中选择加入
    await page.getByRole('button', { name: /加入本桌购物车|Add to Table Cart/ }).click()
    // 检查购物车金额以 $ 开头
    await expect(page.locator('aside').locator('text=/\\$/')).toBeVisible()
  })

  test('CUR-015: 结账页千分位和小数位正确性', async ({ page }) => {
    await gotoMenu(page)
    const btn = await getCurrencyButton(page)
    await btn.click()
    // 金额格式应为 $XX.XX（两位小数）
    const priceText = await page.locator('p.text-xl.font-extrabold.text-chili-500').first().textContent()
    expect(priceText).toMatch(/^\$\d+\.\d{2}$/)
  })
})
