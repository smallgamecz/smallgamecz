const passport = require('passport')

module.exports = {

  friendlyName: 'Passport - LinkedIn callback.',

  inputs: {
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {
    passport.authenticate('linkedin', async (error, user) => {
      sails.log.error('error', error)
      sails.log.error('user', user)
      if (error) {
        return this.req.res.redirect(`${process.env.PANEL_URL}/#/linkedin-auth-error`)
      }

      if (!user) {
        console.log('no user')
        return this.req.res.redirect(`${process.env.PANEL_URL}/#/linkedin-auth-error`)
      }

      const id = user.id.toString()

      console.log(`user id: ${id}`)

      try {
        const gameUrl = await sails.helpers.gameUrlByUserId(id, 'linkedin', user.displayName)
        console.log(`game url: ${gameUrl}`)
        return this.req.res.redirect(`${process.env.PANEL_URL}/#/panel/verify?game=${gameUrl}`)
      } catch (error) {
        console.log(`no game url`)
        if (error) {
          sails.log.error(error)
        }
      }

      console.log('who knows error')

      return this.req.res.redirect(`${process.env.PANEL_URL}/#/linkedin-auth-error`)
    })(this.req, this.req.res, this.req.next);
  }
}
