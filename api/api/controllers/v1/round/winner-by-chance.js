const JSend = require('jsend')

module.exports = {

  friendlyName: 'Select winner by chance.',

  inputs: {
    round: {
      type: 'string',
      required: true
    },
    question: {
      type: 'string',
      required: true
    },
    onlyNotify: {
      type: 'boolean',
      defaultsTo: false
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

  fn: async function ({ round, question, onlyNotify }, exits) {
    if (onlyNotify) {
      // broadcast notification, nothing else
      if (this.req.isSocket) {
        console.log(`Broadcasting 'round.winner.by.chance.start' to round '${round}'`)
        sails.sockets.broadcast(round, 'round', {
          action: 'round.winner.by.chance.start'
        })
      }

      return exits.success(JSend.success(true))
    }

    try {
      const foundedRound = await Round.findOne({
        id: round
      })

      if (!foundedRound) {
        return exits.notFound()
      }

      const players = [1, 2]
      const winner = players[Math.floor(Math.random() * players.length)]

      await Question.updateOne({
        id: question
      }).set({
        winner,
        // no need to set used or active. Already cofigured by "result" endpoint called earlier.
        // used,
        // active
      })

      // find all moves
      const roundMoves = await RoundMove.find({
        round
      })

      const lastplayer = await sails.helpers.roundLastPlayer(round)

      // create a round move
      await RoundMove.create({
        round: round,
        player: lastplayer,
        move: roundMoves.length + 1 // let's hope this count setup works
      })

      if (this.req.isSocket) {
        console.log(`Broadcasting 'round.winner.by.chance.end' to round '${foundedRound.id}'`)
        sails.sockets.broadcast(foundedRound.id, 'round', {
          action: 'round.winner.by.chance.end',
          winner
        })
      }

      return exits.success(JSend.success(foundedRound))
    } catch (error) {
      sails.log.error(error)
      return exits.badRequest()
    }
  }
}
