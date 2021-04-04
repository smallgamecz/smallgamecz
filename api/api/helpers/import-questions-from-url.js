module.exports = {

  friendlyName: 'Import questions from URL.',

  description: '',

  inputs: {
    gameId: {
      type: 'string',
      required: true
    },
    url: {
      type: 'string',
      required: true
    },
    limit: {
      type: 'number',
      defaultsTo: 100
    },
    fromEncyclopedy: {
      type: 'boolean',
      defaultsTo: false
    }
  },

  exits: {
    badRequest: {}
  },

  fn: async function (inputs, exits) {
    try {
      let questions = _.map(sails.helpers.shuffleArray(await sails.helpers.remoteContent(inputs.url)), q => {
        q.game = inputs.gameId

        return q
      })

      // take max 100 questions
      if (inputs.limit) {
        questions = questions.slice(0, inputs.limit)
      }

      // we cannot use "createEach" because of possible duplicates
      for (const q of questions) {
        if (inputs.fromEncyclopedy) {
          q.fromEncyclopedy = true
        }

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
