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
                :icon="`img:${icons.linkedIn}`"
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
        facebook: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDEwMDAgMTAwMDsiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDEwMDAgMTAwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojM0I1NzlEO30KCS5zdDF7ZmlsbDojRkZGRkZGO30KPC9zdHlsZT48dGl0bGUvPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01MDAsMTAwMEw1MDAsMTAwMEMyMjMuOSwxMDAwLDAsNzc2LjEsMCw1MDB2MEMwLDIyMy45LDIyMy45LDAsNTAwLDBoMGMyNzYuMSwwLDUwMCwyMjMuOSw1MDAsNTAwdjAgICBDMTAwMCw3NzYuMSw3NzYuMSwxMDAwLDUwMCwxMDAweiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik02MzAsMTAwMFY2MTIuN2gxMzBsMTkuNS0xNTAuOUg2MzB2LTk2LjRjMC00My43LDEyLjEtNzMuNSw3NC44LTczLjVsNzkuOSwwVjE1NyAgIGMtMTMuOC0xLjgtNjEuMy01LjktMTE2LjUtNS45Yy0xMTUuMiwwLTE5NC4xLDcwLjMtMTk0LjEsMTk5LjV2MTExLjNIMzQzLjh2MTUwLjloMTMwLjNWMTAwMEg2MzB6IiBpZD0iZiIvPjwvZz48L3N2Zz4=',
        twitter: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9IkxheWVyXzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDEwMDAgMTAwMDsiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDEwMDAgMTAwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojMURBMUYyO30KCS5zdDF7ZmlsbDojRkZGRkZGO30KCS5zdDJ7ZmlsbDpub25lO30KPC9zdHlsZT48dGl0bGUvPjxnPjxnIGlkPSJEYXJrX0JsdWUiPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01MDAsMEw1MDAsMGMyNzYuMSwwLDUwMCwyMjMuOSw1MDAsNTAwdjBjMCwyNzYuMS0yMjMuOSw1MDAtNTAwLDUwMGgwQzIyMy45LDEwMDAsMCw3NzYuMSwwLDUwMHYwICAgIEMwLDIyMy45LDIyMy45LDAsNTAwLDB6Ii8+PC9nPjxnIGlkPSJMb2dvX0ZJWEVEIj48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzg0LDc1NGMyMzUuOCwwLDM2NC45LTE5NS40LDM2NC45LTM2NC45YzAtNS41LDAtMTEuMS0wLjQtMTYuNmMyNS4xLTE4LjIsNDYuOC00MC42LDY0LTY2LjQgICAgYy0yMy40LDEwLjQtNDguMiwxNy4yLTczLjYsMjAuMmMyNi44LTE2LDQ2LjgtNDEuMiw1Ni40LTcwLjljLTI1LjIsMTQuOS01Mi43LDI1LjUtODEuNCwzMS4xYy00OC42LTUxLjYtMTI5LjgtNTQuMS0xODEuNC01LjYgICAgYy0zMy4zLDMxLjMtNDcuNCw3OC0zNy4xLDEyMi41Yy0xMDMuMS01LjItMTk5LjItNTMuOS0yNjQuMy0xMzRjLTM0LDU4LjYtMTYuNywxMzMuNSwzOS43LDE3MS4yYy0yMC40LTAuNi00MC40LTYuMS01OC4yLTE2ICAgIGMwLDAuNSwwLDEuMSwwLDEuNmMwLDYxLDQzLDExMy42LDEwMi45LDEyNS43Yy0xOC45LDUuMS0zOC43LDUuOS01Ny45LDIuMmMxNi44LDUyLjIsNjQuOSw4OCwxMTkuOCw4OS4xICAgIGMtNDUuNCwzNS43LTEwMS41LDU1LjEtMTU5LjIsNTVjLTEwLjIsMC0yMC40LTAuNi0zMC41LTEuOUMyNDYuMSw3MzQsMzE0LjQsNzU0LDM4NCw3NTMuOSIvPjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik01MDAsMEw1MDAsMGMyNzYuMSwwLDUwMCwyMjMuOSw1MDAsNTAwdjBjMCwyNzYuMS0yMjMuOSw1MDAtNTAwLDUwMGgwQzIyMy45LDEwMDAsMCw3NzYuMSwwLDUwMHYwICAgIEMwLDIyMy45LDIyMy45LDAsNTAwLDB6Ii8+PC9nPjwvZz48L3N2Zz4='
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
      window.location.href = `${this.APP_API_URL}/v1/auth/${provider}`
    }
  }
}
</script>
