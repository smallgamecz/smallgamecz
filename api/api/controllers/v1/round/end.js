const JSend = require('jsend')

module.exports = {

  friendlyName: 'End round.',

  inputs: {
    round: {
      type: 'string',
      required: true
    },
    winner: {
      type: 'number',
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

  fn: async function ({ round, winner }, exits) {
    try {
      // find round first
      const foundedRound = await Round.findOne({
        id: round
      })

      if (!foundedRound) {
        return exits.notFound()
      }

      await Round.update({
        id: round
      }).set({
        winner: winner,
        running: false
      })

      // unblock all questions that has not been selected to other round
      await Question.update({
        round: round,
        used: false
      }).set({
        round: null,
        active: false,
        player: 0,
        winner: -1,
        position: 0
      })
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }
      return exits.badRequest()
    }

    if (this.req.isSocket) {
      sails.log(`Broadcasting 'round.end' to round '${round}'`)
      sails.sockets.broadcast(round, 'round', {
        action: 'round.end',
        round: round
      })

      // leave the room
      sails.sockets.leave(this.req, round, (err) => {
        if (err) {
          return exits.badRequest()
        }

        sails.log(`User round ended so leaving round ID '${round}'.`)
      })
    }

    return exits.success(JSend.success({
      round, winner
    }))
  }
}
