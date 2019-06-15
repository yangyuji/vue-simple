
export class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.callback = cb

    Dep.target = this

    this.oldValue = this.vm.$data[expr]

    Dep.target = null
  }

  update () {
    let oldValue = this.oldValue
    let newValue = this.vm.$data[this.expr]
    if (oldValue !== newValue) {
      this.callback(newValue, oldValue)
    }
  }
}

export class Dep {
  constructor() {
    this.subs = []
  }

  addSub(watcher) {
    this.subs.push(watcher)
  }

  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}