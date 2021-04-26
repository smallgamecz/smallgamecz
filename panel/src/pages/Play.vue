<template>
  <q-page class="window-height window-width row justify-center items-center">
    <div class="row q-col-gutter-md justify-center items-center text-center">
      <div class="col-12">
        <img src="/logo/favicon_1024_1024.png" alt="logo" width="100">
      </div>
      <div class="col-12">
        <h1 class="text-h5 q-ma-none">zadejte kód hry</h1>
        <h2 class="text-h6 q-ma-none">a stiskněte <i>enter</i></h2>
      </div>
      <div class="col-xs-10 col-sm-6">
        <q-input
          autofocus
          filled
          v-model="form.code"
          @keyup="onSubmit"
        />
      </div>
    </div>
    <q-dialog
      :value="dialog"
      @hide="dialog = false"
    >
      <q-card style="width: 600px">
        <q-card-section class="text-h6">
          Kód není platný. Zkuste to prosím znovu.
        </q-card-section>

        <q-separator inset />

        <q-card-actions>
          <q-btn flat class="text-red" @click="dialog = false">Zadám kód znovu</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'PagePlay',
  data () {
    return {
      form: {
        code: ''
      },
      dialog: false
    }
  },
  methods: {
    onSubmit (e) {
      if (this.form.code.length !== 5) {
        return false
      }

      this.form.code = this.form.code.toLowerCase()

      try {
        this.$store.commit('app/loading', true)
        setTimeout(() => {
          this.$sailsIo.socket.post('/v1/round/verify', {
            code: this.form.code
          }, (response) => {
            this.$store.commit('app/loading', false)

            if (response) {
              this.$router.replace({
                name: 'panel.player',
                params: {
                  id: response.game,
                  round: response.id
                }
              })
            } else {
              this.dialog = true
              this.form.code = ''
            }
          })
        }, 500)
      } catch (err) {
        this.$store.commit('app/loading', false)
        if (err) {
          console.error(err)
        }
      }
    }
  }
}
</script>

<style lang="sass">
  input
    font-size: 200%
    text-align: center
</style>
