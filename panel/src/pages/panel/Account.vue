<template>
  <q-page padding>
    <h2 class="q-mt-none text-h4">Účet</h2>

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
        />
      </q-card-actions>
    </q-card>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
export default {
  name: 'PagesPanelAccount',
  data () {
    return {
      loading: false
    }
  },
  methods: {
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
            message: 'Hru jsme právě smazali. Díky a brzy si zase přijďte hrát :-)'
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
    }
  }
}
</script>
