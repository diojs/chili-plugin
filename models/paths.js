import path from 'path'

/** 插件实际所在的目录名 */
export const pluginName = path.basename(path.join(import.meta.url, '../../'))

const _path = process.cwd()
export const _paths = initPaths()

function initPaths() {
  const pluginRoot = path.join(_path, 'plugins', pluginName)

  return {
    // Bot根目录
    root: _path,

    // 插件根目录
    pluginRoot,

    resolveDirname,
  }
}

function resolveDirname(url) {
  if (url.startsWith('file:///')) {
    url = url.substring(8)
  }
  if (url.startsWith('file://')) {
    url = url.substring(7)
  }
  return path.resolve(path.dirname(url))
}
