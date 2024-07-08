import {_paths} from '#paths'
import path from 'path'

/**
 * 导入模块，可以使用根路径
 */
export function importRoot(modulePath) {
  // 如果是 / 开头，表示根路径
  if (modulePath.startsWith('/')) {
    const filePath = path.join(_paths.root, modulePath.substring(1))
    return import('file:///' + filePath)
  }
  return import(modulePath)
}