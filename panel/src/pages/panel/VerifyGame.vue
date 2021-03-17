<template>
  <q-page padding>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>

export default {
  name: 'PageVerifyGame',
  data () {
    return {
      game: null,
      loading: true
    }
  },
  computed: {
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
        this.loading = true

        this.$sailsIo.socket.get(`/v1/game/verify/${this.gameUrl}`, (response) => {
          if (!response) {
            return this.$router.replace({
              name: 'game.404'
            })
          }

          this.loading = false

          this.game = response.data

          this.$router.replace({
            name: 'panel.dashboard',
            params: {
              id: this.game.id
            }
          })
        })
      } catch (error) {
        this.loading = false

        console.error(error)

        return this.$router.replace({
          name: 'game.404'
        })
      }
    }
  }
}
</script>
