<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
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
    this.$store.commit('config/setApiUrl', process.env.APP_API_URL)
    this.$store.commit('config/setApiToken', process.env.API_TOKEN)

    this.sockets.round = true

    this.$sailsIo.socket.on('round', (data) => {
      this.$mitt.emit('round', data)
    })
  }
}
</script>
