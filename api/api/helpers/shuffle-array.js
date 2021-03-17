module.exports = {

  friendlyName: 'Shuffle items in array.',

  description: '',

  sync: true,

  inputs: {
    source: {
      type: 'ref',
      required: true
    }
  },

  exits: {

  },

  fn: function ({ source }, exits) {
    function shuffle(array) {
      var m = array.length, t, i;

      // While there remain elements to shuffle…
      while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }

      return array;
    }

    return exits.success(shuffle(source))
  }
}
