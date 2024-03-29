module.exports.round = {
  mode: {
    round: 'round',
    finale: 'finale'
  },
  type: {
    triangle28: {
      name: 'trojúhelník, 28 políček',
      questions: 28,
      break: [1, 3, 6, 10, 15, 21]
    },
    triangle15: {
      name: 'trojúhelník, 15 políček',
      questions: 15,
      break: [1, 3, 6, 10]
    },
    square25: {
      name: 'čtverec, 25 políček',
      questions: 25,
      break: [5, 10, 15, 20]
    },
    diamond25: {
      name: 'diamant, 25 políček',
      questions: 25,
      break: [1, 3, 6, 10, 15, 19, 22, 24]
    },
    hourglass29: {
      name: 'přesýpací hodiny, 29 políček',
      questions: 29,
      break: [5, 19, 12, 14, 15, 17, 20, 24]
    }
  }
}
