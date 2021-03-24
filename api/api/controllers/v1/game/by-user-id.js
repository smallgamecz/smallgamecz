const JSend = require('jsend')

module.exports = {

  friendlyName: 'Find the game by user ID.',

  inputs: {
    // game id
    id: {
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
      const game = await sails.helpers.gameUrlByUserId(inputs.id)

      return exits.success(JSend.success({
        game
      }))
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }
    }

    return exits.badRequest()
  }
}
