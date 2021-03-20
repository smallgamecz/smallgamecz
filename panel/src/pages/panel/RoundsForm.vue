<template>
  <q-page padding>
    <div class="q-ma-none q-mb-md">
      <q-btn icon="arrow_left" @click="$router.back()" label="zpátky" />
    </div>

    <h2 class="text-h4 q-ma-none q-mb-md">
      <template v-if="$route.meta.edit">
        Upravit soutěžní kolo: <i>{{ form.name }}</i>
      </template>
      <template v-else>
        Nové kolo
      </template>
    </h2>

    <template v-if="form.winner > -1">
      <p class="text-red">
        Kolo už bylo odehráno. Není možné měnit jeho parametry.
      </p>

      <p>
        Vítěz:
        <span v-if="!form.winner || form.winner === -1">zatím žádný</span>
        <span v-if="form.winner === 0">remíza</span>
        <span v-if="form.winner === 1" class="text-blue">{{ form.player1 }}</span>
        <span v-if="form.winner === 2" class="text-orange">{{ form.player2 }}</span>
      </p>

      <div v-if="form.questions.length > 0" name="questions">
        <p>Níže najdete seznam otázek rezervovaných pro toto soutěžní kolo.</p>
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
      </div>
    </template>

    <template v-if="form.winner === -1 && !loading.data">
      <div class="q-ma-md text-right">
        <q-btn
          icon="check"
          label="uložit vše"
          @click="onSubmit(true)"
          :disable="!formIsValid"
        />
      </div>
      <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        animated
        class="q-ma-lg"
      >
        <q-step
          :name="1"
          title="Soutěžní kolo"
          icon="gamepad"
          :done="step > 1"
        >
          <div class="row fit justify-center text-center">
            <div class="col-6">
              <h4 class="text-h5 q-ma-none q-mb-md">Jak se má soutěžní kolo jmenovat?</h4>
              <div>
                <q-input
                  autofocus
                  filled
                  v-model="form.name"
                  label="Název kola *"
                  hint="Jak se má kolo jmenovat?"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Nezapomeňte doplnit název kolo.']"
                  @keypress.enter="onSubmit(false)"
                />
              </div>
            </div>
          </div>

          <q-stepper-navigation class="q-gutter-sm">
            <q-separator spaced />
            <q-btn
              :disable="form.name.length === 0"
              outline
              @click="() => { step = 2 }"
              color="primary"
              label="vybrat hru"
              icon-right="arrow_right"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          title="Hra"
          icon="gamepad"
          :done="step > 2"
        >
          <p v-if="$route.meta.edit && form.questions.length > 0" class="text-red">
            Toto nastavení již není možné změnit, protože už jsme pro hru rezervovali určitý počet otázek.
            Můžete pokračovat dále.
          </p>

          <h4 class="text-h5 q-ma-none q-mb-md text-center">Jakou hru chcete hrát?</h4>

          <div class="row q-col-gutter-md justify-center">
            <div class="col-4">
              <q-select
                v-model="form.type"
                :options="roundTypes"
                label="Typ hry"
                emit-value
                map-options
                :disable="$route.meta.edit && form.questions.length > 0"
              />
            </div>
            <div class="col-4">
              <q-img
                :src="getImageForRound"
              />
            </div>
          </div>

          <q-stepper-navigation class="q-gutter-sm">
            <q-separator spaced />
            <q-btn outline @click="() => { step = 1 }" color="primary" label="upravit název" icon="arrow_left" />
            <q-btn outline @click="() => { step = 3 }" color="primary" label="nastavit hráče" icon-right="arrow_right" />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="3"
          title="Hráči"
          icon="gamepad"
          :done="step > 2"
        >
          <div class="fit row justify-center q-col-gutter-md text-center">
            <div class="col-4">
              <div>
                <q-icon name="person" size="10em" class="text-grey" />
              </div>
              <div>
                <q-input
                  filled
                  v-model="form.player1"
                  label="Hráč 1 *"
                  hint="Jak se jmenuje první hráč?"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Nezapomeňte doplnit jméno prvního hráče.']"
                  @keypress.enter="onSubmit(true)"
                />
              </div>
            </div>
            <div class="col-4">
              <div>
                <q-icon name="person" size="10em" class="text-grey" />
              </div>

              <div>
                <q-input
                  filled
                  v-model="form.player2"
                  label="Hráč 2 *"
                  hint="Jak se jmenuje druhý hráč?"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Nezapomeňte doplnit jméno druhého hráče.']"
                  @keypress.enter="onSubmit(true)"
                />
              </div>
            </div>
          </div>

          <q-stepper-navigation class="q-gutter-sm">
            <q-separator spaced />
            <q-btn outline @click="() => { step = 2 }" color="primary" label="upravit hru" icon="arrow_left" />
            <q-btn
              :label="$route.meta.edit ? 'potvdit změny' : 'uložit novou'"
              color="secondary"
              icon="done"
              @click="onSubmit(true)"
              :disable="!formIsValid"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </template>

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
        name: 'soutěž',
        player1: 'Hráč 1',
        player2: 'Hráč 2',
        game: '',
        type: '',
        winner: -1,
        running: false,
        questions: []
      },
      roundTypes: [],
      questionsCount: 0,
      step: 1
    }
  },
  computed: {
    formIsValid () {
      if (!this.form.name.length) {
        return false
      }

      if (!this.form.player1.length) {
        return false
      }

      if (!this.form.player2.length) {
        return false
      }

      return true
    },
    getImageForRound () {
      try {
        const key = this.roundTypes.find(r => r.id === this.form.type).key
        return require(`../../assets/round/${key}.png`)
      } catch (error) {
        if (error) {
          // do nothing
        }
      }

      return ''
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
                questions: t.questions,
                key: t.key,
                id: t.id
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

    onSubmit (forceSubmit) {
      if (typeof forceSubmit === 'boolean' && forceSubmit === false) {
        if (this.step !== 3) {
          ++this.step
          return false
        }
      }

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
