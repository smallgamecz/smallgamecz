<template>
  <div>
    <div class="row q-mb-md">
      <div class="col">
        <q-btn icon="arrow_left" @click="$router.back()" label="zpátky" />
      </div>
    </div>

    <template v-if="!loading">
      <q-banner v-if="!enoughQuestion" class="bg-red text-white q-ma-md">
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        Nemáte k dispozici dostatečné množství otázek pro hru, kterou jste vybrali.
        Doplňte otázky nebo vyberte jiný typ hry.
      </q-banner>

      <div class="row q-col-gutter-md justify-center">
        <div class="col-12 text-center">
          <h4 class="text-h5 q-ma-none q-mb-md">Vyberte typ hry, který si chcete zahrát?</h4>
          <p>Hra se pak hned spustí.</p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2" v-for="type in roundTypes" :key="type.id">
          <q-card class="cursor-pointer" @click="selectRoundType(type)" :class="{ 'q-card-selected shadow-15' : type.id === selected.type }">
            <q-img
              :src="getImageForRoundById(type.id)"
            >
              <div class="absolute-bottom text-subtitle2">
                {{ type.label }}
              </div>
            </q-img>
          </q-card>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'RoundsFormComponent',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        name: 'soutěž',
        player1: 'Hráč 1',
        player2: 'Hráč 2',
        game: '',
        type: ''
      },
      roundTypes: [],
      step: 1,
      freeQuestions: [],
      selected: {
        type: ''
      }
    }
  },
  computed: {
    formIsValid () {
      if (!this.form.type.length) {
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
      // this.$store.commit('app/loading', true)

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
          // this.$store.commit('app/loading', false)

          if (response && typeof response === 'object') {
            this.freeQuestions = response.data
          }
        })
      } catch (error) {
        // this.$store.commit('app/loading', false)
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
            }
          }
        })
      } catch (error) {
        console.error(error)
      }
    },

    onSubmit () {
      if (!this.formIsValid) {
        return false
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
        // this.$store.commit('app/loading', true)

        if (!form.game) {
          form.game = this.$route.params.id
        }

        this.$sailsIo.socket.post('/v1/round', form, response => {
          // this.$store.commit('app/loading', false)

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
        // this.$store.commit('app/loading', false)

        console.error(error)
        this.$smallgame.negative({
          message: 'Nebylo možné přidat nové kolo. Zkuste to prosím znovu.'
        })
      }
    },
    getImageForRoundById (id) {
      try {
        const key = this.roundTypes.find(r => r.id === id).key
        return require(`../assets/round/${key}.png`)
      } catch (error) {
        if (error) {
          // do nothing
        }
      }

      return ''
    },

    selectRoundType (type) {
      if (this.selected.type === type.id) {
        this.selected.type = ''
        this.form.type = ''
      } else {
        this.selected.type = type.id
        this.form.type = type.id
      }

      this.onSubmit()
    }
  }
}
</script>
