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
    await sails.helpers.cleanRoundsWithoutGame()
  }

  const cleanRoundMovesWithoutRound = async function () {
    await sails.helpers.cleanRoundMovesWithoutRound()
  }

  const cleanGamesWithoutRoundsLastVisitWeek = async function () {
    await sails.helpers.cleanGamesWithoutRoundsLastVisitWeek()
  }

  const refreshQuestionRepositories = async function () {
    await sails.helpers.refreshQuestionRepositories()
  }

  cron.schedule('0 0 * * *', async () => {
    await cleanRoundsWithoutGame()
    await cleanRoundMovesWithoutRound()
    await cleanGamesWithoutRoundsLastVisitWeek()
    await refreshQuestionRepositories()
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
