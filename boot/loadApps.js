import fs from 'fs'
import path from 'path'
import {_paths} from '#paths'
import {logger} from '#logger'
import {yzPlugin} from '#plugin'
import {instanceOf} from '#utils'

/**
 * 加载apps下所有的插件
 */
export async function loadChiliApps(apps) {
  const appsPath = path.join(_paths.pluginRoot, 'apps')
  await loadApps(apps, appsPath)
  await loadAppsPlus(apps, path.join(_paths.pluginRoot, 'apps_plus'), 0)
}

/**
 * 加载传统v3插件
 * @param apps 用于保存加载的插件
 * @param appsPath 插件目录
 * @return {Promise<void>}
 */
export async function loadApps(apps, appsPath) {
  const files = fs.readdirSync(appsPath).filter(file => file.endsWith('.js'))
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const name = file.replace(/.js$/, '')
    const appPath = path.join(appsPath, file)
    try {
      await loadApp(apps, name, appPath)
    } catch (e) {
      logger.error(`载入插件错误：${logger.red(name)}`, e)
    }
  }
  return apps
}

/**
 * 加载 apps_plus 插件
 */
async function loadAppsPlus(apps, rootPath, level = 0) {
  if (!fs.existsSync(rootPath)) {
    return
  }
  const items = fs.readdirSync(rootPath)
  for (const item of items) {
    if (item.startsWith('.')) {
      continue
    }
    const itemPath = path.join(rootPath, item)
    // 判断是否是目录
    const stat = fs.statSync(itemPath)
    if (stat.isDirectory()) {
      // 判断首层目录，如果包含 chili.entry.js 则认为是类plugins，仅加载 chili.entry.js
      if (level === 0) {
        const entryPath = path.join(itemPath, 'chili.entry.js')
        if (fs.existsSync(entryPath)) {
          const {apps: entryApps} = await import(`file:///${entryPath}`)
          Object.assign(apps, entryApps)
          continue
        }
      }
      await loadAppsPlus(apps, itemPath, level + 1)
    } else if (item.endsWith('.js')) {
      const name = item.replace(/.js$/, '')
      try {
        await loadApp(apps, name, itemPath)
      } catch (e) {
        logger.error(`载入JS插件错误：${logger.red(itemPath)}`, e)
      }
    }
  }
}

/**
 * 识别单个插件
 */
async function loadApp(apps, name, appPath) {
  const module = await import(`file:///${appPath}`)
  for (const [key, value] of Object.entries(module)) {
    if (!instanceOf(value, yzPlugin)) {
      continue
    }
    if (key === 'default') {
      apps[name] = value
    } else {
      apps[key] = value
    }
  }
}
