const JSend = require('jsend')

module.exports = {

  friendlyName: 'Backup the game.',

  inputs: {
    // game id
    id: {
      type: 'string',
      required: true
    }
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function ({ id }, exits) {
    try {
      const data = {}

      data.questions = await Question.find({
        game: id
      })

      data.questions = _.map(data.questions, q => {
        delete q.id
        delete q.createdAt
        delete q.updatedAt
        delete q.game
        delete q.active
        delete q.used
        delete q.position
        delete q.player
        delete q.winner
        delete q.timer
        delete q.round

        return q
      })

      return exits.success(data)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }

      return exits.badRequest()
    }
  }
}
