const passport = require('passport')

module.exports = {

  friendlyName: 'Passport - Facebook.',

  inputs: {
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function (inputs, exits) {
    passport.authenticate('facebook', { scope: ['email']})(this.req, this.req.res, this.req.next)
  }
}
