const JSend = require('jsend')

module.exports = {

  friendlyName: 'Verify game.',

  inputs: {
    url: {
      type: 'string',
      required: true
    }
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function ({ url }, exits) {
    const game = await Game.findOne({
      url
    })

    if (!game) {
      return exits.notFound()
    }

    return exits.success(JSend.success({
      id: game.id,
      name: game.name
    }))
  }
}
