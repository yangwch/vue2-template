import mmbsList from './mmbsList'

const components = [
  mmbsList
]

export default {
  install (Vue) {
    components.map(item => {
      Vue.component(item.name, item)
    })
  }
}
