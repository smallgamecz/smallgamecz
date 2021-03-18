const JSend = require('jsend')

module.exports = {

  friendlyName: 'Select question.',

  inputs: {
    round: {
      type: 'string',
      required: true
    },
    question: {
      type: 'string',
      required: true
    },
    position: {
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

  fn: async function ({ round, question, position }, exits) {
    try {
      const foundedRound = await Round.findOne({
        id: round
      })

      if (!foundedRound) {
        return exits.notFound()
      }

      const questionItem = await Question.updateOne({
        id: question
      }).set({
        active: true,
        position
      })

      if (this.req.isSocket) {
        sails.log(`Broadcasting 'round.select.question' to round '${foundedRound.id}'`)
        sails.sockets.broadcast(foundedRound.id, 'round', {
          action: 'round.select.question',
          state: true,
          question: questionItem
        })
      }

      return exits.success(JSend.success(questionItem))
    } catch (error) {
      sails.log.error(error)
      return exits.badRequest()
    }
  }
}
