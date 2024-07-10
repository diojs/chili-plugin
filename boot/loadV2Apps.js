import fs from 'fs'
import path from 'path'
import {_paths} from '#paths'
import {logger} from '#logger'
import {registerV2App} from '#store'

const v2JsPath = path.join(_paths.pluginRoot, 'apps_v2')

// 加载V2单JS文件插件
export async function loadV2Apps() {
  const v2Apps = []
  const checkReg = /.js$/i
  const fileList = fs.readdirSync(v2JsPath).filter((i) => checkReg.test(i))
  if (fileList.length === 0) {
    return
  }
  let count = 0
  for (const fileName of fileList) {
    try {
      const filePath = path.join(v2JsPath, fileName)
      const module = await import('file:///' + filePath)
      if (!module.rule) {
        continue
      }
      const name = fileName.replace(checkReg, '')
      for (const [ruleName, rule] of Object.entries(module.rule)) {
        const ruleKey = `${name}:${ruleName}`
        const handler = module[ruleName]
        if (typeof handler !== 'function') {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error(`请先export该方法：${ruleName}`)
        }
        v2Apps.push({...rule, key: ruleKey, handler})
        count++
      }
    } catch (error) {
      logger.error(`载入V2插件报错：${fileName}`)
      console.error(error)
    }
  }
  logger.info(`成功载入了${count}个V2插件`)
  if (count > 0) {
    registerV2App(v2Apps)
  }
}
