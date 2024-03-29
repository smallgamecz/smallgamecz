<template>
  <q-page padding>
    <q-form @submit="onSubmit" class="q-col-gutter-md" ref="form" autofocus>
      <h2 class="text-h4 q-ma-none q-mb-md">
        <template v-if="$route.meta.edit">
          Upravit otázku: <i>{{ form.title }}</i>
        </template>
        <template v-else>
          Nová otázka
        </template>
      </h2>

      <div v-if="form.round" class="text-red">
        <q-icon name="help" /> Tato otázka již byla využita ve hře. Není možné ji tedy použít pro další hru.
      </div>
      <q-input
        filled
        v-model="form.title"
        label="Otázka *"
        hint="Doplňte otázku."
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Nezapomeňte doplnit otázku.']"
      >
        <template v-slot:before>
          <q-icon name="help_center" />
        </template>
      </q-input>

      <q-input
        filled
        v-model="form.help"
        label="Nápověda (písmena) *"
        hint="Doplňte nápovědu k otázce."
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Nezapomeňte doplnit první znaky nápovědy.']"
      >
        <template v-slot:before>
          <q-icon name="support" />
        </template>
      </q-input>

      <q-input
        filled
        v-model="form.answer"
        label="Odpověď *"
        hint="Doplňte odpověď na otázku."
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Nezapomeňte doplnit odpověď na otázku.']"
      >
        <template v-slot:before>
          <q-icon name="question_answer" />
        </template>
      </q-input>

      <div class="q-mt-lg">
        <q-btn :label="$route.meta.edit ? 'potvrdit aktualizaci' : 'uložit novou'" type="submit" color="secondary" />
        <q-btn label="přerušit" type="reset" flat class="q-ml-sm" :to="{ name: 'panel.questions' }" />
      </div>
    </q-form>
  </q-page>
</template>

<script>
export default {
  name: 'PagesPanelQuestionsForm',
  data () {
    return {
      form: {
        title: '',
        answer: '',
        help: '',
        game: '',
        round: null
      }
    }
  },
  computed: {
    loading () {
      return this.$store.state.app.loading
    }
  },
  watch: {
    'form.round' (val) {
      if (typeof val !== 'string') {
        this.form.round = false // translate "null" as boolean
      }
    }
  },
  async created () {
    if (this.$route.meta.edit) {
      await this.fetch()
    }
  },
  methods: {
    async fetch () {
      this.$store.commit('app/loading', true)

      try {
        this.$sailsIo.socket.get(`/v1/question/${this.$route.params.question}`, (response = {}) => {
          this.$store.commit('app/loading', false)

          if (response.data) {
            for (const rKey in response.data) {
              if (typeof this.form[rKey] !== 'undefined') {
                this.form[rKey] = response.data[rKey]
              }
            }
          }
        })
      } catch (error) {
        this.$store.commit('app/loading', false)
        console.error(error)
      }
    },

    async onSubmit () {
      const method = this.$route.meta.edit ? 'patch' : 'post'
      const form = JSON.parse(JSON.stringify(this.form))

      form.game = this.$route.params.id

      try {
        this.$store.commit('app/loading', true)

        this.$sailsIo.socket[method]('/v1/question' + (this.$route.meta.edit ? `/${this.$route.params.question}` : ''), form, _ => {
          this.$store.commit('app/loading', false)

          this.$smallgame.positive({
            message: this.$route.meta.edit ? 'Právě jste otázku upravili.' : 'Právě jste přidali novou otázku.'
          })

          this.$router.push({ name: 'panel.questions' })
        })
      } catch (error) {
        this.$store.commit('app/loading', false)

        console.error(error)
        this.$smallgame.negative({
          message: this.$route.meta.edit ? 'Nebylo možné upravit otázku. Zkuste to prosím znovu.' : 'Nebylo možné přidat novou otázku. Zkuste to prosím znovu.'
        })
      }
    }
  }
}
</script>
