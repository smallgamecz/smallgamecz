<template>
  <q-page padding>
    <q-form @submit="onSubmit">
      <h2 class="text-h4 q-ma-none q-mb-md">
        <template v-if="$route.meta.edit">
          Upravit soutěžní kolo: <i>{{ form.name }}</i>
        </template>
        <template v-else>
          Nové kolo
        </template>
      </h2>

      <q-tabs
        v-model="tab"
        align="left"
      >
        <q-tab name="general" label="Obecné" />
        <q-tab name="configuration" label="Nastavení" />
        <q-tab v-if="form.questions.length > 0" name="questions" label="Otázky" />
      </q-tabs>
      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="general" class="q-gutter-md">
          <div class="row">
            <div class="col-3">
              <div>
                <h6 class="q-ma-none text-h6">Vítěz</h6>
                <div v-if="!form.winner || form.winner === -1">zatím žádný</div>
                <div v-if="form.winner === 0">remíza</div>
                <div v-if="form.winner === 1">{{ form.player1 }}</div>
                <div v-if="form.winner === 2">{{ form.player2 }}</div>
              </div>
            </div>
          </div>

          <q-input
            autofocus
            filled
            v-model="form.name"
            label="Název kola *"
            hint="Doplňte název kola."
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Nezapomeňte doplnit název kolo.']"
          />
          <q-input
            filled
            v-model="form.player1"
            label="Hráč 1 *"
            hint="Doplňte jméno prvního hráče."
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Nezapomeňte doplnit odpověď jméno prvního hráče.']"
          />
          <q-input
            filled
            v-model="form.player2"
            label="Hráč 2 *"
            hint="Doplňte jméno druhého hráče."
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Nezapomeňte doplnit odpověď jméno druhého hráče.']"
          />
        </q-tab-panel>

        <q-tab-panel name="configuration" class="q-gutter-md">
          <div class="row">
            <div class="col-12">
              <p v-if="$route.meta.edit && form.questions.length > 0" class="text-red">
                Toto nastavení již není možné změnit, protože již má rezervované otázky.
              </p>
              <q-select
                v-model="form.type"
                :options="roundTypes"
                label="Typ hry"
                emit-value
                map-options
                :disable="$route.meta.edit && form.questions.length > 0"
              />
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel v-if="$route.meta.edit && form.questions.length > 0" name="questions" class="q-gutter-md">
          <p>Níže najdete seznam otázek používaných v tomto kole.</p>
          <div class="row">
            <div class="col">
              <ul>
                <li v-for="question in form.questions" :key="question.id">
                  {{ question.title }}
                  <ul>
                    <li>{{ question.answer }}</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </q-tab-panel>

      </q-tab-panels>

      <div class="q-mt-lg">
        <q-btn :label="$route.meta.edit ? 'potvrdit aktualizaci' : 'uložit novou'" type="submit" color="secondary" />
        <q-btn label="přerušit" type="reset" flat class="q-ml-sm" :to="{ name: 'panel.rounds' }" />
      </div>
    </q-form>

    <q-inner-loading :showing="loading.data">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
export default {
  name: 'PagesPanelRoundsForm',
  data () {
    return {
      loading: {
        data: false,
        questions: false
      },
      tab: 'general',
      form: {
        name: '',
        player1: '',
        player2: '',
        game: '',
        type: '',
        winner: -1,
        running: false,
        questions: []
      },
      roundTypes: [],
      questionsCount: 0
    }
  },
  created () {
    if (this.$route.meta.edit) {
      this.fetch()
    }

    this.fetchRoundTypes()
    this.fetchQuestions()
  },
  methods: {
    fetch () {
      this.loading.data = true

      try {
        this.$sailsIo.socket.get(`/v1/round/${this.$route.params.round}?populate=questions`, (response = {}) => {
          this.loading.data = false

          if (response) {
            for (const rKey in response) {
              if (typeof this.form[rKey] !== 'undefined') {
                if (rKey === 'game') {
                  this.form[rKey] = response[rKey].id
                } else {
                  this.form[rKey] = response[rKey]
                }
              }
            }
          }
        })
      } catch (error) {
        this.loading.data = false
        console.error(error)
      }
    },

    fetchQuestions () {
      this.loading.questions = true

      try {
        const where = []
        where.game = this.$route.params.id
        where.round = null

        this.$sailsIo.socket.get('/v1/question', {
          populate: false,
          where: {
            game: this.$route.params.id,
            round: 'null'
          }
        }, (response = {}) => {
          this.loading.questions = false

          if (response && response.data) {
            this.questionsCount = response.data.length
          }
        })
      } catch (error) {
        this.loading.questions = false
        console.error(error)
      }
    },

    fetchRoundTypes () {
      try {
        this.$sailsIo.socket.get('/v1/round/type', (response = {}) => {
          if (response && response.data) {
            for (const t of response.data) {
              this.roundTypes.push({
                label: t.name,
                value: t.id,
                questions: t.questions
              })

              // default selection
              if (t.key === 'triangle28') {
                if (!this.form.type) {
                  this.form.type = t.id
                }
              }
            }
          }
        })
      } catch (error) {
        console.error(error)
      }
    },

    onSubmit () {
      const method = this.$route.meta.edit ? 'patch' : 'post'
      const form = JSON.parse(JSON.stringify(this.form))

      try {
        this.loading.data = true

        if (!form.game) {
          form.game = this.$route.params.id
        }

        // always delete an array of questions
        delete form.questions

        this.$sailsIo.socket[method]('/v1/round' + (this.$route.meta.edit ? `/${this.$route.params.round}` : ''), form, response => {
          this.loading.data = false

          if (!response) {
            this.$smallgame.negative({
              message: this.$route.meta.edit ? 'Nebylo možné upravit toho kolo. Zkuste to prosím znovu.' : 'Nebylo možné přidat nové kolo. Zkuste to prosím znovu.'
            })

            return false
          }

          this.$smallgame.positive({
            message: this.$route.meta.edit ? 'Právě jste toto kolo upravili.' : 'Právě jste přidali nové kolo.'
          })

          this.$router.push({ name: 'panel.rounds' })
        })
      } catch (error) {
        this.loading.data = false

        console.error(error)
        this.$smallgame.negative({
          message: this.$route.meta.edit ? 'Nebylo možné upravit toho kolo. Zkuste to prosím znovu.' : 'Nebylo možné přidat nové kolo. Zkuste to prosím znovu.'
        })
      }
    }
  }
}
</script>
