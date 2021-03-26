const JSend = require('jsend')
const faker = require('faker')

module.exports = {

  friendlyName: 'Find configuration value.',

  inputs: {
    name: {
      type: 'string',
      required: true
    },
    select: {
      type: 'string',
      defaultsTo: 'value'
    },
    limit: {
      type: 'number',
      defaultsTo: 1
    }
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {
    try {
      const options = {
        where: {
          name: inputs.name
        },
        select: inputs.select.split(','),
        limit: inputs.limit
      }

      const items = await Configuration.find(options).decrypt()

      return exits.success(items)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }
    }

    return exits.success(JSend.success(true))
  }
}
