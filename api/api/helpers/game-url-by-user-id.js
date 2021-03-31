module.exports = {

  friendlyName: 'Get game url based on associated user id - like Facebook login.',

  description: '',

  inputs: {
    userId: {
      type: 'string'
    },
    network: {
      type: 'string',
      required: true
    },
    gameName: {
      type: 'string'
    }
  },

  exits: {
  },

  fn: async function (inputs, exits) {
    try {
      const game = await Game.findOrCreate({
        userId: inputs.userId,
        network: inputs.network
      }, {
        userId: inputs.userId,
        name: inputs.gameName,
        network: inputs.network
      })

      if (!game) {
        return exits.success(false)
      }

      return exits.success(game.url)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }
    }

    return exits.success(false)
  }
}
