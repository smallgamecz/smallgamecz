const JSend = require('jsend')
var https = require('https')

module.exports = {

  friendlyName: 'Create a demo game.',

  inputs: {
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (_, exits) {
    try {
      const game = await Game.create({
        demo: true,
        name: "DEMO"
      }).fetch()

      let data = ''

      https.get(sails.config.demo.questions.url, (resp) => {
        resp.on('data', (chunk) => {
          data += chunk
        })

        resp.on('end', async () => {
          const source = JSON.parse(data)

          // round
          for (let demoRound of sails.config.demo.rounds) {
            demoRound.game = game.id

            const createdRound = await Round.create(demoRound).fetch()

            // find round with populated type
            const foundedRound = await Round.findOne({
              id: createdRound.id
            }).populate('type')

            const questionsToCreate =  source.questions.slice(0, foundedRound.type.questions)

            for (const q of questionsToCreate) {
              q.round = foundedRound.id
              q.game = game.id
              await Question.create(q)
            }
          }

          return exits.success(JSend.success(game))
        })
      }).on('ęrror', err => {
        if (err) {
          sails.log.error(err)
        }

        return exits.badRequest()
      })
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }

      return exits.badRequest()
    }

  }
}
