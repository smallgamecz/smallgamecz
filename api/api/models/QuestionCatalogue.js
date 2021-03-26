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
    url: {
      type: 'string',
      required: true
    },
    image_base64: {
      type: 'string',
      required: true
    },
    count: {
      type: 'number',
      required: true
    }
  },

  indexes: [
    {
      attributes: {
        key: 1
      },
      options: {
        unique: true
      }
    }
  ]
}
