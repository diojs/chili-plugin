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
