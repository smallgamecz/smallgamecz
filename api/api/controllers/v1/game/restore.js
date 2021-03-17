const JSend = require('jsend')

module.exports = {

  friendlyName: 'Restore game data.',

  inputs: {
    // game id
    id: {
      type: 'string',
      required: true
    },
    data: {
      type: 'ref',
      required: true
    }
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {
    try {
      const data = inputs.data

      const questions = _.map(data.questions, q => {
        q.game = inputs.id

        return q
      })

      // create all questions - do not delete the rest
      for (const q of questions) {
        await Question.create(q).tolerate('E_UNIQUE')
      }

      return exits.success(true)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }

      return exits.badRequest()
    }
  }
}
