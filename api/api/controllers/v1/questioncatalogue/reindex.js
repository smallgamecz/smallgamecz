const JSend = require('jsend')

module.exports = {

  friendlyName: 'Reindex question topics.',

  inputs: {
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (_, exits) {
    try {
      await sails.helpers.refreshQuestionRepositories()

      return exits.success(true)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }
    }

    return exits.badRequest()
  }
}
