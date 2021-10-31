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
      console.log('user', user)
      console.log('error', error)
      if (error) {
        sails.log.error(error)
        return this.req.res.redirect(`${process.env.PANEL_URL}/#/twitter-auth-error`)
      }

      if (!user) {
        console.log('no user')
        return this.req.res.redirect(`${process.env.PANEL_URL}/#/twitter-auth-error`)
      }

      const id = user.id.toString()

      console.log(`user id: ${id}`)

      try {
        const gameUrl = await sails.helpers.gameUrlByUserId(id, 'twitter', `${user.displayName}`)
        console.log(`game URL: ${gameUrl}`)
        return this.req.res.redirect(`${process.env.PANEL_URL}/#/panel/verify?game=${gameUrl}`)
      } catch (error) {
        if (error) {
          sails.log.error(error)
        }
      }

      console.log('uknown error')

      return this.req.res.redirect(`${process.env.PANEL_URL}/#/twitter-auth-error`)
    })(this.req, this.req.res, this.req.next);
  }
}
