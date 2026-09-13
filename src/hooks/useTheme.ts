import { useCallback, useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'theme'

function getSystemDarkMode(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getStoredTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored
  } catch {
    // localStorage 不可用时降级为默认 auto
  }
  return 'auto'
}

function getInitialTheme(): { mode: ThemeMode; isDark: boolean } {
  const mode = getStoredTheme()
  const isDark = mode === 'dark' || (mode === 'auto' && getSystemDarkMode())
  return { mode, isDark }
}

function applyThemeClass(isDark: boolean) {
  const root = document.documentElement
  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

/**
 * 主题状态管理 hook。
 * 优先级：localStorage > 默认 auto（跟随系统）。
 * localStorage 不可用时降级为内存态，不报错不阻塞。
 * 
 * TODO: 接入账号体系后调用 syncThemePreference 实现跨设备同步
 */
export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const { mode, isDark } = getInitialTheme()
    applyThemeClass(isDark)
    return mode
  })

  // 系统主题变化监听
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === 'auto') {
        applyThemeClass(e.matches)
      }
    }

    // 初始应用
    const isDark = theme === 'dark' || (theme === 'auto' && mediaQuery.matches)
    applyThemeClass(isDark)

    mediaQuery.addEventListener('change', handleSystemChange)
    return () => mediaQuery.removeEventListener('change', handleSystemChange)
  }, [theme])

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode)
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // localStorage 不可用时降级为内存态，不报错
    }
    // TODO: 接入账号体系后，在此处调用服务端同步接口
    // void syncThemePreference(mode)

    const isDark = mode === 'dark' || (mode === 'auto' && getSystemDarkMode())
    applyThemeClass(isDark)
  }, [])

  const isDark = theme === 'dark' || (theme === 'auto' && getSystemDarkMode())

  return { theme, setTheme, isDark }
}

/**
 * 同步主题偏好到服务端（预留接口位）
 * TODO: 接入账号体系后实现此函数
 */
// async function syncThemePreference(_mode: ThemeMode): Promise<void> {
//   // await fetch('/api/user/theme', { method: 'PUT', body: JSON.stringify({ theme: _mode }) })
// }
