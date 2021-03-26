const JSend = require('jsend')

module.exports = {

  friendlyName: 'Start round.',

  inputs: {
    id: {
      type: 'string',
      required: true
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

  fn: async function ({ id }, exits) {
    try {
      // find round first
      const foundedRound = await Round.findOne({
        id
      })

      if (!foundedRound) {
        return exits.notFound()
      }

      const round = await Round.updateOne({
        id
      }).set({
        running: true
      })

      // find all moves
      const roundMoves = await RoundMove.find({
        round: round.id
      })

      // no move yet, so select player first
      if (!roundMoves.length) {
        await sails.helpers.roundRandomFirstPlayer(
          round.id
        )
      }

      if (this.req.isSocket) {
        sails.log(`Broadcasting 'round.start' to round '${round.id}'`)
        sails.sockets.broadcast(round.id, 'round', {
          action: 'round.start',
          round: round.id
        })
      }

      return exits.success(JSend.success(round))
    } catch (error) {
      sails.log.error(error)
      return exits.badRequest()
    }
  }
}
