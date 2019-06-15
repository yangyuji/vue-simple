import { Dep } from './Watcher.js'

export class Observer {
  constructor(data){
    this.data = data

    Object.keys(data).forEach(key => {
      // 这个地方用一个方法封装防止进入 getter 死循环
      this.defineReactive(data, key, data[key])
    })
  }


  defineReactive(obj, key, value) {
    // 为每一个data对象创建一个发布者
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 防止重复创建监听
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set(newValue) {
        // 修改data对象的值
        value = newValue
        // 通知所有使用的地方
        dep.notify()
      }
    })
  }
}
