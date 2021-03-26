module.exports = {

  friendlyName: 'Get remote content',

  description: '',

  inputs: {
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

        const account = sails.config.question.repository.smallgame

        client.get(url, {
          auth: `${Buffer.from(account.username + ':' + account.password)}`,
          headers: {
            'user-agent': 'smallgame.cz/1.0'
          }
        }, (resp) => {
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
      const data = JSON.parse(buf.toString('utf-8'))
      const content = Buffer.from(data.content, 'base64').toString('utf-8')
      const questions = JSON.parse(content).questions

      return exits.success(questions)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }

      return exits.badRequest()
    }
  }
}
