/**
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    title: {
      type: 'string',
      required: true
    },
    answer: {
      type: 'ref',
      required: true
    },
    help: {
      type: 'string',
      required: true
    },
    active: {
      type: 'boolean',
      defaultsTo: false
    },
    used: {
      type: 'boolean',
      defaultsTo: false
    },
    position: {
      type: 'number',
      defaultsTo: 0
    },
    player: {
      type: 'number',
      defaultsTo: 0 // 1st or 2nd player
    },
    winner: {
      type: 'number',
      defaultsTo: -1 // 1st or 2nd player, or "0" in case nobody is a winner, default is "-1" which means nothing
    },
    game: {
      model: 'game',
      required: true
    },
    // if entered, belongs is part of existing round
    round: {
      model: 'round'
    },
    timer: {
      type: 'number',
      defaultsTo: 0
    },
    fromEncyclopedy: {
      type: 'boolean',
      defaultsTo: false
    }
  },

  indexes: [
    {
      attributes: {
        title: 1,
        game: 1
      },
      options: {
        unique: true
      }
    }
  ]
}
