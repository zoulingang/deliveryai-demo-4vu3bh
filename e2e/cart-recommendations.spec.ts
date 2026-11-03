import { test, expect } from '@playwright/test'

test.describe('购物车推荐「本桌还差点啥」', () => {
  test('REC-001: 按缺少的品类推荐，加入后推荐随之更新', async ({ page }) => {
    // Preview cart holds one meat dish, so broth and veggie are missing
    await page.goto('/?preview=menu')
    const block = page.getByTestId('cart-recommendations').first()
    await expect(block).toBeVisible()
    await expect(block.getByText('本桌还差点啥')).toBeVisible()
    await expect(block.getByText('先选个锅底，火锅的灵魂')).toBeVisible()
    await expect(block.getByText('点了这么多，来点解腻的菜？')).toBeVisible()
    await expect(block.getByText('来点肥牛毛肚，火锅的主角')).toHaveCount(0)

    // Adding the broth recommendation puts it in the cart as full portion · mild
    await block.getByRole('button', { name: '加入' }).first().click()
    await expect(page.getByText('已按整份 · 微辣加入').first()).toBeVisible()
    await expect(page.locator('aside').getByText('微辣').first()).toBeVisible()
    await expect(block.getByText('先选个锅底，火锅的灵魂')).toHaveCount(0)
    await expect(block.getByText('最后来份主食收尾吧')).toBeVisible()
  })

  test('REC-002: 点了重辣锅底时推荐冰饮', async ({ page }) => {
    await page.goto('/?preview=menu')
    await page.getByRole('button', { name: '锅底' }).click()
    await page.locator('article').nth(1).locator('button').last().click()
    await page.getByRole('button', { name: '重辣' }).click()
    await page.getByRole('button', { name: /加入本桌购物车/ }).click()
    const block = page.getByTestId('cart-recommendations').first()
    await expect(block.getByText('重辣配冰饮更过瘾')).toBeVisible()
  })
})
