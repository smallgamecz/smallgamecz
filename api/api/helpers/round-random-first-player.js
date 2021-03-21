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
      const player = await sails.helpers.selectRandomFromArray([0, 1])

      await RoundMove.create({
        round,
        move: 1,
        player
      })
    } catch (error) {
      if (error) {
        // log but do nothing else
        sails.log.error(error)
      }
    }

    return exits.success(true)
  }
}
