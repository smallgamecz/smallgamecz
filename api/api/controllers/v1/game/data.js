const JSend = require('jsend')

module.exports = {

  friendlyName: 'Get data about the game from remote repository',

  inputs: {
    // game id
    repository: {
      type: 'string',
      required: true
    }
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {
    const cacheKey = `repository.${inputs.repository}`
    try {
      const cache = await sails.helpers.cache()
      let data = cache.get(cacheKey)

      if (!data) {
        data = await sails.helpers.remoteContent(inputs.repository)
        cache.set(cacheKey, data)
      }

      return exits.success(JSend.success({
        content: JSON.parse(data)
      }))
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }

      return exits.badRequest()
    }
  }
}
