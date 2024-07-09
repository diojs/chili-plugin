import {logger} from '#logger'
import {loadChiliApps, loadV2Apps} from './boot/index.js'

const apps = {}

let passed = await checkPackage()
if (passed) {
  await loadChiliApps(apps)
  // 加载 v2 插件
  await loadV2Apps()
  logger.mark('启动成功')
} else {
  throw '缺少必要的依赖项'
}

export {apps}

async function checkPackage() {
  return true
}
