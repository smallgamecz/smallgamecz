const APP_API_URL = process.env.APP_API_URL
const API_TOKEN = process.env.API_TOKEN

export default ({ Vue }) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'js/sails.io.js'
    document.getElementsByTagName('head')[0].appendChild(script)

    script.onload = function () {
      window.io.sails.url = APP_API_URL
      window.io.sails.autoConnect = true
      window.io.sails.environment = process.env.NODE_ENV

      window.io.sails.headers = {
        Authorization: `Bearer ${API_TOKEN}`
      }

      Vue.prototype.$sailsIo = window.io

      resolve()
    }
  })
}
