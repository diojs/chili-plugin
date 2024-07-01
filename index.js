import fs from 'fs'
import path from 'path'
import {_paths} from './models/paths.js'

const apps = {}

let passed = await checkPackage()
if (passed) {
  await loadApps(apps)
  logger.mark('[绝云椒椒] 加载成功！')
  console.log('apps:', apps)
} else {
  throw 'Missing necessary dependencies'
}

export {apps}

async function checkPackage() {
  return true
}

async function loadApps(apps) {
  const files = fs.readdirSync(path.join(_paths.pluginRoot, 'apps')).filter(file => file.endsWith('.js'))
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const name = file.replace(/.js$/, '')
    try {
      apps[name] = (await import(`./apps/${file}`)).default
    } catch (e) {
      logger.error(`载入插件错误：${logger.red(name)}`, e)
    }
  }
}
