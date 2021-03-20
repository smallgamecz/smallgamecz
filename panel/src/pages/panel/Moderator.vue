<template>
  <q-page padding>
    <template v-if="!loading.state">
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
            <template v-if="state.round.winner === -1">
              <q-btn
                color="secondary"
                icon="pause"
                @click="pauseRound"
                :disable="loading.pause || !isRunning"
                v-if="isRunning"
              >
                pozastavit hru
              </q-btn>
              <q-btn
                color="secondary"
                icon="play_arrow"
                @click="startRound"
                :disable="loading.start || isRunning"
                v-if="!isRunning"
              >
                spustit hru
              </q-btn>
            </template>
            <q-btn
              color="secondary"
              icon="refresh"
              @click="resetRound"
              :disable="loading.pause"
              v-if="state.round.winner === -1"
            >
              reset hry
            </q-btn>
            <q-btn
              v-if="state.round.winner === -1"
              color="secondary"
              icon="emoji_events"
              @click="endRound"
              :disable="loading.start || !isRunning"
            >
              ukončit hru
            </q-btn>
          </q-btn-group>
        </div>
      </div>
      <div class="row q-mt-md q-mb-md" v-if="state.round.winner === -1">
        <div class="col-12">
          <q-btn
            outline
            :data-clipboard-text="socialLink"
            icon="content_copy"
            class="copy"
          >
          odkaz pro spoluhráče
          <q-tooltip>kliknutím zkopírujete do schránky</q-tooltip>
          </q-btn>
        </div>
      </div>
      <div class="row q-col-gutter-lg">
        <div class="col-xs-12 col-md-4">
          <div class="row">
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

          <div class="col-12 q-mt-lg" v-if="activeQuestion">
            <q-banner class="text-white" :class="{ 'bg-blue': state.round.whoPlays === 1, 'bg-orange': state.round.whoPlays === 2 }">
              <template v-slot:avatar>
                <q-icon name="help" />
              </template>
              <div class="text-h6">
                {{ activeQuestion.title }}
              </div>
              <div class="text-h6">
                <q-avatar color="primary" text-color="white" size="2.5em" font-size=".4em">
                  {{ activeQuestion.help }}
                </q-avatar>
              </div>
              <q-separator />
              <div class="q-mt-md text-h6">
                <q-icon name="question_answer" /> {{ activeQuestion.answer }}
              </div>
              <template v-slot:action align="around">
                <q-btn
                  color="green"
                  label="Správně"
                  @click="updatePlayerResult(1)"
                  :disable="state.round.running === false"
                  icon="check_circle"
                />
                <q-btn
                  color="red"
                  label="Chybně"
                  @click="updatePlayerResult(0)"
                  :disable="state.round.running === false"
                  icon="dangerous"
                />
              </template>
            </q-banner>
          </div>

          <div class="col-12 q-mt-md" v-if="activeQuestion">
            <q-btn
              label="časovač"
              outline
              color="accent"
              icon="timer"
              @click="toggleRoundTimer"
            />
            <div class="q-mt-sm">
              <q-circular-progress
                v-if="roundTimer"
                v-model="roundTimer"
                size="75px"
                :thickness="0.5"
                color="red"
                center-color="gray"
              />
            </div>
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
                v-if="[1, 3, 6, 10, 15, 21].indexOf(index) > -1"
              >
            </div>
          </div>
          <div v-else>
            <h3 class="text-h6 q-ma-none">Použité otázky</h3>
            <ul>
              <li v-for="question in state.round.questions" :key="question.id">
                ({{ question.position }}) {{ question.title }}
                <template v-if="question.winner > -1">
                  <br>
                  Správně odpověděl:
                  <template v-if="question.winner === 1">{{ state.round.player1 }}</template>
                  <template v-if="question.winner === 2">{{ state.round.player2 }}</template>
                </template>
              </li>
            </ul>
          </div>
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

    <q-inner-loading :showing="loading.state || loading.start || loading.pause || loading.reset ">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading>

    <select-random-winner :start="randomizeWinner" :stop-with-winner="randomizedWinnerIs" />
  </q-page>
</template>

<script>
import ClipboardJS from 'clipboard'
import getQuestionDisabledState from '../../helpers/get-question-disabled-state'
import getQuestionButtonColor from '../../helpers/get-question-button-color'
import SelectRandomWinner from '../../components/SelectRandomWinner'

export default {
  name: 'PagePanelModerator',
  components: {
    SelectRandomWinner
  },
  data () {
    return {
      loading: {
        state: false,
        start: false,
        pause: false,
        reset: false
      },
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
      randomizedWinnerIs: -1
    }
  },
  computed: {
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
      return `${window.location.origin}/${this.$router.resolve({ name: 'panel.player', params: { id: this.$route.params.id, round: this.state.round.id } }).href}`
    }
  },
  watch: {
    activeQuestion (val) {
      if (val) {
        this.roundTimer = val.timer * 1
      }
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
        this.loading.state = true
      }

      try {
        this.$sailsIo.socket.get(`/v1/round/${this.$route.params.round}/state`, {
          game: this.$route.params.id
        }, (response) => {
          if (verbose) {
            this.loading.state = false
          }

          if (response && response.data) {
            this.state = response.data
          } else {
            // go for 404
            this.$router.replace({
              name: 'game.404'
            })
          }
        })
      } catch (error) {
        if (verbose) {
          this.loading.state = false
        }

        if (error) {
          console.error(error)
        }
      }
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
      this.loading.start = true

      try {
        this.$sailsIo.socket.patch(`/v1/round/${this.$route.params.round}/start`)
      } catch (error) {
        console.error(error)
        this.$smallgame.negative({
          message: 'Není možné spustit herní kolo. Zkuste obnovit stránku.'
        })
      }

      this.loading.start = false
    },

    pauseRound () {
      this.loading.pause = true

      try {
        this.$sailsIo.socket.patch(`/v1/round/${this.$route.params.round}/pause`)
      } catch (error) {
        console.error(error)
        this.$smallgame.negative({
          message: 'Není možné přerušit herní kolo. Zkuste obnovit stránku.'
        })
      }

      this.loading.pause = false
    },

    resetRound () {
      const confirm = window.confirm('Opravdu chcete kolo vynulovat?')

      if (!confirm) {
        return false
      }

      this.loading.reset = true

      try {
        this.$sailsIo.socket.patch(`/v1/round/${this.$route.params.round}/reset`)
      } catch (error) {
        console.error(error)
        this.$smallgame.negative({
          message: 'Není možné resetovat herní kolo. Zkuste obnovit stránku.'
        })
      }

      this.loading.reset = false
    },

    endRound () {
      this.endRoundState = true
    },

    updatePlayerResult (result) {
      this.loading.pause = true

      try {
        this.$sailsIo.socket.patch(`/v1/round/${this.$route.params.round}/result`, {
          player: this.state.round.whoPlays,
          question: this.activeQuestion.id,
          result
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

      this.loading.pause = false
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
      this.loading.state = true

      this.$sailsIo.socket.get(`/v1/round/${this.$route.params.round}/reserve-questions`, (_) => {
        this.loading.state = false

        if (typeof cb === 'function') {
          cb()
        }
      })
    }
  }
}
</script>
