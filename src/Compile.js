import {Watcher} from "./Watcher";

export class Compile {
  constructor(el, vm) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el
    this.vm = vm

    // 创建一个fragment来渲染dom结构
    const fragment = this.node2fragment(this.el)
    this.compile(fragment)
    this.el.appendChild(fragment)
  }

  node2fragment(node) {
    let frag = document.createDocumentFragment()
    let childNodes = node.childNodes

    Array.from(childNodes).forEach(node => {
      frag.appendChild(node)
    })

    return frag
  }

  compile(fragment) {
    Array.from(fragment.childNodes).forEach(node => {

      if (node.nodeType === 1) {
        Array.from(node.attributes).forEach(attr => {

          let attrName = attr.name
          let expr = attr.value

          // v-html, v-model
          if (attrName.includes('v-')) {
            let [, key] = attrName.split('-')
            CompileUtils[key](node, this.vm, expr)
          }

          // @click
          if (attrName.includes('@')) {
            let [, type] = attrName.split('@')
            CompileUtils.eventHandle(node, this.vm, type, expr)
          }
        })
      }
    })
  }
}

let CompileUtils = {

  // 解析model
  model(node, vm, expr) {
    node.value = vm.$data[expr]

    node.addEventListener('input', e => {
      vm.$data[expr] = e.target.value
    })

    new Watcher(vm, expr, newValue => {
      node.value = newValue
    })
  },

  // 解析html
  html(node, vm, expr) {
    node.innerHTML = vm.$data[expr]

    new Watcher(vm, expr, newValue => {
      node.innerHTML = newValue
    })
  },

  // 处理事件
  eventHandle(node, vm, event, expr) {
    let fn = vm.$methods[expr]
    node.addEventListener(event, fn.bind(vm))
  }
}