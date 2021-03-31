<template>
  <q-page padding>
    <h2 class="q-mt-none text-h4">Účet</h2>

    <q-card v-if="socialAccountType" class="q-mb-md">
      <q-card-section class="bg-accent text-white">
        <q-icon :name="getSocialIcon" size="md" />
        Sociální sítě
      </q-card-section>
      <q-separator />
      <q-card-section>
        <p v-if="socialAccountType">
          <template v-if="socialAccountType === 'twitter'">
            S touto hrou máte propojený Twitter účet.
          </template>
          <template v-if="socialAccountType === 'facebook'">
            S touto hrou máte propojený Facebook účet.
          </template>
          <template v-if="socialAccountType === 'linkedin'">
            S touto hrou máte propojený LinkedIn účet.
          </template>

          Propojení můžete zrušit, jenom pak ztratíte jednoduchou možnost se přihlásit.
        </p>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn
          color="red"
          flat
          label="zrušit propojení"
          @click="cancelConnection"
        />
      </q-card-actions>
    </q-card>

    <q-card>
      <q-card-section class="bg-red text-white">
        <q-icon name="warning" size="md" />
        Smazat účet
      </q-card-section>
      <q-separator />
      <q-card-section>
        V případě, že chcete smazat veškerá nastavení této hry i hru samotnou, potvrďte své rozhodnutí tlačítkem níže.
        <br>
        Veškerá data smažeme a nebude již možné je nijak obnovit.
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn
          flat
          label="potvrdit smazání této hry"
          @click="confirmDelete"
          color="red"
        />
      </q-card-actions>
    </q-card>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import icons from '../../helpers/social-icons'

export default {
  name: 'PagesPanelAccount',
  data () {
    return {
      loading: false,
      icons,
      game: null
    }
  },
  computed: {
    socialAccountType () {
      if (!this.game) {
        return false
      }

      return this.game.network
    },
    getSocialIcon () {
      if (!this.game) {
        return 'info'
      }

      if (!this.game.network) {
        return 'info'
      }

      try {
        return `img:${this.icons[this.game.network]}`
      } catch (error) {
        if (error) {
          // do nothing
        }
      }

      return ''
    }
  },
  created () {
    this.fetchGame()
  },
  methods: {
    fetchGame () {
      this.loading = true

      try {
        this.$sailsIo.socket.get(`/v1/game/${this.$route.params.id}?populate=false`, response => {
          this.loading = false

          if (typeof response === 'object') {
            this.game = response
          }
        })
      } catch (error) {
        this.loading = false

        if (error) {
          console.error(error)
        }
      }
    },
    confirmDelete () {
      const confirmed = window.confirm('Opravdu chcete smazat tuto hru? Nejde to vrátit.')
      if (confirmed) {
        this.deleteAccount()
      }
    },
    deleteAccount () {
      try {
        this.loading = true
        this.$sailsIo.socket.delete(`/v1/game/${this.$route.params.id}`, response => {
          this.loading = false

          this.$smallgame.positive({
            message: 'Hru jsme smazali. Díky a brzy si zase přijďte hrát :-)'
          })

          return this.$router.replace({
            name: 'homepage'
          })
        })
      } catch (error) {
        this.loading = false

        if (error) {
          console.error(error)
        }
      }
    },

    cancelConnection () {
      try {
        this.loading = true

        this.$sailsIo.socket.patch(`/v1/game/${this.$route.params.id}`, {
          network: '',
          userId: ''
        }, response => {
          this.loading = false

          this.game = response

          this.$smallgame.positive({
            message: 'Propojení se sociálními sítěmi jsme zrušili.'
          })
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
