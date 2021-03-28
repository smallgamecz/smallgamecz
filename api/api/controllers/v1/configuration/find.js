const JSend = require('jsend')
const faker = require('faker')

module.exports = {

  friendlyName: 'Find configuration value.',

  inputs: {
    name: {
      type: 'string'
    },
    select: {
      type: 'string',
      defaultsTo: 'name,value'
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
        select: inputs.select.split(','),
        limit: inputs.limit
      }

      if (inputs.name) {
        options.where = {
          name: inputs.name
        }
      } else {
        // make sure limit is off because we need all records
        delete options.limit
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
