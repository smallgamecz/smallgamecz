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
      <div class="row q-col-gutter-sm justify-center">
        <div class="col-12">
          <q-btn
            type="a"
            :to="{ name: 'game.create' }"
            label="Vytvořit hru"
            class="full-width"
            color="primary"
            outline
          />
        </div>
        <div class="col-12">
          <div class="row">
            <div class="col-12">
              <q-btn
                label="pokračovat přes Facebook"
                class="full-width"
                color="primary"
                outline
                @click="loginVia('facebook')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
const APP_API_URL = process.env.APP_API_URL

export default {
  name: 'HomepageComponent',
  data () {
    return {
      showLoginSuccess: false,
      facebookAppId: '',
      gameUrl: '',
      showFacebook: false,
      APP_API_URL
    }
  },
  created () {
    this.$store.dispatch('stats/event', {
      client: this.$sailsIo,
      event: 'visit',
      data: {
        category: 'homepage'
      }
    })
  },
  methods: {
    loginVia (provider) {
      switch (provider) {
        case 'facebook':
          window.location.href = `${this.APP_API_URL}/v1/auth/facebook`
          break
      }
    }
  }
}
</script>
