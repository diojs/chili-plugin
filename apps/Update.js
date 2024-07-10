// noinspection NpmUsedModulesInstalled
import lodash from 'lodash'
import {exec} from 'child_process'
import {ChiliPlugin} from '#plugin'
import {getAllUpdateAppsPlus} from '#store'
import {_paths} from '#chili'

const pluginPrefixReg = '(chili|Chili|绝云椒椒|绝云|椒椒|吃梨)'

let updating = false

const CODE = {
  error: -1,
  success: 0,
  upToDate: 1,
}

/**
 * 更新插件
 */
// noinspection JSUnusedGlobalSymbols
export class ChiliUpdate extends ChiliPlugin {
  constructor() {
    super({
      name: '更新',
      dsc: '绝云椒椒插件更新',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: `^#${pluginPrefixReg}(全部)?(强制)?更新(全部)?$`,
          fnc: 'update',
          permission: 'master'
        },
      ]
    })
  }

  async update() {
    if (updating) {
      return this.reply('已有命令更新中..请勿重复操作')
    }
    try {
      updating = true
      let hasUpdate = false
      let ret = await this.runUpdate('Chili-Plugin', _paths.pluginRoot)
      if (ret === CODE.success) {
        hasUpdate = true
      }
      const isAll = this.e.msg.includes('全部')
      if (isAll) {
        // 更新全部插件
        const allAppsPlus = getAllUpdateAppsPlus()
        for (const app of allAppsPlus) {
          ret = await this.runUpdate(app.name, app.path)
          if (ret === CODE.success) {
            hasUpdate = true
          }
        }
        this.reply(`全部更新完成，${hasUpdate ? '请手动重启' : '没有发现更新'}`)
      } else {
        if (hasUpdate) {
          this.reply('更新完成，请手动重启')
        }
      }
    } finally {
      updating = false
    }
  }

  // 执行更新操作
  async runUpdate(typeName, cwd = '') {
    let typeNameB = `「${typeName}」`
    let command = 'git pull --no-rebase'
    let type = '更新'

    const isForce = this.e.msg.includes('强制')
    if (isForce) {
      type = '强制更新'
      command = `git reset --hard && git pull --rebase --allow-unrelated-histories`
    }

    let tipText = `开始${type}${typeNameB}`
    this.logger.mark(tipText)
    await this.reply(tipText)

    const ret = await this.execSync(command, {cwd})

    if (ret.error) {
      this.logger.mark(`更新失败：${typeNameB}`)
      await this.gitErr(ret.error, ret.stdout)
      return CODE.error
    }

    const time = await this.getTime(cwd)
    this.logger.mark(`最后更新时间：${time}`)

    if (/Already[ -]up|已经是最新/i.test(ret.stdout)) {
      await this.reply(`${typeNameB} 已是最新\n最后更新时间：${time}`)
      return CODE.upToDate
    } else {
      await this.reply(`${typeNameB} 更新成功\n更新时间：${time}`)
      return CODE.success
    }
  }

  // 执行命令
  async execSync(cmd, opt) {
    return new Promise((resolve) => {
      exec(cmd, {windowsHide: true, ...opt}, (error, stdout, stderr) => {
        resolve({error, stdout, stderr})
      })
    })
  }

  async getTime(cwd = '') {
    let command = 'git log -1 --pretty=%cd --date=format:"%F %T"'

    let time = ''
    try {
      time = (await this.execSync(command, {encoding: 'utf-8', cwd})).stdout
      time = lodash.trim(time)
    } catch (error) {
      this.logger.error(error.toString())
      time = '获取时间失败'
    }

    return time
  }

  async gitErr(err, stdout) {
    const msg = '更新失败！'
    const errMsg = err.toString()
    stdout = stdout.toString()

    if (errMsg.includes('Timed out')) {
      const remote = errMsg.match(/'(.+?)'/g)[0].replace(/'/g, '')
      return this.reply(`${msg}\n连接超时：${remote}`)
    }

    if (/Failed to connect|unable to access/g.test(errMsg)) {
      const remote = errMsg.match(/'(.+?)'/g)[0].replace(/'/g, '')
      return this.reply(`${msg}\n连接失败：${remote}`)
    }

    if (errMsg.includes('be overwritten by merge')) {
      return this.reply(`${msg}\n存在冲突：\n${errMsg}\n请解决冲突后再更新，或者执行#强制更新，放弃本地修改`)
    }

    if (stdout.includes('CONFLICT')) {
      return this.reply(`${msg}\n存在冲突：\n${errMsg}${stdout}\n请解决冲突后再更新，或者执行#强制更新，放弃本地修改`)
    }

    return this.reply([errMsg, stdout])
  }

}