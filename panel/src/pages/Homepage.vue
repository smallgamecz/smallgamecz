<template>
  <q-page>
    <div class="text-right q-ma-md">
      <a href="https://github.com/danielrataj/smallgamecz" title="GitHub" target="_blank">
        <img src="~/assets/icons/github.svg" width="20" height="20" />
      </a>
    </div>
    <div class="fixed-center text-center">
      <div>
        <img src="/logo/favicon_1024_1024.png" alt="logo" width="300">
      </div>
      <div>
        <q-btn
          type="a"
          :to="{ name: 'game.create' }"
          label="Vytvořit hru"
          class="full-width"
          color="primary"
          outline
        />
      </div>
    </div>
  </q-page>
</template>

<script>

export default {
  name: 'HomepageComponent',
  created () {
    this.$store.dispatch('stats/event', {
      client: this.$sailsIo,
      event: 'visit',
      data: {
        category: 'homepage'
      }
    })
  }
}
</script>
