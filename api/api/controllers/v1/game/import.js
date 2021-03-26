const JSend = require('jsend')

module.exports = {

  friendlyName: 'Import game data.',

  inputs: {
    // game id
    id: {
      type: 'string',
      required: true
    },
    url: {
      type: 'string',
      required: true
    }
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {
    try {
      await sails.helpers.importQuestionsFromUrl(inputs.id, inputs.url)

      return exits.success(true)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }

      return exits.badRequest()
    }
  }
}
