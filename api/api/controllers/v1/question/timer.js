const JSend = require('jsend')

module.exports = {

  friendlyName: 'Set timer to question.',

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    timer: {
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

  fn: async function ({ id, timer }, exits) {
    try {
      const question = await Question.updateOne({
        id
      }).set({
        timer
      })

      // broadcast
      if (this.req.isSocket) {
        sails.log(`Broadcasting 'round.timer' to round '${question.round}'`)
        sails.sockets.broadcast(question.round, 'round', {
          action: 'round.timer',
          round: question.round,
          timer
        })
      }
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }

      return exits.badRequest()
    }

    return exits.success(JSend.success(true))
  }
}
