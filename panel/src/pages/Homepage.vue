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
        <div class="col-12" v-if="facebookAppId">
          <div class="row">
            <div class="col-12">
              <q-btn
                label="pokračovat přes Facebook"
                class="full-width"
                color="primary"
                outline
                @click="showFacebook = !showFacebook"
              />
            </div>
            <div class="col-12 q-pt-md" v-if="showFacebook">
              <facebook-login
                v-if="!gameUrl"
                :appId="facebookAppId"
                label="přihlášení přes Facebook"
                logoutLabel="odhlásit z Facebooku"
                @login="getUserData"
                @get-initial-status="getUserData"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <success-login :show="showLoginSuccess" />
  </q-page>
</template>

<script>
/* eslint-disable */
import facebookLogin from 'facebook-login-vuejs'
import SuccessLogin from '../components/SuccessLogin'

export default {
  name: 'HomepageComponent',
  components: {
    facebookLogin,
    SuccessLogin
  },
  data () {
    return {
      showLoginSuccess: false,
      facebookAppId: '',
      gameUrl: '',
      showFacebook: false
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

    this.getFacebookAppId()
  },
  methods: {
    getFacebookAppId () {
      try {
        this.$sailsIo.socket.get('/v1/configuration', {
          name: 'facebook.appId',
          select: 'value',
          limit: 1
        }, response => {
          this.facebookAppId = response[0].value
        })
      } catch (error) {
        if (error) {
          console.error(error)
        }
      }
    },
    getUserData (data) {
      try {
        let userID = data.userID

        if (!userID && data.authResponse) {
          userID = data.authResponse.userID
        }

        if (!userID) {
          return false
        }

        this.$sailsIo.socket.get(`/v1/game/by-user-id/${userID}`, response => {
          if (response.data && response.data.game) {
            this.showLoginSuccess = true
            this.gameUrl = response.data.game
            setTimeout(() => {
              window.location.href = `${window.location.origin}/#/panel/verify?game=${this.gameUrl}`
            }, 2000)
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
