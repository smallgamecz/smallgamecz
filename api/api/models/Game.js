/**
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const { nanoid } = require('nanoid')

module.exports = {
  attributes: {
    name: {
      type: 'string'
    },
    url: {
      type: 'string',
      defaultsTo: ''
    },
    userId: {
      type: 'string' // simulate "login"
    },
    network: {
      type: 'string'
    },
    rounds: {
      collection: 'round',
      via: 'game'
    },
    // timestamp
    lastSeen: {
      type: 'number',
      columnType: 'datetime',
      defaultsTo: Date.now()
    }
  },

  indexes: [
    {
      attributes: {
        url: 1
      },
      options: {
        unique: true
      }
    }
  ],

  beforeCreate (criteria, proceed) {
    // create a custom URL, generated by random string
    criteria.url = nanoid(100)

    return proceed()
  },

  async afterDestroy (record, proceed) {
    await Question.destroy({
      game: record.id
    })

    // Do not delete rounds because of "populate" feature. They already have "null".
    // So we have to delete it with cron.

    return proceed()
  }
}
