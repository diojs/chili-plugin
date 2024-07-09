import plugin from '../../../lib/plugins/plugin.js'

class MyPlugin extends plugin {
  constructor(options) {

    // 规范插件名
    options.name = `绝云椒椒:${options.name}`

    super(options)
  }
}

export {
  MyPlugin as plugin,
  plugin as yzPlugin,
}

/**
 * App+
 */
export class AppPlus extends plugin {

  constructor(options) {
    super(options)
  }

  get isTRSS() {
    return false // todo
  }
}
