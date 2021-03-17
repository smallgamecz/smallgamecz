import mitt from 'mitt'

export default ({ Vue }) => {
  Vue.prototype.$mitt = mitt()
}
