const JSend = require('jsend')

module.exports = {

  friendlyName: 'Round types, options.',

  inputs: {
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {
    try {
      const roundTypes = await RoundType.find({})
      return exits.success(JSend.success(roundTypes))
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }
    }

    return exits.badRequest()
  }
}
