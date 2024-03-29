import { Notify } from 'quasar'

export default ({ Vue }) => {
  Vue.prototype.$smallgame = {
    negative ({ message, actions }) {
      Notify.create({
        message,
        color: 'red',
        actions
      })
    },
    positive ({ message, actions }) {
      Notify.create({
        message,
        color: 'positive',
        actions
      })
    }
  }
}
