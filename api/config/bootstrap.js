const cron = require('node-cron')

/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function (done) {
  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return done();
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  const cleanRoundsWithoutGame = async function () {
    sails.log('[clean-rounds-without-game][START]')
    await sails.helpers.cleanRoundsWithoutGame()
    sails.log('[clean-rounds-without-game][DONE]')
  }

  const cleanRoundMovesWithoutRound = async function () {
    sails.log('[clean-round-moves-without-round][START]')
    await sails.helpers.cleanRoundMovesWithoutRound()
    sails.log(`[clean-round-moves-without-round][DONE]`)
  }

  cron.schedule('0 */3 * * *', async () => {
    await cleanRoundsWithoutGame()
    await cleanRoundMovesWithoutRound()
  })

  // setup round types in case they do not exist yet
  for (const key in sails.config.round.type) {
    try {
      const roundtype = sails.config.round.type[key]
      roundtype.key = key

      await RoundType.findOrCreate({
        key: roundtype.key
      }, roundtype)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }
      // do nothing
    }
  }

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)
  return done()
}
