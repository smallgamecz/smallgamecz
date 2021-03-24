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
          <facebook-login
            :appId="facebookAppId"
            loginLabel="nebo vstoupit přes Facebook"
            @login="getUserData"
            @get-initial-status="getUserData">
          </facebook-login>
        </div>
      </div>
    </div>
    <success-login :show="showLogin" />
  </q-page>
</template>

<script>
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
      showLogin: false,
      facebookAppId: ''
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
      if (data.response) {
        if (data.response.status === 'connected') {
          if (data.response.authResponse && data.response.authResponse.userID) {
            const userId = data.response.authResponse.userID

            try {
              this.$sailsIo.socket.get(`/v1/game/by-user-id/${userId}`, response => {
                if (response.data && response.data.game) {
                  this.showLogin = true
                  setTimeout(() => {
                    window.location.href = `${window.location.origin}/#/panel/verify?game=${response.data.game}`
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
    }
  }
}
</script>
