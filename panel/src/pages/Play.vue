<template>
  <q-page class="window-height window-width row justify-center items-center">
    <div class="row q-col-gutter-md justify-center items-center text-center">
      <div class="col-12">
        <h1 class="text-h5 q-ma-none">zadejte kód hry</h1>
        <h2 class="text-h6 q-ma-none">a stiskněte <i>enter</i></h2>
      </div>
      <div class="col-xs-2 col-md-1">
        <q-input
          autofocus
          filled
          v-model="form.code0"
          @keyup="onSubmit"
          ref="code0"
        />
      </div>
      <div class="col-xs-2 col-md-1">
        <q-input
          filled
          v-model="form.code1"
          @keyup="onSubmit"
          ref="code1"
        />
      </div>
      <div class="col-xs-2 col-md-1">
        <q-input
          filled
          v-model="form.code2"
          @keyup="onSubmit"
          ref="code2"
        />
      </div>
      <div class="col-xs-2 col-md-1">
        <q-input
          filled
          v-model="form.code3"
          @keyup="onSubmit"
          ref="code3"
        />
      </div>
      <div class="col-xs-2 col-md-1">
        <q-input
          filled
          v-model="form.code4"
          @keyup="onSubmit"
          ref="code4"
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
        code0: '',
        code1: '',
        code2: '',
        code3: '',
        code4: ''
      },
      dialog: false
    }
  },
  computed: {
    code () {
      return [
        this.form.code0,
        this.form.code1,
        this.form.code2,
        this.form.code3,
        this.form.code4
      ].join('')
    }
  },
  methods: {
    onSubmit (e) {
      if ('1234567890abcdefghijklmnopqrstuvwxyz'.split('').indexOf(e.key) === -1) {
        return false
      }

      if (!this.form.code0) {
        this.$refs.code0.$el.getElementsByTagName('input')[0].focus()
        return false
      } else {
        this.$refs.code1.$el.getElementsByTagName('input')[0].focus()
      }

      if (!this.form.code1) {
        return false
      } else {
        this.$refs.code2.$el.getElementsByTagName('input')[0].focus()
      }

      if (!this.form.code2) {
        return false
      } else {
        this.$refs.code3.$el.getElementsByTagName('input')[0].focus()
      }

      if (!this.form.code3) {
        return false
      } else {
        this.$refs.code4.$el.getElementsByTagName('input')[0].focus()
      }

      if (!this.form.code4) {
        return false
      }

      if (this.code.length !== 5) {
        return false
      }

      try {
        this.$store.commit('app/loading', true)
        setTimeout(() => {
          this.$sailsIo.socket.post('/v1/round/verify', {
            code: this.code
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

              for (const code of Object.keys(this.form)) {
                this.form[code] = ''
              }

              this.$refs.code0.$el.getElementsByTagName('input')[0].focus()
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
