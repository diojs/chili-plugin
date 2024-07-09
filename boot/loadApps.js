import fs from 'fs'
import path from 'path'
import {_paths} from '#paths'
import {logger} from '#logger'
import {yzPlugin} from '#plugin'

/**
 * 加载apps下所有的插件
 */
export async function loadApps(apps) {
  const files = fs.readdirSync(path.join(_paths.pluginRoot, 'apps')).filter(file => file.endsWith('.js'))
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const name = file.replace(/.js$/, '')
    const appPath = path.join(_paths.pluginRoot, 'apps', file)
    try {
      await loadApp(apps, name, appPath)
    } catch (e) {
      logger.error(`载入插件错误：${logger.red(name)}`, e)
    }
  }

  await loadJs(apps, path.join(_paths.pluginRoot, 'apps_js'))
}

/**
 * 加载单js插件（apps_js）
 */
async function loadJs(apps, rootPath) {
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
      await loadJs(apps, itemPath)
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

/**
 * 判断是否是某个类的实例或继承类
 *
 * @param obj
 * @param clazz
 */
function instanceOf(obj, clazz) {
  if (obj instanceof clazz) {
    return true
  } else if (obj?.prototype) {
    return instanceOf(obj.prototype, clazz)
  }
  return false
}
