const JSend = require('jsend')

module.exports = {

  friendlyName: 'Check if there is some round already running.',

  inputs: {
    where: {
      type: 'ref'
    }
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    },
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function ({ where }, exits) {
    if (!where.game) {
      return exits.badRequest("Missing 'game' ID attribute.")
    }

    try {
      const round = await Round.findOne({
        running: true,
        game: where.game
      })

      if (round) {
        return exits.success(JSend.success({
          result: true
        }))
      }
    } catch (error) {
      sails.log.error(error)
      return exits.badRequest()
    }

    return exits.success(JSend.success({
      result: false
    }))
  }
}
