<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div v-if="game && !game.demo" class="col-12">
        <q-chip icon="link">
          <a :href="getUrl">odkaz pro vstup do této sekce</a>
        </q-chip>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-3 col-12">
        <router-link :to="{ name: 'panel.rounds' }">
          <q-card>
            <q-img
              src="~assets/panel/rounds.png"
              basic
            >
              <div class="absolute-bottom text-subtitle2 text-center">
                Soutěžní kola
              </div>
            </q-img>
          </q-card>
        </router-link>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-3 col-12">
        <router-link :to="{ name: 'panel.questions' }">
          <q-card>
            <q-img
              src="~assets/panel/questions.png"
              basic
            >
              <div class="absolute-bottom text-subtitle2 text-center">
                Otázky
              </div>
            </q-img>
          </q-card>
        </router-link>
      </div>
      <div class="col-sm-4 col-md-4 col-lg-3 col-12">
        <router-link :to="{ name: 'panel.rules' }">
          <q-card>
            <q-img
              src="~assets/panel/rules.png"
              basic
            >
              <div class="absolute-bottom text-subtitle2 text-center">
                Pravidla hry
              </div>
            </q-img>
          </q-card>
        </router-link>
      </div>
      <div class="col-12">
        <h6 class="text-h6 q-mb-md">Průvodce</h6>

        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-avatar color="secondary" text-color="white">1</q-avatar>
            </q-item-section>

            <q-item-section>
              Vytvořte soutěžní otázky. Čím více soutěžních otázek vytvoříte, tím více kol můžete hrát.
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-avatar color="secondary" text-color="white">2</q-avatar>
            </q-item-section>

            <q-item-section>
              Přidejte nové soutěžní kolo.
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-avatar color="secondary" text-color="white">3</q-avatar>
            </q-item-section>

            <q-item-section>
              Můžete hrát. Na stránce se soutěžními koli najdete dva odkazy - jeden pro moderátora a druhý pro hráče.
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageDashboardIndex',
  data () {
    return {
      game: null
    }
  },
  created () {
    this.fetch()
  },
  computed: {
    isDemo () {
      return this.game.demo
    },
    getUrl () {
      return `${window.location.origin}/#/panel/verify?game=${this.game.url}`
    }
  },
  methods: {
    fetch () {
      try {
        this.$sailsIo.socket.get(`/v1/game/${this.$route.params.id}?populate=false`, response => {
          this.game = response
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
