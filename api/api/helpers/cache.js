const NodeCache = require('node-cache')
const myCache = new NodeCache({
  stdTTL: 60 * 15 // 15 minutes
})

module.exports = {

  friendlyName: 'Cache',

  description: '',

  inputs: {
  },

  exits: {
    badRequest: {}
  },

  fn: async function (_, exits) {
    return exits.success(myCache)
  }
}
