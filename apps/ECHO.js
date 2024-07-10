import {ChiliPlugin} from '#plugin'

const echoReg = /#ECHO (.+)/i

/**
 * ECHO
 */
export default class ECHO extends ChiliPlugin {

  constructor() {
    super({
      name: "ECHO",
      dsc: "ECHO回音",
      event: "message",
      rule: [
        {
          reg: echoReg,
          fnc: 'echo',
          permission: 'master',
        }
      ]
    })
  }

  async echo() {
    const {msg} = this.e
    const match = msg.match(echoReg)
    return this.reply(match[1])
  }

}
