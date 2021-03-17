const JSend = require('jsend')

module.exports = {

  friendlyName: 'Start round.',

  inputs: {
    round: {
      type: 'string',
      required: true
    },
    question: {
      type: 'string',
      required: true
    },
    player: {
      type: 'number',
      required: true
    },
    result: {
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

  fn: async function (inputs, exits) {
    try {
      // find round first
      const foundedRound = await Round.findOne({
        id: inputs.round
      })

      if (!foundedRound) {
        return exits.notFound()
      }

      // update question
      await Question.updateOne({
        id: inputs.question
      }).set({
        winner: inputs.result ? inputs.player : 0,
        used: true,
        active: false
      })

      // find all moves except situation there is no winner
      const roundMoves = await RoundMove.find({
        round: inputs.round
      })

      // create a round move
      await RoundMove.create({
        round: inputs.round,
        player: inputs.player,
        move: roundMoves.length + 1 // let's hope this count setup works
      })

      if (this.req.isSocket) {
        console.log(`Broadcasting 'round.result' to round '${inputs.round}'`)
        sails.sockets.broadcast(inputs.round, 'round', {
          action: 'round.result',
          round: inputs.round,
          result: inputs.result
        })
      }

      return exits.success(JSend.success(true))
    } catch (error) {
      sails.log.error(error)
      return exits.badRequest()
    }
  }
}
