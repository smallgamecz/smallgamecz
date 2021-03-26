<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-8">
        <template v-if="!game">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <h1 class="text-h6">
                Vyberte sadu otázek, se kterou chcete začít.
              </h1>
            </div>
            <div class="col-12">
              <list-of-topics :showEmptyValue="true" @source="importFromUrl" />
            </div>
          </div>
        </template>
        <div v-else class="row q-col-gutter-md">
          <div class="col-12">
            <h1 class="text-h6">
              Díky moc. Hru jsme vám vytvořili.
            </h1>
            <p>
              Uložte si odkaz, pod kterým bude správa vaší hra vždy dostupná. V případě, že odkaz zapomenete, není možné se ke hře dostat.
            </p>
            <p>
              <q-btn
                :data-clipboard-text="this.getUrl"
                icon="content_copy"
                class="copy"
              >
                zkopírovat do schránky
                <q-tooltip>kliknutím zkopírujete do schránky</q-tooltip>
              </q-btn>
            </p>
          </div>
          <div class="col-12 text-center q-mt-xl">
            <q-btn
              icon="login"
              size="5em"
              round
              color="accent"
              @click="enterGame"
            >
              <q-tooltip>vstoupit do hry</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>
    <q-inner-loading :showing="loading.import">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import ClipboardJS from 'clipboard'
import ListOfTopics from '../components/ListOfTopics'

export default {
  name: 'CreateGameComponent',
  components: {
    ListOfTopics
  },
  data () {
    return {
      loading: {
        import: false
      },
      game: null
    }
  },
  computed: {
    getUrl () {
      return `${window.location.origin}/#/panel/verify?game=${this.game.url}`
    }
  },
  created () {
    this.$store.dispatch('stats/event', {
      client: this.$sailsIo,
      event: 'game.create',
      data: {
        action: 'catalogue.view',
        game: this.game && this.game.url && this.game.url.length > 0
      }
    })
  },
  mounted () {
    // eslint-disable-next-line
    new ClipboardJS('.copy')
  },
  methods: {
    async importFromUrl (source) {
      try {
        this.loading.import = true
        const params = {}

        if (source) {
          params.source = source
        }

        this.$store.dispatch('stats/event', {
          client: this.$sailsIo,
          event: 'game.create',
          data: {
            action: 'catalogue.import',
            source: params.source || ''
          }
        })

        this.$sailsIo.socket.post('/v1/game', params, response => {
          this.loading.import = false

          if (!response || typeof response !== 'object') {
            this.$smallgame.negative({
              message: 'Momentálně není možné hru vytvořit. Zkuste to prosím za chvilku znovu.'
            })
            return false
          }

          this.game = response
        })
      } catch (error) {
        this.loading.import = false

        console.error(error)
        this.$smallgame.negative({
          message: 'Momentálně není možné hru vytvořit. Zkuste to prosím za chvilku znovu.'
        })
      }
    },

    enterGame () {
      window.location.href = this.getUrl
    }
  }
}
</script>
