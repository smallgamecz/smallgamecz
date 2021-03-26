module.exports = {

  friendlyName: 'Set next player in the round.',

  description: '',

  inputs: {
    roundId: {
      type: 'string',
      required: true
    }
  },

  exits: {
  },

  fn: async function ({ roundId }, exits) {
    try {
      const moves = await RoundMove.find({
        round: roundId
      })

      let player = 0
      if (moves.length) {
        // found who played last time
        const who = await sails.helpers.roundLastPlayer(roundId)

        // select next player
        player = (who === 1 ? 2 : 1)
      } else {
        // select ranndomly
        player = await sails.helpers.selectRandomFromArray([1, 2])
      }

      await RoundMove.create({
        round: roundId,
        player,
        move: moves.length + 1
      })
      return exits.success(player)
    } catch (error) {
      if (error) {
        // log but do nothing else
        sail.log.error(error)
      }
    }

    return exits.success(0)
  }
}
