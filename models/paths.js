import path from 'path'

/** 插件实际所在的目录名 */
export const pluginName = path.basename(path.join(import.meta.url, '../../'))

const _path = process.cwd()
export const _paths = initPaths()

function initPaths() {
  // 插件根目录
  const pluginRoot = path.join(_path, 'plugins', pluginName)

  return {
    // Bot根目录
    root: _path,

    pluginRoot,
  }
}
