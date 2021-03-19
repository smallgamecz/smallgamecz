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
      return exits.success(data)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }

      return exits.badRequest()
    }
  }
}
