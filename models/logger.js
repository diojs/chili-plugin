/**
 * 打印日志
 */
export const logger = new Proxy(global.logger, {
  get: function (target, prop, receiver) {
    if (['mark', 'info', 'warn', 'error', 'debug'].includes(prop)) {
      return (function (...msgList) {
        return target[prop](...packageMessage(msgList))
      }).bind(target)
    } else {
      return target[prop]
    }
  }
})

const prefix = '[Chili] '

function packageMessage(msgList) {
  if (msgList.length === 0) {
    return ['']
  }
  if (typeof msgList[0] === 'string') {
    if (msgList[0].startsWith(prefix)) {
      return msgList
    }
    return [prefix, ...msgList]
  } else {
    return [prefix, ...msgList]
  }
}
