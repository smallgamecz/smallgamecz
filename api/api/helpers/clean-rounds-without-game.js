module.exports = {

  friendlyName: 'Remove all rounds without a game.',

  description: '',

  inputs: {
  },

  exits: {

  },

  fn: async function (_, exits) {
    try {
      const r = await Round.destroy({
        game: null
      }).meta({
        fetch: true
      })

      if (r.length) {
        sails.log(`[clean-rounds-without-game][info] Founded ${r.length} record(-s).`)
      } else {
        sails.log(`[clean-rounds-without-game][info] No round without an active game to clean.`)
      }
      return exits.success(true)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }
    }

    return exits.success(false)
  }
}
