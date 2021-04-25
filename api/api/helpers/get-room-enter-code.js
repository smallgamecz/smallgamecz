const { customAlphabet } = require('nanoid')

module.exports = {

  friendlyName: 'Room enter code.',

  description: '',

  // inputs: {
  // },

  exits: {
    badRequest: {}
  },

  fn: async function (_, exits) {
    try {
      let round = null
      let code = null

      do {
        code = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)()

        round = await Round.findOne({
          code
        })
      }
      while (round === null)

      return exits.success(code)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }

      return exits.badRequest()
    }
  }
}
