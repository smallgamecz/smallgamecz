<template>
  <div></div>
</template>

<script>
export default {
  name: 'PageVerifyGame',
  data () {
    return {
      game: null
    }
  },
  computed: {
    loading () {
      return this.$store.state.app.loading
    },
    gameUrl () {
      return this.$route.query.game
    }
  },
  created () {
    if (this.gameUrl) {
      this.verifyGame()
    } else {
      return this.$router.push({
        name: 'game.404'
      })
    }
  },
  methods: {
    verifyGame () {
      try {
        this.$store.commit('app/loading', true)

        this.$sailsIo.socket.get(`/v1/game/verify/${this.gameUrl}`, (response) => {
          this.$store.commit('app/loading', false)

          if (!response) {
            return this.$router.replace({
              name: 'game.404'
            })
          }

          this.game = response.data

          this.$router.replace({
            name: 'panel.dashboard',
            params: {
              id: this.game.id
            }
          })
        })
      } catch (error) {
        this.$store.commit('app/loading', false)

        console.error(error)

        return this.$router.replace({
          name: 'game.404'
        })
      }
    }
  }
}
</script>
