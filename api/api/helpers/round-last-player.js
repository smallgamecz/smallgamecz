module.exports = {

  friendlyName: 'Who is the last player.',

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
    let who = 0

    try {
      const moves = await RoundMove.find({
        round: roundId
      }).sort('move', 'ASC')

      if (moves.length) {
        who = moves[moves.length - 1].player === 1 ? 2 : 1 // switch positions
      }
    } catch (error) {
      if (error) {
        // just log, do nothing else
        sails.log.error(error)
      }
    }


    return exits.success(who)
  }
}
