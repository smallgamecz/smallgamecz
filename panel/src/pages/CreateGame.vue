<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-8">
        <div v-if="!game" class="row q-col-gutter-md">
          <div class="col-12">
            <h1 class="text-h6">
              Vyberte sadu otázek, se kterou chcete začít.
            </h1>
          </div>
          <div class="col-12 text-right">
            <q-btn outline @click="importFromUrl()">mám vlastní otázky</q-btn>
          </div>
          <div
            v-for="category in categories" :key="category.id"
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card class="cursor-pointer" @click="importFromUrl(category.url)">
              <q-img
                :src="`${baseUrl}/${category.image}`"
              >
                <div class="absolute-bottom text-subtitle2 text-center">
                  {{ category.title }}
                </div>
              </q-img>
            </q-card>
          </div>
        </div>
        <div v-else class="row q-col-gutter-md">
          <div class="col-12">
            <h1 class="text-h6">
              Díky moc. Hru jsme vám vytvořili.
            </h1>
            <p>
              Uložte si odkaz, pod kterým bude správa vaší hra vždy dostupná. V případě, že odkaz zapomenete, není možné se ke hře dostat.
            </p>
            <p>
              <a :href="this.getUrl">
                {{ this.getUrl }}
              </a>
            </p>
            <p>
              <q-btn @click="enterGame">Pokračovat do hry</q-btn>
            </p>
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
import topics from '../helpers/import-questions'

export default {
  name: 'CreateGameComponent',
  data () {
    return {
      loading: {
        import: false
      },
      game: null,
      categories: topics.categories,
      baseUrl: topics.baseUrl
    }
  },
  computed: {
    getUrl () {
      return `${window.location.origin}/#/panel/verify?game=${this.game.url}`
    }
  },
  methods: {
    async importFromUrl (source) {
      try {
        this.loading.import = true
        const params = {}

        if (source) {
          params.source = `${this.baseUrl}/${source}`
        }

        this.$sailsIo.socket.post('/v1/game', params, response => {
          console.log(response)
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

<style lang="sass" scoped>
  .use-min-height
    min-height: 130px
</style>
