<template>
  <q-page padding>
    <q-form @submit="onSubmit">
      <h2 class="text-h4 q-ma-none q-mb-md">
        <template v-if="$route.meta.edit">
          Upravit otázku: <i>{{ form.title }}</i>
        </template>
        <template v-else>
          Nová otázka
        </template>
      </h2>
      <q-tabs
        v-model="tab"
        align="left"
      >
        <q-tab name="general" label="Obecné" />
      </q-tabs>
      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="general" class="q-gutter-md">
          <div v-if="form.round" class="text-red">
            <q-icon name="help" /> Tato otázka již byla využita ve hře. Není možné ji tedy použít pro další hru.
          </div>
          <q-input
            autofocus
            filled
            v-model="form.title"
            label="Otázka *"
            hint="Doplňte otázku."
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Nezapomeňte doplnit otázku.']"
          />
          <q-input
            filled
            v-model="form.help"
            label="Nápověda (písmena) *"
            hint="Doplňte nápovědu k otázce."
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Nezapomeňte doplnit nápovědu k otázce.']"
          />
          <q-input
            filled
            v-model="form.answer"
            label="Odpověď *"
            hint="Doplňte odpověď na otázku."
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Nezapomeňte doplnit odpověď na otázku.']"
          />
        </q-tab-panel>
      </q-tab-panels>

      <div class="q-mt-lg">
        <q-btn :label="$route.meta.edit ? 'potvrdit aktualizaci' : 'uložit novou'" type="submit" color="secondary"/>
        <q-btn label="přerušit" type="reset" flat class="q-ml-sm" :to="{ name: 'panel.questions' }" />
      </div>
    </q-form>
    <q-inner-loading :showing="loading.data">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
export default {
  name: 'PagesPanelQuestionsForm',
  data () {
    return {
      loading: {
        data: false
      },
      tab: 'general',
      form: {
        title: '',
        answer: '',
        help: '',
        game: '',
        round: null
      }
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
      this.loading.data = true

      try {
        this.$sailsIo.socket.get(`/v1/question/${this.$route.params.question}`, (response = {}) => {
          this.loading.data = false

          if (response.data) {
            for (const rKey in response.data) {
              if (typeof this.form[rKey] !== 'undefined') {
                this.form[rKey] = response.data[rKey]
              }
            }
          }
        })
      } catch (error) {
        this.loading.data = false
        console.error(error)
      }
    },

    async onSubmit () {
      const method = this.$route.meta.edit ? 'patch' : 'post'
      const form = JSON.parse(JSON.stringify(this.form))

      form.game = this.$route.params.id

      try {
        this.loading.data = true

        this.$sailsIo.socket[method]('/v1/question' + (this.$route.meta.edit ? `/${this.$route.params.question}` : ''), form, _ => {
          this.loading.data = false

          this.$smallgame.positive({
            message: this.$route.meta.edit ? 'Právě jste otázku upravili.' : 'Právě jste přidali novou otázku.'
          })

          this.$router.push({ name: 'panel.questions' })
        })
      } catch (error) {
        this.loading.data = false

        console.error(error)
        this.$smallgame.negative({
          message: this.$route.meta.edit ? 'Nebylo možné upravit otázku. Zkuste to prosím znovu.' : 'Nebylo možné přidat novou otázku. Zkuste to prosím znovu.'
        })
      }
    }
  }
}
</script>
