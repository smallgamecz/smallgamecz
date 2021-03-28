const passport = require('passport')

module.exports = {

  friendlyName: 'Passport - LinkedIn.',

  inputs: {
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function (inputs, exits) {
    passport.authenticate('linkedin')(this.req, this.req.res, this.req.next)
  }
}
