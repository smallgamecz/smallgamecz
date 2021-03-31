<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div v-if="game" class="col-12">
        <q-chip icon="link">
          <a :href="getUrl">odkaz pro vstup do této sekce</a>
        </q-chip>
      </div>
      <div class="col-xs-6 col-md-3">
        <router-link :to="{ name: 'panel.moderator' }">
          <q-card>
            <q-img
              src="~assets/panel/rounds.png"
              basic
            >
              <div class="absolute-bottom text-subtitle2 text-center">
                Hraj
              </div>
            </q-img>
          </q-card>
        </router-link>
      </div>
      <div class="col-xs-6 col-md-3">
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
      <div class="col-xs-6 col-md-3">
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
      <div class="col-xs-6 col-md-3">
        <router-link :to="{ name: 'panel.account' }">
          <q-card>
            <q-img
              src="~assets/panel/account.png"
              basic
            >
              <div class="absolute-bottom text-subtitle2 text-center">
                Účet
              </div>
            </q-img>
          </q-card>
        </router-link>
      </div>
      <div class="col-12" v-if="!loading">
        <h6 class="text-h6 q-mb-md">Průvodce</h6>

        <p>Jen několik kroků vás dělí od začátku hry.</p>

        <q-list bordered separator>
          <q-item>
            <q-item-section avatar>
              <q-avatar color="secondary" text-color="white">1</q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label overline>Kvízové otázky</q-item-label>
              <q-item-label>
                Čím více otázek máte, tím více soutěžních kol můžete hrát.
                <br>
                Můžete je buď <router-link :to="{ name: 'panel.questions.new', params: { id: $route.params.id } }">sami vytvořit</router-link> nebo je nahrát <router-link :to="{ name: 'panel.questions.import', params: { id: $route.params.id } }">z naší encyklopedie</router-link>.
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{ name: 'panel.moderator' }">
            <q-item-section avatar>
              <q-avatar color="secondary" text-color="white">2</q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label overline>Soutěžní kola</q-item-label>
              <q-item-label>Přidejte nové soutěžní kolo a můžete hned hrát.</q-item-label>
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
      loading: false,
      game: null
    }
  },
  created () {
    this.fetch()
  },
  computed: {
    getUrl () {
      return `${window.location.origin}/#/panel/verify?game=${this.game.url}`
    }
  },
  methods: {
    fetch () {
      try {
        this.loading = true
        this.$sailsIo.socket.get(`/v1/game/${this.$route.params.id}?populate=false`, response => {
          this.loading = false
          if (response) {
            this.game = response
          }
        })
      } catch (error) {
        this.loading = false
        if (error) {
          console.error(error)
        }
      }
    }
  }
}
</script>
