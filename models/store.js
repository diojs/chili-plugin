// noinspection NpmUsedModulesInstalled
import lodash from 'lodash'

/**
 * 存储注册的 v2 app
 */
let V2AppStore = []

export function registerV2App(v2Apps) {
  V2AppStore.push(...v2Apps)
  // noinspection JSUnresolvedReference
  V2AppStore = lodash.orderBy(V2AppStore, ['priority'], ['asc'])
}

export function getV2Apps() {
  return V2AppStore
}

/**
 * 存储注册的 apps+
 * key = appName
 * value = appPath
 * @type {Map<string, string>}
 */
const AppsPushStore = new Map()

/**
 * 注册 app+
 * @param appName
 * @param options
 */
export function registerAppPlus(appName, options) {
  AppsPushStore.set(appName, options)
}

/**
 * 获取所有可更新的 apps+
 */
export function getAllUpdateAppsPlus() {
  if (AppsPushStore.size === 0) {
    return []
  }
  return [...AppsPushStore.values()].filter((options) => options.update)
}
