module.exports = {

  friendlyName: 'Import questions from URL.',

  description: '',

  inputs: {
    gameId: {
      type: 'string',
      required: true
    },
    url: {
      type: 'string',
      required: true
    }
  },

  exits: {
    badRequest: {}
  },

  fn: async function (inputs, exits) {
    const httpGet = function (url) {
      return new Promise((resolve, reject) => {
        const http = require('http')
        const https = require('https')

        let client = http

        if (url.toString().indexOf('https') === 0) {
          client = https
        }

        client.get(url, (resp) => {
          let chunks = []

          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            chunks.push(chunk)
          })

          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            resolve(Buffer.concat(chunks))
          })

        }).on("error", (err) => {
          reject(err)
        })
      })
    }

    try {
      const buf = await httpGet(inputs.url)
      const data = buf.toString('utf-8')

      let questions = _.map(sails.helpers.shuffleArray(JSON.parse(data).questions), q => {
        q.game = inputs.gameId

        return q
      })

      // take always 100 questions
      questions =  questions.slice(0, 100)

      // we cannot use "createEach" because of possible duplicates
      for (const q of questions) {
        await Question.create(q).tolerate('E_UNIQUE')
      }

      return exits.success(true)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }

      return exits.badRequest()
    }
  }
}
