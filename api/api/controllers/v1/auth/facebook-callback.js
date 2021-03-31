const passport = require('passport')

module.exports = {

  friendlyName: 'Passport - Facebook callback.',

  inputs: {
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {
    passport.authenticate('facebook', async (error, user) => {
      if (error) {
        sails.log.error(error)
        return this.req.res.redirect(`${process.env.PANEL_URL}/#/facebook-auth-error`)
      }

      if (!user) {
        return this.req.res.redirect(`${process.env.PANEL_URL}/#/facebook-auth-error`)
      }

      const id = user.id.toString()

      try {
        const gameUrl = await sails.helpers.gameUrlByUserId(id, 'facebook', `${[user.first_name, user.last_name].join(' ')}`)
        return this.req.res.redirect(`${process.env.PANEL_URL}/#/panel/verify?game=${gameUrl}`)
      } catch (error) {
        if (error) {
          sails.log.error(error)
        }
      }

      return this.req.res.redirect(`${process.env.PANEL_URL}/#/facebook-auth-error`)
    })(this.req, this.req.res, this.req.next);
  }
}
