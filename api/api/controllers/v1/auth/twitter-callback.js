const passport = require('passport')

module.exports = {

  friendlyName: 'Passport - Twitter callback.',

  inputs: {
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {
    passport.authenticate('twitter', async (error, user) => {
      if (error) {
        sails.log.error(error)
        return this.req.res.redirect(`${process.env.PANEL_URL}/#/twitter-auth-error`)
      }

      if (!user) {
        return this.req.res.redirect(`${process.env.PANEL_URL}/#/twitter-auth-error`)
      }

      const id = user.id.toString()

      try {
        const gameUrl = await sails.helpers.gameUrlByUserId(id, `${user.displayName}`)
        return this.req.res.redirect(`${process.env.PANEL_URL}/#/panel/verify?game=${gameUrl}`)
      } catch (error) {
        if (error) {
          sails.log.error(error)
        }
      }

      return this.req.res.redirect(`${process.env.PANEL_URL}/#/twitter-auth-error`)
    })(this.req, this.req.res, this.req.next);
  }
}
