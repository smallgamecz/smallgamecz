const passport = require('passport')

module.exports = {

  friendlyName: 'Passport - Twitter.',

  inputs: {
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function (inputs, exits) {
    passport.authenticate('twitter')(this.req, this.req.res, this.req.next)
  }
}
