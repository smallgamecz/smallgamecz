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
      questions = questions.slice(0, 100)

      // we cannot use "createEach" because of possible duplicates
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
