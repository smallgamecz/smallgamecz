<template>
  <q-page padding>
    <div class="window-height row justify-center q-col-gutter-md">
      <div class="col-xs-12 col-sm-6 col-md-4" v-if="activeBox === '' || activeBox === 'new'">
        <q-card>
          <q-card-section>
            <h1 class="text-h5 q-ma-none" v-if="layout.default">
              <q-icon name="gamepad" /> Nová hra
            </h1>
            <h1 class="text-h5 q-ma-none" v-if="!layout.default">
              <q-icon name="done" /> Nová hra je připravena
            </h1>
          </q-card-section>

          <q-separator inset />

          <q-card-section v-if="layout.default" class="use-min-height">
            Kliknutím na tlačítko níže vytvoříte novou hru. Do ní pak můžete přidávat otázky a vytvářet soutěžní kola.
          </q-card-section>

          <q-card-section v-if="!layout.default">
            Vytvořili jsme vám novou hru.
            Uložte si odkaz, pod kterým bude vaše hra vždy dostupná.
            V případě, že odkaz zapomenete, není možné se ke hře dostat.
            <br>
            <q-input
              :value="getUrl"
              readonly
            />
          </q-card-section>

          <q-separator inset />

          <q-card-actions>
            <q-btn v-if="layout.default" class="bg-primary text-white full-width" @click="newGame">nová hra</q-btn>
            <q-btn
              v-if="!layout.default"
              class="bg-primary text-white full-width"
              @click="enterGame"
            >vstoupit do hry</q-btn>
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-4" v-if="activeBox === '' || activeBox === 'demo'">
        <q-card>
          <q-card-section>
            <h1 class="text-h5 q-ma-none" v-if="layout.default">
              <q-icon name="gamepad" /> DEMO hra
            </h1>
            <h1 class="text-h5 q-ma-none" v-if="!layout.default">
              <q-icon name="done" /> Hra je připravena
            </h1>
          </q-card-section>

          <q-separator inset />

          <q-card-section v-if="layout.default" class="use-min-height">
            Kliknutím na tlačítko vytvoříte vytvoříte DEMO hru, která bude připravena hned ke hraní.
            Z kapacitních důvodů jsou však tyto hry každých několik hodin smazány.
          </q-card-section>

          <q-card-section v-if="!layout.default">
            Vytvořili jsme vám novou DEMO hru.
            Uložte si odkaz, pod kterým bude vaše hra vždy dostupná.
            V případě, že odkaz zapomenete, není možné se ke hře dostat.
            <br>
            <q-input
              :value="getUrl"
              readonly
            />
          </q-card-section>

          <q-separator inset />

          <q-card-actions>
            <q-btn v-if="layout.default" class="bg-accent text-white full-width" @click="demoGame">nové DEMO</q-btn>
            <q-btn
              v-if="!layout.default"
              class="bg-primary text-white full-width"
              @click="enterGame"
            >vstoupit do hry</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <q-inner-loading :showing="loading.create">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>

export default {
  name: 'CreateGameComponent',
  data () {
    return {
      loading: {
        create: false
      },
      layout: {
        default: true
      },
      game: null,
      activeBox: ''
    }
  },
  computed: {
    getUrl () {
      return `${window.location.origin}/#/panel/verify?game=${this.game.url}`
    }
  },
  methods: {
    newGame () {
      this.activeBox = 'new'
      this.game = null
      this.layout.default = true

      this.loading.create = true

      try {
        this.$sailsIo.socket.post('/v1/game', (result) => {
          this.loading.create = false

          if (!result) {
            return this.$router.replace({
              name: 'error.500'
            })
          }

          this.game = result

          this.layout.default = false
        })
      } catch (error) {
        this.loading.create = false

        if (error) {
          console.error(error)
        }
      }
    },

    demoGame () {
      this.activeBox = 'demo'
      this.game = null
      this.layout.default = true
      this.loading.create = true

      try {
        this.$sailsIo.socket.post('/v1/game/demo', (result) => {
          this.loading.create = false

          if (typeof result !== 'object' || !result.data) {
            return this.$router.replace({
              name: 'error.500'
            })
          }

          this.game = result.data

          this.layout.default = false
        })
      } catch (error) {
        this.loading.create = false

        if (error) {
          console.error(error)
        }
      }
    },

    enterGame () {
      window.location.href = this.getUrl
    }
  }
}
</script>

<style lang="sass" scoped>
  .use-min-height
    min-height: 130px
</style>
