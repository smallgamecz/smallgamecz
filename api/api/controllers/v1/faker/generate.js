const JSend = require('jsend')
const faker = require('faker')

module.exports = {

  friendlyName: 'Generate fake data.',

  inputs: {
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (_, exits) {
    const gameItems = []
    let i = 0
    for (i = 0; i <= faker.random.number({
      min: 10,
      max: 30
    }); i++) {
      gameItems.push(
        {
          name: faker.lorem.words(faker.random.number({
            min: 1,
            max: 3
          }))
        }
      )
    }

    try {
      await Game.destroy({})
      await Game.createEach(gameItems)

      sails.log(`Games created (${gameItems.length}).`)
    } catch (error) {
      sails.log.error(error)
      return exits.badRequest()
    }

    const games = await Game.find({})
    const questions = []
    const roundItems = []

    for (const game of games) {
      // create rounds
      let ii = 0
      for (ii = 0; ii <= faker.random.number({
        min: 1,
        max: 2
      }); ii++) {
        roundItems.push(
          {
            name: faker.lorem.words(faker.random.number({
              min: 1,
              max: 3
            })),
            player1: `${faker.name.firstName()} ${faker.name.lastName()}`,
            player2: `${faker.name.firstName()} ${faker.name.lastName()}`,
            game: game.id
          }
        )
      }

      // questions
      let iii = 0
      for (iii = 0; iii <= faker.random.number({
        min: 80,
        max: 150
      }); iii++) {
        questions.push(
          {
            title: faker.random.words(faker.random.number({
              min: 5,
              max: 10
            })) + '?',
            answer: faker.lorem.words(faker.random.number({
              min: 2,
              max: 5
            })),
            help: faker.random.alpha({
              upcase: true,
              count: faker.random.number({
                min: 1,
                max: 3
              })
            }),
            game: game.id
          }
        )
      }
    }

    try {
      await Question.destroy({})
      await Question.createEach(questions)
      sails.log(`Questions created (${questions.length}).`)

      await RoundMove.destroy({})

      await Round.destroy({})
      await Round.createEach(roundItems)

      sails.log(`Rounds created (${gameItems.length}).`)
    } catch (error) {
      sails.log.error(error)
      return exits.badRequest()
    }

    return exits.success(JSend.success(true))
  }
}
