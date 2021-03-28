<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
require('animate.css')

export default {
  name: 'App',
  data () {
    return {
      sockets: {
        round: false
      }
    }
  },
  created () {
    this.$store.commit('configuration/setApiUrl', process.env.APP_API_URL)
    this.$store.commit('configuration/setApiToken', process.env.API_TOKEN)

    this.sockets.round = true

    this.$sailsIo.socket.on('round', (data) => {
      this.$mitt.emit('round', data)
    })

    this.fetchConfig()
  },
  methods: {
    fetchConfig () {
      try {
        this.$sailsIo.socket.get('/v1/configuration', response => {
          if (typeof response === 'object' && response) {
            for (const config of response) {
              this.$store.commit('configuration/set', {
                name: config.name,
                value: config.value
              })
            }
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
