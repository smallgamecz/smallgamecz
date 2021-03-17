module.exports = {

  friendlyName: 'Select first player by rand.',

  description: '',

  inputs: {
    round: {
      type: 'string',
      required: true
    }
  },

  exits: {
  },

  fn: async function ({ round }, exits) {
    try {
      const players = [1, 2]
      const player = players[Math.floor(Math.random() * players.length)]

      await RoundMove.create({
        round,
        move: 1,
        player
      })
    } catch (error) {
      if (error) {
        // log but do nothing else
        sail.log.error(error)
      }
    }

    return exits.success(true)
  }
}
