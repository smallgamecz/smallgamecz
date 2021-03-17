const JSend = require('jsend')

module.exports = {

  friendlyName: 'Pause round.',

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
        running: false
      })

      if (this.req.isSocket) {
        console.log(`Broadcasting 'round.pause' to round '${round.id}'`)
        sails.sockets.broadcast(round.id, 'round', {
          action: 'round.pause',
          round: 'round'
        })
      }

      // leave the room
      sails.sockets.leave(this.req, round.id, (err) => {
        if (err) {
          return exits.badRequest()
        }

        console.log(`User paused and leaved round ID '${round.id}'.`)
      })

      return exits.success(JSend.success(round))
    } catch (error) {
      sails.log.error(error)
      return exits.badRequest()
    }
  }
}
