const JSend = require('jsend')

module.exports = {

  friendlyName: 'Find questions.',

  inputs: {
    // in case of "findOne"
    id: {
      type: 'string'
    },
    // "game" is not required in case of "findOne" but required in "findAll"
    where: {
      type: 'ref'
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

  fn: async function ({ id, where = {} }, exits) {
    // if "id" not specified, "game" must be presented
    if (!id) {
      if (!where.game) {
        return exits.badRequest("Missing 'game' attribute.")
      }
    }

    try {
      const options = {}

      if (!id) {
        options.game = where.game
      }

      if (id) {
        options.id = id
      }

      if (where.round) {
        if (where.round === 'null') {
          // make sure "null" is really a null
          where.round = null
        }

        options.round = where.round
      }

      let questions = await Question.find(options)

      if (!questions.length) {
        return exits.notFound()
      }

      if (id) {
        // return first item in case of "findOne" (as an object)
        questions = questions[0]
      }

      return exits.success(JSend.success(questions))
    } catch (error) {
      sails.log.error(error)
      return exits.badRequest()
    }
  }
}
