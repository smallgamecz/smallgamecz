const JSend = require('jsend')

module.exports = {

  friendlyName: 'Verify round by code.',

  inputs: {
    code: {
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

  fn: async function (inputs, exits) {
    try {
      const code = inputs.code

      const round = await Round.findOne({
        code
      })

      if (!round) {
        return exits.notFound()
      }

      return exits.success(round)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }

      return exits.badRequest()
    }
  }
}
