module.exports = {

  friendlyName: 'Remove all demo games.',

  description: '',

  inputs: {
  },

  exits: {

  },

  fn: async function (_, exits) {
    try {
      const g = await Game.destroy({
        demo: true
      }).meta({
        fetch: true
      })

      if (g.length) {
        sails.log(`[clean-demo-games][info] Cleaning demo games, ${g.length} record(-s).`)
      } else {
        sails.log(`[clean-demo-games][info] There is no demo game to clean.`)
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
