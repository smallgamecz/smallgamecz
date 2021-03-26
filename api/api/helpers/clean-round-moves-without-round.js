module.exports = {

  friendlyName: 'Remove all round moves without a round.',

  description: '',

  inputs: {
  },

  exits: {

  },

  fn: async function (_, exits) {
    sails.log('[clean-round-moves-without-round][START]')

    try {
      const r = await RoundMove.destroy({
        round: null
      }).meta({
        fetch: true
      })

      if (r.length) {
        sails.log(`[clean-round-moves-without-round][info] Founded ${r.length} record(-s).`)
      } else {
        sails.log(`[clean-round-moves-without-round][info] No round moves without an active round to clean.`)
      }

      sails.log(`[clean-round-moves-without-round][DONE]`)

      return exits.success(true)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }
    }

    sails.log(`[clean-round-moves-without-round][DONE]`)

    return exits.success(false)
  }
}
