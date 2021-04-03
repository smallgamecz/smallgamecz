<template>
  <q-page :class="pageBgColor">
    <div class="fixed-center text-center" :class="textColor">
      <q-icon :name="isTie ? 'gesture' : 'emoji_events'" style="font-size: 10em" />
      <br>
      <h1 class="text-h2 q-ma-none">
        <template v-if="isTie">
          remíza
        </template>
        <template v-else>
          {{ player }}
        </template>
      </h1>
    </div>

  </q-page>
</template>

<script>
export default {
  name: 'PagePanelWinner',
  computed: {
    winner () {
      return this.$route.query.winner * 1
    },
    player () {
      return this.$route.query.player
    },
    isTie () {
      return this.winner === 0
    },
    textColor () {
      const color = 'text-white'
      return color
    },
    pageBgColor () {
      let color = ''

      if (this.winner === 1) {
        color = 'bg-blue'
      }

      if (this.winner === 2) {
        color = 'bg-orange'
      }

      if (this.isTie) {
        color = 'bg-black'
      }

      return color
    }
  },
  created () {
    this.fetchRound()
  },
  methods: {
    fetchRound () {
      try {
        this.$sailsIo.socket.get(`/v1/round/${this.$route.params.round}`, {
          game: this.$route.params.id
        }, (response) => {
          if (!response) {
            return this.$router.replace({
              name: 'round.404'
            })
          }
        })
      } catch (error) {
        if (error) {
          console.error(error)
        }
      }
    }
  }
}
</script>
