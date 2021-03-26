module.exports = {

  friendlyName: 'Remove all rounds without a game.',

  description: '',

  inputs: {
  },

  exits: {

  },

  fn: async function (_, exits) {
    sails.log('[clean-rounds-without-game][START]')

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
      sails.log('[clean-rounds-without-game][DONE]')

      return exits.success(true)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }
    }

    sails.log('[clean-rounds-without-game][DONE]')

    return exits.success(false)
  }
}
