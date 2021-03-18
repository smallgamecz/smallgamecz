const JSend = require('jsend')

module.exports = {

  friendlyName: 'Setup round.',

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    game: {
      type: 'string'
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

  fn: async function ({ id, game }, exits) {
    const result = {}

    try {
      // start round
      const round = await Round.findOne({
        id,
        game
      }).populate('questions')

      if (!round) {
        return exits.notFound()
      }

      result.round = round

      if (round.winner === -1) {
        // who's is in turn
        result.round.whoPlays = await sails.helpers.roundLastPlayer(round.id)
      } else {
        result.round.whoPlays = -1
      }

      // join room
      if (this.req.isSocket) {
        sails.sockets.join(this.req, round.id, (err) => {
          if (err) {
            return exits.badRequest()
          }

          sails.log(`User joined round ID, event '${round.id}'.`)
        })
      }

      return exits.success(JSend.success(result))
    } catch (error) {
      sails.log.error(error)
      return exits.badRequest()
    }
  }
}
