import {Observer} from './Observer.js'
import {Compile} from './Compile.js'

class Vue {
  /**
   * data属性进行监听
   * 渲染dom结构
   */
  constructor(option={}) {
    this.$el = option.el
    this.$data = option.data
    this.$methods = option.methods

    new Observer(this.$data)
    new Compile(this.$el, this)
  }
}

window.Vue = Vue