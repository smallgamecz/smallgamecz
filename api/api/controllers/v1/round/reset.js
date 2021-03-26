const JSend = require('jsend')

module.exports = {

  friendlyName: 'Reset round.',

  inputs: {
    round: {
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

  fn: async function ({ round }, exits) {
    try {
      // find round first
      const foundedRound = await Round.findOne({
        id: round
      })

      if (!foundedRound) {
        return exits.notFound()
      }

      // update round
      await Round.updateOne({
        id: round
      }).set({
        running: false,
        winner: -1
      })

      // delete moves
      await RoundMove.destroy({
        round: round
      })

      // update all questions
      await Question.update({
        round
      }).set({
        active: false,
        used: false,
        position: 0,
        player: 0,
        winner: -1
      })
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }

      return exits.badRequest()
    }


    if (this.req.isSocket) {
      sails.log(`Broadcasting 'round.reset' to round '${round}'`)
      sails.sockets.broadcast(round, 'round', {
        action: 'round.reset',
        round: round
      })
    }

    return exits.success(JSend.success(true))
  }
}
