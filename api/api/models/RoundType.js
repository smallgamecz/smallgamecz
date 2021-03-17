/**
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    key: {
      type: 'string',
      required: true,
      unique: true
    },
    name: {
      type: 'string',
      required: true
    },
    questions: {
      type: 'number',
      required: true
    }
  }
}
