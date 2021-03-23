<template>
  <div>
    <div class="row q-mb-md">
      <div class="col">
        <q-btn icon="arrow_left" @click="$router.back()" label="zpátky" />
      </div>
      <div class="col text-right">
        <q-btn
          color="secondary"
          icon="check"
          label="uložit & hrát"
          @click="onSubmit(true)"
          :disable="!formIsValid"
        />
      </div>
    </div>

    <template v-if="!loading.data && !loading.questions">
      <q-banner v-if="!enoughQuestion" class="bg-red text-white q-ma-md">
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        Nemáte k dispozici dostatečné množství otázek pro hru, kterou jste vybrali.
        Doplňte otázky nebo vyberte jiný typ hry.
      </q-banner>

      <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        animated
        class="q-ma-lg"
      >
        <q-step
          :name="1"
          title="Hra"
          icon="gamepad"
          :done="step > 1"
        >
          <h4 class="text-h5 q-ma-none q-mb-md text-center">Jaký typ hry chcete hrát?</h4>

          <div class="row justify-center text-center">
            <div class="col-8">
              <div class="row q-col-gutter-md">
                <div class="col-xs-12">
                  <q-select
                    v-model="form.type"
                    :options="roundTypes"
                    label="Typ hry"
                    emit-value
                    map-options
                  />
                </div>
                <div class="col-xs-12">
                  <q-img
                    :src="getImageForRound"
                    style="max-width: 20em"
                  />
                </div>
              </div>
            </div>
          </div>

          <q-stepper-navigation class="q-gutter-sm text-center">
            <q-separator spaced />
            <q-btn outline @click="() => { step = 2 }" color="primary" label="kdo bude hrát?" icon-right="arrow_right" />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          title="Hráči"
          icon="gamepad"
          :done="step > 1"
        >
          <div class="row justify-center">
            <div class="col-10">
              <div class="fit row justify-center q-col-gutter-md text-center">
                <div class="col-xs-12 col-sm-6 col-md-6">
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
                <div class="col-xs-12 col-sm-6 col-md-6">
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
            </div>
          </div>

          <q-stepper-navigation class="q-gutter-sm">
            <q-separator spaced />

            <div class="row q-col-gutter-md justify-center">
              <div class="col-xs-12 col-sm-4">
                <q-btn
                  class="full-width"
                  outline
                  @click="() => { step = 1 }"
                  color="primary"
                  label="změnit typ hry"
                  icon="arrow_left"
                />
              </div>
              <div class="col-xs-12 col-sm-4 text-right">
                <q-btn
                  class="full-width"
                  color="secondary"
                  icon="check"
                  label="uložit & hrát"
                  @click="onSubmit(true)"
                  :disable="!formIsValid"
                />
              </div>
            </div>
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </template>

    <q-inner-loading :showing="loading.data">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
export default {
  name: 'RoundsFormComponent',
  data () {
    return {
      loading: {
        data: false,
        questions: false
      },
      form: {
        name: 'soutěž',
        player1: 'Hráč 1',
        player2: 'Hráč 2',
        game: '',
        type: ''
      },
      roundTypes: [],
      step: 1,
      freeQuestions: []
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

      if (!this.enoughQuestion) {
        return false
      }

      return true
    },
    enoughQuestion () {
      try {
        if (this.freeQuestions.length < this.getSelectedRoundType.questions) {
          return false
        }
      } catch (error) {
        if (error) {
          // do nothing
        }
      }

      return true
    },
    getImageForRound () {
      try {
        const key = this.roundTypes.find(r => r.id === this.form.type).key
        return require(`../assets/round/${key}.png`)
      } catch (error) {
        if (error) {
          // do nothing
        }
      }

      return ''
    },
    getSelectedRoundType () {
      try {
        return this.roundTypes.find(r => r.id === this.form.type)
      } catch (error) {
        if (error) {
          // do nothing
        }
      }

      return ''
    }
  },
  created () {
    this.fetchRoundTypes()
    this.fetchFreeQuestions()

    this.$store.dispatch('stats/event', {
      client: this.$sailsIo,
      event: 'round.form'
    })
  },
  methods: {
    fetchFreeQuestions () {
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
        }, (response) => {
          this.loading.questions = false

          if (response && typeof response === 'object') {
            this.freeQuestions = response.data
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
        if (this.step !== 2) {
          ++this.step
          return false
        }
      }

      const form = JSON.parse(JSON.stringify(this.form))

      this.$store.dispatch('stats/event', {
        client: this.$sailsIo,
        event: 'round.create',
        data: {
          key: this.getSelectedRoundType.key
        }
      })

      try {
        this.loading.data = true

        if (!form.game) {
          form.game = this.$route.params.id
        }

        this.$sailsIo.socket.post('/v1/round', form, response => {
          this.loading.data = false

          if (!response) {
            this.$smallgame.negative({
              message: 'Nebylo možné přidat nové kolo. Zkuste to prosím znovu.'
            })

            return false
          }

          this.$smallgame.positive({
            message: 'Právě jste přidali nové kolo.'
          })

          this.$emit('update', response)
        })
      } catch (error) {
        this.loading.data = false

        console.error(error)
        this.$smallgame.negative({
          message: 'Nebylo možné přidat nové kolo. Zkuste to prosím znovu.'
        })
      }
    }
  }
}
</script>
