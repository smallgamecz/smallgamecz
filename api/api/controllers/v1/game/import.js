module.exports = {

  friendlyName: 'Import game data.',

  inputs: {
    // game id
    id: {
      type: 'string',
      required: true
    },
    url: {
      type: 'string',
      required: true
    },
    fromEncyclopedy: {
      type: 'boolean',
      defaultsTo: false
    }
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {
    try {
      await sails.helpers.importQuestionsFromUrl(inputs.id, inputs.url, 100, inputs.fromEncyclopedy)

      return exits.success(true)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }

      return exits.badRequest()
    }
  }
}
