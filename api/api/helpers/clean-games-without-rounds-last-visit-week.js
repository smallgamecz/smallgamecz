module.exports = {

  friendlyName: 'Remove all games without a rounds with last visit older than 1 week.',

  description: '',

  inputs: {
  },

  exits: {

  },

  fn: async function (_, exits) {
    try {
      const date = new Date()
      date.setDate(date.getDate() - 7)

      const games = await Game.find({
        lastSeen: {
          '<': date
        }
      }).populate('rounds')

      let counter = 0

      if (games.length) {
        for (const g of games) {
          if (!g.rounds.length) {
            await Game.destroy({
              id: g.id
            })
            ++counter
          }
        }
      }

      if (counter) {
        sails.log(`[clean-games-without-rounds-last-visit-week][info] Founded ${counter} record(-s).`)
      } else {
        sails.log(`[clean-games-without-rounds-last-visit-week][info] No game rounds without an active round to clean.`)
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
