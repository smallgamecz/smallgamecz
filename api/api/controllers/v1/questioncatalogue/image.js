const JSend = require('jsend')

module.exports = {

  friendlyName: 'Get image based on catalogue key.',

  inputs: {
    key: {
      type: 'string',
      required: true
    }
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    },
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {
    try {
      // find round first
      const questionCatalogueItem = await QuestionCatalogue.findOne({
        key: inputs.key
      })

      if (!questionCatalogueItem) {
        return exits.notFound()
      }

      this.req.res.type('png')
      const image = Buffer.from(questionCatalogueItem.image_base64, 'base64')

      return exits.success(image)
    } catch (error) {
      if (error) {
        sails.log.error(error)
      }
    }

    return exits.badRequest()
  }
}
