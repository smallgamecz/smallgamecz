module.exports = {

  friendlyName: 'Remove all round moves without a round.',

  description: '',

  inputs: {
  },

  exits: {

  },

  fn: async function (_, exits) {
    try {
      const r = await RoundMove.destroy({
        round: null
      }).meta({
        fetch: true
      })

      if (r.length) {
        sails.log(`[clean-round-moves-without-round][info] Founded ${r.length} record(-s).`)
      } else {
        sails.log(`[clean-round-moves-without-round][info] No round moves without an active rount to clean.`)
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
