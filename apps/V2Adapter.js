import lodash from 'lodash'
import {v2Apps} from '../boot/loadV2Apps.js'
import {plugin} from '#plugin'

/**
 * 兼容V2
 */
export class ChiliV2Adapter extends plugin {
  constructor(e) {
    super({
      name: '兼容V2',
      dsc: '兼容V2的单JS插件',
      event: 'message',
      priority: 0,
      rule: [],
      // log: false,
    })
  }

  async accept(e) {
    for (const v2App of v2Apps) {
      let noCheck = !v2App.reg || v2App.reg === 'noCheck'
      let doLog = () => global.logger.mark(`[Chili_V2][${v2App.key}] ${lodash.truncate(e.msg, {length: 12})}`)
      if (noCheck || new RegExp(v2App.reg, 'i').test(e.msg)) {
        noCheck || doLog()
        let res = await v2App.handler(e)
        if (res) {
          noCheck && doLog()
          return 'return'
        }
      }
    }
  }
}
