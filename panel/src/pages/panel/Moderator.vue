<template>
  <q-page padding>
    <template v-if="!loading">
      <template v-if="showRoundForm">
        <rounds-form
          :loading="loading"
          @update="roundFormCreate"
        />
      </template>

      <template v-else>
        <q-banner v-if="state.round.running === false && state.round.winner > -1" class="bg-primary text-white q-mb-lg">
          <template v-slot:avatar>
            <q-icon name="info" />
          </template>

          Hra byla již ukončena,
          <template v-if="state.round.winner === 0">
            remízou.
          </template>
          <template v-if="state.round.winner > 0">
            vítězem je <i>{{ state.round.winner === 1 ? state.round.player1 : state.round.player2 }}</i>.
          </template>
        </q-banner>

        <q-banner v-if="state.round.running === false && state.round.winner === -1" class="bg-primary text-white q-mb-lg">
          <template v-slot:avatar>
            <q-icon name="info" />
          </template>
          Nezapomeňte hru zahájit stisknutím tlačítka.
        </q-banner>

        <div class="row q-mb-md">
          <div class="col">
            <q-btn-group>
              <q-btn
                icon="keyboard_backspace"
                @click="goBack"
              >
                zpět
              </q-btn>
              <q-btn @click="dialog = true" icon="help" color="grey">
                Jak hru hrát?
              </q-btn>
              <template v-if="state.round.winner === -1">
                <q-btn
                  color="secondary"
                  icon="pause"
                  @click="pauseRound"
                  :disable="loading || !isRunning"
                  v-if="isRunning"
                >
                  pozastavit hru
                </q-btn>
                <q-btn
                  color="secondary"
                  icon="play_arrow"
                  @click="startRound"
                  :disable="loading || isRunning"
                  v-if="!isRunning"
                >
                  spustit hru
                </q-btn>
              </template>
              <q-btn
                color="secondary"
                icon="refresh"
                @click="resetRound"
                :disable="loading"
                v-if="state.round.winner === -1"
              >
                reset hry
              </q-btn>
              <q-btn
                v-if="state.round.winner === -1"
                color="secondary"
                icon="emoji_events"
                @click="endRound"
                :disable="loading || !isRunning"
              >
                ukončit hru
              </q-btn>
            </q-btn-group>
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-xs-12 col-md-4">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <div class="row q-col-gutter-sm">
                  <div class="col-12">
                    <q-card class="bg-blue text-white" :class="{ 'light-dimmed': state.round.whoPlays === 2 }">
                      <q-item>
                        <q-item-section>
                          <div class="text-h6">
                            <q-icon v-if="state.round.whoPlays === 1" name="double_arrow" size="150%" />
                            <q-icon v-if="state.round.winner === 1" name="emoji_events" size="150%" />
                            {{ state.round.player1 }}
                          </div>
                        </q-item-section>
                      </q-item>
                    </q-card>
                  </div>
                  <div class="col-12">
                    <q-card class="bg-orange text-white" :class="{ 'light-dimmed': state.round.whoPlays === 1 }">
                      <q-item>
                        <q-item-section>
                          <div class="text-h6">
                            <q-icon v-if="state.round.whoPlays === 2" name="double_arrow" size="150%" />
                            <q-icon v-if="state.round.winner === 2" name="emoji_events" size="150%" />
                            {{ state.round.player2 }}
                          </div>
                        </q-item-section>
                      </q-item>
                    </q-card>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 q-mt-xl" v-if="activeQuestion">
              <q-card class="text-white position-relative" :class="{ 'bg-blue': state.round.whoPlays === 1, 'bg-orange': state.round.whoPlays === 2 }">
                <q-linear-progress color="red" size="md" :value="1 - (roundTimer / 100)" />
                <q-card-section>
                  <q-btn
                    round
                    class="bg-white text-black absolute-center"
                    icon="timer"
                    style="margin-top: -1.5em"
                    @click="toggleRoundTimer"
                  />
                </q-card-section>
                <q-card-section class="text-h6 q-pt-none">
                  <q-avatar color="grey">{{ activeQuestion.position - 1 }}</q-avatar>
                  {{ activeQuestion.title }}
                </q-card-section>
                <div class="text-h2 text-center">
                  <q-card class="bg-primary">
                    <q-card-section>
                      {{ activeQuestion.help }}
                    </q-card-section>
                  </q-card>
                </div>
                <q-separator />
                <q-card-section class="q-mt-md text-h6">
                  <q-icon name="question_answer" /> {{ activeQuestion.answer }}
                </q-card-section>
                <q-card-section class="bg-white">
                  <div class="row q-col-gutter-sm">
                    <div class="col-12 text-black">
                      Kdo získal otázku?
                    </div>
                    <div class="col-xs-12 col-sm-4">
                      <q-btn
                        color="blue"
                        :label="state.round.player1"
                        class="full-width"
                        @click="updateQuestionResult(1)"
                        :disable="state.round.running === false"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-4">
                      <q-btn
                        color="grey"
                        label="nikdo"
                        class="full-width"
                        @click="updateQuestionResult(0)"
                        :disable="state.round.running === false"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-4">
                      <q-btn
                        color="orange"
                        :label="state.round.player2"
                        class="full-width"
                        @click="updateQuestionResult(2)"
                        :disable="state.round.running === false"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="col-xs-12 col-md-8">
            <div v-if="state.round.winner === -1" class="text-center">
              <div
                v-for="(question, index) in state.round.questions" :key="question.id"
                style="display: inline"
              >
                <q-btn
                  style="font-size: 140%"
                  round
                  glossy
                  :color="getQuestionButtonColor(question)"
                  class="q-ma-xs"
                  @click="selectQuestion(question, index + 1)"
                  :disable="getQuestionDisabledState(question)"
                  >
                  {{ ++index }}
                </q-btn>
                <br
                  v-if="state.round.type.break.map(i => i * 1).indexOf(index) > -1"
                >
              </div>
            </div>
          </div>
        </div>

        <div v-if="state.round.winner > -1" class="row q-col-gutter-sm">
          <div class="col-12">
            <h4 class="text-h5 q-ma-none q-mt-md">Typ hry</h4>
          </div>
          <div class="col-12">
            <q-img
              :src="getImageForRound"
              style="max-width: 20em"
            />
          </div>
        </div>

        <div class="row" v-if="usedQuestions.length > 0">
          <div class="col q-mt-md">
            <h3 class="text-h6 q-ma-none">Použité otázky</h3>
            <ul>
              <li v-for="question in usedQuestions" :key="question.id">
                <template v-if="question.position">
                  ({{ question.position - 1 }})
                </template>
                {{ question.title }}
                <template v-if="question.winner > -1">
                  <br>
                  Správně odpověděl:
                  <template v-if="question.winner === 0">---</template>
                  <template v-if="question.winner === 1">
                    <span class="text-blue">{{ state.round.player1 }}</span>
                  </template>
                  <template v-if="question.winner === 2">
                    <span class="text-orange">{{ state.round.player2 }}</span>
                  </template>
                </template>
              </li>
            </ul>
          </div>
        </div>

        <q-dialog :value="endRoundState" @hide="endRoundState = false">
          <q-card class="bg-primary text-white" style="width: 600px">
            <q-separator inset />
            <q-card-section>
              <div class="text-h6">
                <q-icon name="emoji_events" /> Vyberte, kdo zvítězil. Volbou současně ukončíte hru.
              </div>
            </q-card-section>

            <q-separator inset />

            <q-card-actions align="right">
              <q-btn @click="endRoundState = false">Zrušit</q-btn>
              <q-btn class="bg-black text-white" @click="winRound(0)">remíza</q-btn>
              <q-btn class="bg-blue text-white" @click="winRound(1)">{{ state.round.player1 }}</q-btn>
              <q-btn class="bg-orange text-white" @click="winRound(2)">{{ state.round.player2 }}</q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </template>
    </template>

    <select-random-winner :start="randomizeWinner" :stop-with-winner="randomizedWinnerIs" />

    <q-dialog
      :value="dialog"
      @hide="dialog = false"
    >
      <q-card style="max-width: 600px">
        <q-card-section>
          Na jiném zařízení přejděte na tento odkaz:<br>
          <a :href="socialLink" target="_blank" class="text-h6" style="text-decoration: none; color: inherit">{{ socialLink }}</a>
          <q-btn
              flat
              round
              icon="content_copy"
              class="copy"
              :data-clipboard-text="socialLink"
              size="sm"
            >
              <q-tooltip>kliknutím zkopírujete do schránky</q-tooltip>
            </q-btn>
        </q-card-section>

        <q-card-section>
          <div>Pro vstup do této hry pak budete potřebovat zadat kód:</div>
          <div class="text-h5">{{ state.round.code }}</div>
        </q-card-section>

        <q-separator inset />

        <q-card-actions>
          <q-btn flat @click="dialog = false" class="text-secondary">rozumím</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import ClipboardJS from 'clipboard'
import getQuestionDisabledState from '../../helpers/get-question-disabled-state'
import getQuestionButtonColor from '../../helpers/get-question-button-color'
import SelectRandomWinner from '../../components/SelectRandomWinner'
import RoundsForm from '../../components/RoundsForm'
const APP_PLAYER_LINK = process.env.APP_PLAYER_LINK

export default {
  name: 'PagePanelModerator',
  components: {
    SelectRandomWinner,
    RoundsForm
  },
  data () {
    return {
      state: {
        round: {
          running: false,
          questions: []
        }
      },
      handler: null,
      getQuestionDisabledState,
      getQuestionButtonColor,
      endRoundState: false,
      roundTimer: 0,
      roundInterval: null,
      randomizeWinner: false,
      randomizedWinnerIs: -1,
      showRoundForm: false,
      dialog: false,
      APP_PLAYER_LINK
    }
  },
  computed: {
    loading () {
      return this.$store.state.app.loading
    },
    usedQuestions () {
      return this.state.round.questions.filter(q => {
        return q.used === true
      })
    },
    activeQuestion () {
      try {
        const founded = this.state.round.questions.find(q => q.active)

        return founded || null
      } catch (error) {
        if (error) {
          // do nothing
        }
        return null
      }
    },
    isRunning () {
      try {
        return this.state.round.running
      } catch (_) {
        return false
      }
    },
    socialLink () {
      return this.APP_PLAYER_LINK
    },
    getImageForRound () {
      try {
        const key = this.state.round.type.key
        return require(`../../assets/round/${key}.png`)
      } catch (error) {
        if (error) {
          // do nothing
        }
      }

      return ''
    }
  },
  watch: {
    activeQuestion (val) {
      if (val) {
        this.roundTimer = val.timer * 1
      }
    },
    '$route.params.round' () {
      this.showRoundForm = false
      this.reserveQuestions(this.fetch)
    }
  },
  created () {
    this.reserveQuestions(this.fetch)

    this.handler = data => {
      if (data.action) {
        switch (data.action) {
          case 'round.start':
            break

          case 'round.pause':
            break

          case 'round.winner.by.chance.start':
            this.randomizeWinner = true
            break

          case 'round.winner.by.chance.end':
            // drumheart.stop()
            this.randomizeWinner = true // must be true for dialog to stay opened
            this.randomizedWinnerIs = data.winner

            setTimeout(() => {
              this.randomizeWinner = false // now close the dialog
              this.randomizedWinnerIs = -1
            }, 2000)
            break
        }

        this.fetch(false)
      }
    }

    this.$mitt.on('round', this.handler)
  },

  mounted () {
    // eslint-disable-next-line
    new ClipboardJS('.copy')
  },

  destroyed () {
    this.$mitt.off('round', this.handler)
  },

  methods: {
    fetch (verbose) {
      if (typeof verbose !== 'boolean') {
        verbose = true
      }

      if (verbose) {
        this.$store.commit('app/loading', true)
      }

      try {
        this.$sailsIo.socket.get(`/v1/round/${this.$route.params.round}/state`, {
          game: this.$route.params.id
        }, (response) => {
          if (verbose) {
            this.$store.commit('app/loading', false)
          }

          if (response && response.data) {
            this.state = response.data
          } else {
            // no round, so create a first one
            this.showRoundForm = true
          }
        })
      } catch (error) {
        if (verbose) {
          this.$store.commit('app/loading', false)
        }

        if (error) {
          console.error(error)
        }
      }
    },

    roundFormCreate (round) {
      return this.$router.replace({
        name: 'panel.moderator',
        params: {
          id: this.$route.params.id,
          round: round.id
        }
      })
    },

    selectQuestion (question, index) {
      if (question.winner === 0) {
        return this.selectWinnerByChance(question)
      }

      try {
        this.$sailsIo.socket.patch(`/v1/round/${this.$route.params.round}/select-question/${question.id}`, {
          position: index
        }, (response) => {
          if (response) {
            this.fetch(false)
          }
        })
      } catch (error) {
        console.error(error)
        this.$smallgame.negative({
          message: 'Není možné pokračovat zvolit otázku. Zkuste obnovit stránku.'
        })
      }
    },

    selectWinnerByChance (question) {
      if (!question) {
        question = this.activeQuestion
      }

      try {
        this.$sailsIo.socket.post(`/v1/round/${this.$route.params.round}/winner-by-chance/${question.id}`, {
          onlyNotify: true
        })

        setTimeout(() => {
          // write result
          this.$sailsIo.socket.post(`/v1/round/${this.$route.params.round}/winner-by-chance/${question.id}`)
        }, 4000)
      } catch (error) {
        if (error) {
          console.error(error)
        }
      }
    },

    startRound () {
      this.$store.dispatch('stats/event', {
        client: this.$sailsIo,
        event: 'round.start',
        data: {
          type: this.state.round.type.key
        }
      })

      try {
        this.$sailsIo.socket.patch(`/v1/round/${this.$route.params.round}/start`)
      } catch (error) {
        console.error(error)
        this.$smallgame.negative({
          message: 'Není možné spustit herní kolo. Zkuste obnovit stránku.'
        })
      }
    },

    pauseRound () {
      this.$store.dispatch('stats/event', {
        client: this.$sailsIo,
        event: 'round.pause',
        data: {
          type: this.state.round.type.key
        }
      })

      try {
        this.$sailsIo.socket.patch(`/v1/round/${this.$route.params.round}/pause`)
      } catch (error) {
        console.error(error)
        this.$smallgame.negative({
          message: 'Není možné přerušit herní kolo. Zkuste obnovit stránku.'
        })
      }
    },

    resetRound () {
      const confirm = window.confirm('Opravdu chcete kolo vynulovat?')

      if (!confirm) {
        return false
      }

      this.$store.dispatch('stats/event', {
        client: this.$sailsIo,
        event: 'round.reset',
        data: {
          type: this.state.round.type.key
        }
      })

      try {
        this.$sailsIo.socket.patch(`/v1/round/${this.$route.params.round}/reset`)
      } catch (error) {
        console.error(error)
        this.$smallgame.negative({
          message: 'Není možné resetovat herní kolo. Zkuste obnovit stránku.'
        })
      }
    },

    endRound () {
      this.endRoundState = true

      this.$store.dispatch('stats/event', {
        client: this.$sailsIo,
        event: 'round.end',
        data: {
          type: this.state.round.type.key
        }
      })
    },

    updateQuestionResult (resultWinner) {
      try {
        this.$sailsIo.socket.patch(`/v1/round/${this.$route.params.round}/result`, {
          player: resultWinner,
          question: this.activeQuestion.id
        }, (_) => {
          this.fetch(false)
          this.clearRoundInterval()
        })
      } catch (error) {
        console.error(error)
        this.$smallgame.negative({
          message: 'Není možné přerušit herní kolo. Zkuste obnovit stránku.'
        })
      }
    },

    winRound (winner) {
      try {
        this.$sailsIo.socket.patch(`/v1/round/${this.$route.params.round}/end`, {
          winner
        }, (_) => {
          this.endRoundState = false // close dialog

          this.fetch(false) // fetch data
        })
      } catch (error) {
        console.error(error)
        this.$smallgame.negative({
          message: 'Není možné ukončit herní kolo. Zkuste obnovit stránku.'
        })
      }
    },

    goBack () {
      this.$router.push({
        name: 'panel.rounds',
        params: {
          id: this.$route.params.id
        }
      })
    },

    clearRoundInterval () {
      clearInterval(this.roundInterval)
      this.roundTimer = 0
      this.roundInterval = null

      try {
        this.$sailsIo.socket.patch(`/v1/question/${this.activeQuestion.id}/timer/0`)
      } catch (error) {
        console.error(error)
      }
    },

    toggleRoundTimer () {
      if (this.roundInterval !== null) {
        this.clearRoundInterval()
        return false
      }

      this.roundInterval = setInterval(() => {
        if (this.roundTimer === 100) {
          this.clearRoundInterval()
          return false
        }

        this.roundTimer = this.roundTimer + 10

        try {
          this.$sailsIo.socket.patch(`/v1/question/${this.activeQuestion.id}/timer/${this.roundTimer}`)
        } catch (error) {
          console.error(error)
        }
      }, 1000)
    },

    reserveQuestions (cb) {
      this.$store.commit('app/loading', true)

      this.$sailsIo.socket.get(`/v1/round/${this.$route.params.round}/reserve-questions`, (_) => {
        this.$store.commit('app/loading', false)

        if (typeof cb === 'function') {
          cb()
        }
      })
    }
  }
}
</script>
