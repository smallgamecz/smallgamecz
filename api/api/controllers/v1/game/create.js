const JSend = require('jsend')

module.exports = {

  friendlyName: 'Create a new game.',

  inputs: {
    // game id
    source: {
      type: 'string'
    }
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {
    try {
      const game = await Game.create().fetch()

      // if source is specified, import questions
      if (inputs.source) {
        await sails.helpers.importQuestionsFromUrl(game.id, inputs.source)
      }

      return exits.success(game)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }

      return exits.badRequest()
    }
  }
}
