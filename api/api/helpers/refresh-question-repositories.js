const axios = require('axios')

module.exports = {

  friendlyName: 'Refresh question repositories',

  description: '',

  inputs: {
  },

  exits: {
    badRequest: {}
  },

  fn: async function (_, exits) {
    sails.log('[refesh-question-repositories][START]')

    const repository = sails.config.question.repository.smallgame
    const blobEndpoint = repository.blobEndpoint
    const graphqlUrl = repository.graphql.url
    const username = repository.username
    const password = repository.password
    const graphqlQueryForSha1 = {
      query: repository.graphql.query
    }

    // get sha-1 of the index file
    try {
      sails.log(`[refesh-question-repositories][INFO][start] Getting sha1 of the index file.`)

      const graphqlResultData = await axios.post(graphqlUrl, graphqlQueryForSha1, {
        auth: {
          username,
          password
        }
      }).then(res => res.data)

      sails.log(`[refesh-question-repositories][INFO][done] Getting sha1 of the index file.`)

      sails.log(`[refesh-question-repositories][INFO][start] Getting file blob.`)

      const fileBlob = await axios.get(`${blobEndpoint}/${graphqlResultData.data.repository.object.oid}`, {
        auth: {
          username,
          password
        },
        responseType: 'blob'
      }).then(response => response.data)

      sails.log(`[refesh-question-repositories][INFO][done] Getting file blob.`)

      const encodedOutut = Buffer.from(fileBlob.content, 'base64').toString('utf8')
      const data = JSON.parse(encodedOutut)

      // delete all records in question catalogue first
      sails.log(`[refesh-question-repositories][INFO][start] Removing all records from question catalogue table.`)
      await QuestionCatalogue.destroy({})
      sails.log(`[refesh-question-repositories][INFO][done] Removing all records from question catalogue table.`)

      sails.log(`[refesh-question-repositories][INFO][start] Adding new repositories to question catalogue table.`)

      for (const category of data.categories) {
        category.key = category.id
        delete category.id

        await QuestionCatalogue.create(category)
      }

      sails.log(`[refesh-question-repositories][INFO][done] Adding new repositories to question catalogue table.`)

      sails.log(`[refesh-question-repositories][DONE]`)
      return exits.success(true)

    } catch (error) {
      sails.log.error(error)
    }

    sails.log(`[refesh-question-repositories][DONE]`)

    return exits.success(false)
  }
}
