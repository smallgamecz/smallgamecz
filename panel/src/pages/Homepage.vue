<template>
  <q-page>
    <div class="fixed-center text-center">
      <div>
        <img src="/logo/favicon_1024_1024.png" alt="Hraj!" width="300">
      </div>
      <div class="row q-col-gutter-sm">
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
        <div class="col-12 text-left relative-position">
          <q-chip class="absolute-center bg-white" data-nosnippet>
            nebo vstupte přes
          </q-chip>
          <q-separator color="secondary" class="q-mt-md q-mb-md" />
        </div>
        <div class="col-12 text-left">
          <div class="row q-col-gutter-sm justify-center">
            <div v-if="$store.state.configuration['login.facebook'] * 1" class="col-xs-12 col-md-4">
              <q-btn
                label="Facebook"
                class="full-width"
                color="primary"
                outline
                :icon="`img:${icons.facebook}`"
                @click="loginVia('facebook')"
              />
            </div>
            <div v-if="$store.state.configuration['login.linkedin'] * 1" class="col-xs-12 col-md-4">
              <q-btn
                label="LinkedIn"
                class="full-width"
                color="primary"
                outline
                :icon="`img:${icons.linkedin}`"
                @click="loginVia('linkedin')"
              />
            </div>
            <div v-if="$store.state.configuration['login.twitter'] * 1" class="col-xs-12 col-md-4">
              <q-btn
                label="Twitter"
                class="full-width"
                color="primary"
                outline
                :icon="`img:${icons.twitter}`"
                @click="loginVia('twitter')"
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
import icons from '../helpers/social-icons'

export default {
  name: 'HomepageComponent',
  data () {
    return {
      showLoginSuccess: false,
      facebookAppId: '',
      gameUrl: '',
      showFacebook: false,
      APP_API_URL,
      icons
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
      window.location.href = `${this.APP_API_URL}/v1/auth/${provider}`
    }
  }
}
</script>
