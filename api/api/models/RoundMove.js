/**
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    round: {
      model: 'round'
    },
    move: {
      type: 'number',
      required: true
    },
    // 1st or 2nd
    player: {
      type: 'number',
      required: true
    }
  }
}
