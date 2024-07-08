import path from 'path'
import lodash from 'lodash'
import cfg from "#cfg";
import {_paths} from "#paths";

export function supportGuoba() {
  return {
    pluginInfo: {
      name: 'chili-plugin',
      title: '绝云椒椒插件',
      description: '绝云椒椒（亦可称为吃梨）插件',
      author: ['@zolay-poi'],
      authorLink: ['https://gitee.com/zolay-poi'],
      link: 'https://gitee.com/zolay-poi/chili-plugin',
      showInMenu: true,
      icon: 'mdi:stove',
      iconColor: '#66ccff',
      iconPath: path.join(_paths.pluginRoot, 'resources/icon.png'),
    },
    configInfo: {
      schemas: [
        {
          field: 'base.hello',
          label: 'Hello',
          helpMessage: '',
          bottomHelpMessage: '',
          component: 'Input',
          componentProps: {},
        },
      ],
      // 获取配置数据方法（用于前端填充显示数据）
      getConfigData() {
        return cfg.merged
      },
      // 设置配置的方法（前端点确定后调用的方法）
      setConfigData(data, {Result}) {
        let config = {}
        for (let [keyPath, value] of Object.entries(data)) {
          lodash.set(config, keyPath, value)
        }
        config = lodash.merge({}, cfg.merged, config)
        cfg.config.reader.setData(config)
        return Result.ok({}, '保存成功~')
      },
    },
  }
}
