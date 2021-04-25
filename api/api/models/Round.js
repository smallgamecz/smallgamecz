/**
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const TYPE_TRIANGLE_28 = 'triangle28'

module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    mode: {
      type: 'string',
      defaultsTo: sails.config.round.mode.round
    },
    type: {
      model: 'roundType'
    },
    player1: {
      type: 'string',
      required: true
    },
    player2: {
      type: 'string',
      required: true
    },
    running: {
      type: 'boolean',
      defaultsTo: false
    },
    winner: {
      type: 'number',
      defaultsTo: -1 // "-1" means nobody yet, otherwise "1"st or "2"nd player
    },
    game: {
      model: 'game'
    },
    questions: {
      collection: 'question',
      via: 'round'
    },
    moves: {
      collection: 'roundMove',
      via: 'round'
    },
    code: {
      type: 'string',
      defaultsTo: ''
    }
  },

  async beforeCreate (data, proceed) {
    if (!data.type) {
      // find default type
      const roundType = await RoundType.findOne({
        key: TYPE_TRIANGLE_28
      })

      data.type = roundType.id
    }

    data.code = await sails.helpers.getRoomEnterCode()

    return proceed()
  },

  async beforeDestroy (criteria, proceed) {
    // delete related records first
    await Question.update({
      round: criteria.id,
      winner: {
        in: [0, 1, 2]
      }
    }).set({
      used: false,
      winner: -1,
      timer: 0,
      active: false,
      player: 0,
      position: 0,
      round: null
    })

    // delete moves as well
    await RoundMove.destroy({
      round: criteria.id
    })

    return proceed()
  }
}
