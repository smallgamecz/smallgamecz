const JSend = require('jsend')

module.exports = {

  friendlyName: 'Reserve questions for the round.',

  inputs: {
    round: {
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

  fn: async function ({ round }, exits) {
    // find questions
    try {
      let foundedRound = await Round.findOne({
        id: round
      }).populate('questions').populate('type')

      // "null" in "game" means there is no associated game due to populate() behavior
      if (!foundedRound || !foundedRound.game) {
        return exits.notFound()
      }

      // we already questions in this round
      if (foundedRound.questions.length) {
        return exits.success(JSend.success(true))
      }

      let questions = await Question.find({
        game: foundedRound.game,
        round: null
      })

      // not enough questions
      if (questions.length < foundedRound.type.questions) {
        return exits.badRequest(sails.config.errorCodes.questions.amount)
      }

      questions = _.sampleSize(questions, foundedRound.type.questions)

      // reserve to round
      for (const q of questions) {
        await Question.update({
          id: q.id
        }).set({
          round: foundedRound.id
        })
      }

      // find questions again so we have the entire set
      foundedRound = await Round.findOne({
        id: round
      }).populate('questions').populate('type')

      return exits.success(JSend.success(foundedRound.questions))
    } catch (error) {
      sails.log.error(error)
      return exits.badRequest()
    }
  }
}
