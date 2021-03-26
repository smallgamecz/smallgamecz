import { Howl, Howler } from 'howler'

export default ({ Vue, store }) => {
  Vue.prototype.$sounder = {
    Howler,
    start () {
      if (!store.state.round.sound) {
        return false
      }

      return new Howl({
        src: '/sounds/start.wav',
        autoplay: true
      })
    },
    winner () {
      if (!store.state.round.sound) {
        return false
      }

      return new Howl({
        src: '/sounds/winner.wav',
        autoplay: true
      })
    },
    reward () {
      if (!store.state.round.sound) {
        return false
      }

      return new Howl({
        src: '/sounds/reward.wav',
        autoplay: true
      })
    },
    selectQuestion () {
      if (!store.state.round.sound) {
        return false
      }

      return new Howl({
        src: '/sounds/select-question.wav',
        autoplay: true
      })
    },
    questionWin () {
      if (!store.state.round.sound) {
        return false
      }

      return new Howl({
        src: '/sounds/reward.wav',
        autoplay: true
      })
    },
    questionFail () {
      if (!store.state.round.sound) {
        return false
      }

      return new Howl({
        src: '/sounds/question-fail.wav',
        autoplay: true
      })
    },
    drumheart () {
      if (!store.state.round.sound) {
        return false
      }

      return new Howl({
        src: '/sounds/drumheart.wav',
        autoplay: true
      })
    }
  }
}
