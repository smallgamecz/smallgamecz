module.exports = {

  friendlyName: 'Select random element from array.',

  description: '',

  inputs: {
    items: {
      type: 'ref',
      required: true
    }
  },

  exits: {
  },

  fn: async function ({ items }, exits) {
    const random = items[Math.floor(Math.random() * items.length)]

    return exits.success(random)
  }
}
