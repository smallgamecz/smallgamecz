const JSend = require('jsend')

module.exports = {

  friendlyName: 'Index',

  description: 'Index page.',

  inputs: {},

  exits: {
    wrongStatus: {
      responseType: `wrongStatus`
    }
  },

  fn: async function (_, exits) {
    let hasError = false
    let db = false

    try {
      await Game.find({})
      db = true
    } catch (err) {
      if (err) {
        hasError = true
      }
    }

    if (hasError) {
      return exits.wrongStatus(status)
    }

    let status = {
      db
    }

    return exits.success(JSend.success(status))
  }
}
