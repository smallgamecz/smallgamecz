<template>
  <q-page>
    <div class="fixed-center text-center">
      <div>
        <img src="/logo/favicon_1024_1024.png" alt="logo" width="300">
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
          <q-chip class="absolute-center bg-white">
            nebo použijte
          </q-chip>
          <q-separator color="secondary" class="q-mt-md q-mb-md" />
        </div>
        <div class="col-12 text-left">
          <div class="row q-col-gutter-sm justify-center">
            <div v-if="$store.state.configuration['login.facebook'] * 1" class="col-xs-12 col-md-6">
              <q-btn
                label="Facebook"
                class="full-width"
                color="primary"
                outline
                :icon="`img:${icons.facebook}`"
                @click="loginVia('facebook')"
              />
            </div>
            <div v-if="$store.state.configuration['login.linkedin'] * 1" class="col-xs-12 col-md-6">
              <q-btn
                label="LinkedIn"
                class="full-width"
                color="primary"
                outline
                :icon="`img:${icons.linkedIn}`"
                @click="loginVia('linkedin')"
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
      APP_API_URL,
      icons: {
        linkedIn: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDEwMDAgMTAwMDsiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDEwMDAgMTAwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojMDA3OEI1O30KCS5zdDF7ZmlsbDojRkZGRkZGO30KPC9zdHlsZT48dGl0bGUvPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01MDAsMTAwMEw1MDAsMTAwMEMyMjMuOSwxMDAwLDAsNzc2LjEsMCw1MDBsMCwwQzAsMjIzLjksMjIzLjksMCw1MDAsMGwwLDBjMjc2LjEsMCw1MDAsMjIzLjksNTAwLDUwMGwwLDAgICBDMTAwMCw3NzYuMSw3NzYuMSwxMDAwLDUwMCwxMDAweiIvPjxnPjxnPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xODQuMiwzODcuM2gxMzIuOXY0MjcuN0gxODQuMlYzODcuM3ogTTI1MC43LDE3NC43YzQyLjUsMCw3NywzNC41LDc3LDc3LjFzLTM0LjUsNzcuMS03Nyw3Ny4xICAgICBjLTQyLjYsMC03Ny4xLTM0LjUtNzcuMS03Ny4xQzE3My41LDIwOS4zLDIwOCwxNzQuNywyNTAuNywxNzQuNyIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00MDAuNSwzODcuM0g1Mjh2NTguNGgxLjhjMTcuNy0zMy42LDYxLTY5LjEsMTI1LjgtNjkuMWMxMzQuNiwwLDE1OS41LDg4LjYsMTU5LjUsMjAzLjd2MjM0LjdINjgyLjJWNjA3LjEgICAgIGMwLTQ5LjctMC45LTExMy40LTY5LjEtMTEzLjRjLTY5LjIsMC03OS44LDU0LTc5LjgsMTA5Ljh2MjExLjZINDAwLjVWMzg3LjN6Ii8+PC9nPjwvZz48L2c+PC9zdmc+',
        facebook: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDEwMDAgMTAwMDsiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDEwMDAgMTAwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojM0I1NzlEO30KCS5zdDF7ZmlsbDojRkZGRkZGO30KPC9zdHlsZT48dGl0bGUvPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01MDAsMTAwMEw1MDAsMTAwMEMyMjMuOSwxMDAwLDAsNzc2LjEsMCw1MDB2MEMwLDIyMy45LDIyMy45LDAsNTAwLDBoMGMyNzYuMSwwLDUwMCwyMjMuOSw1MDAsNTAwdjAgICBDMTAwMCw3NzYuMSw3NzYuMSwxMDAwLDUwMCwxMDAweiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik02MzAsMTAwMFY2MTIuN2gxMzBsMTkuNS0xNTAuOUg2MzB2LTk2LjRjMC00My43LDEyLjEtNzMuNSw3NC44LTczLjVsNzkuOSwwVjE1NyAgIGMtMTMuOC0xLjgtNjEuMy01LjktMTE2LjUtNS45Yy0xMTUuMiwwLTE5NC4xLDcwLjMtMTk0LjEsMTk5LjV2MTExLjNIMzQzLjh2MTUwLjloMTMwLjNWMTAwMEg2MzB6IiBpZD0iZiIvPjwvZz48L3N2Zz4='
      }
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
        case 'linkedin':
          window.location.href = `${this.APP_API_URL}/v1/auth/linkedin`
          break
      }
    }
  }
}
</script>
