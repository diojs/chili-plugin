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

/**
 * 返回当前文件的目录名
 * @param url 当前文件的import.meta.url
 * @param paths 按需拼接的路径
 * @return {string}
 */
function resolveDirname(url, ...paths) {
  if (url.startsWith('file:///')) {
    url = url.substring(8)
  }
  if (url.startsWith('file://')) {
    url = url.substring(7)
  }
  url = path.resolve(path.dirname(url))
  if (Array.isArray(paths) && paths.length > 0) {
    url = path.join(url, ...paths)
  }
  return url
}
