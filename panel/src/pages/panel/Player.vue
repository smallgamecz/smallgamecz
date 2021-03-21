<template>
  <q-page>
    <template v-if="!loading.state">
      <div class="row window-height items-center q-col-gutter-md text-center">
        <div class="col-12">
          <div
            v-for="(question, index) in state.round.questions" :key="question.id"
            style="display: inline"
          >
            <q-btn
              style="font-size: 150%"
              round
              glossy
              :color="getQuestionButtonColor(question)"
              class="q-ma-xs"
              readonly
              >
              {{ ++index }}
            </q-btn>
            <br
              v-if="[1, 3, 6, 10, 15, 21].indexOf(index) > -1"
            >
          </div>

          <div class="col-12">
            <p>
              <br>
            </p>
          </div>

          <div class="col-12">
            <div class="row q-col-gutter-md justify-center">
              <div class="col-3">
                <q-card class="bg-blue text-white" :class="{ 'light-dimmed': state.round.whoPlays === 2 }">
                  <q-item>
                    <q-item-section>
                      <div class="text-h6">
                        <q-icon round v-if="state.round.whoPlays === 1" name="double_arrow" size="150%" />
                        {{ state.round.player1 }}
                      </div>
                    </q-item-section>
                  </q-item>
                </q-card>
              </div>
              <div class="col-3">
                <q-card class="bg-orange text-white"  :class="{ 'light-dimmed': state.round.whoPlays === 1 }">
                  <q-item>
                    <q-item-section>
                      <div class="text-h6">
                        <q-icon v-if="state.round.whoPlays === 2" name="double_arrow" size="150%" />
                        {{ state.round.player2 }}
                      </div>
                    </q-item-section>
                  </q-item>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <q-dialog :value="!state.round.running" persistent>
        <q-card class="bg-secondary text-white" style="width: 600px">
          <q-card-section horizontal>
            <q-card-section>
              <q-icon name="pause" style="font-size: 200%" />
            </q-card-section>
            <q-card-section class="q-pl-none">
              <div class="text-h6">
                Vyčkejte na moderátora
              </div>
            </q-card-section>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Moderátor hru jistě brzy spustí.
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-if="activeQuestion" :value="activeQuestion && Object.keys(activeQuestion).length > 0" persistent>
        <q-card
          class="text-white relative-position"
          style="width: 600px"
          :class="{ 'bg-blue': state.round.whoPlays === 1, 'bg-orange': state.round.whoPlays === 2 }"
        >
          <q-linear-progress color="red" size="md" :value="1 - (roundTimer / 100)" />

          <q-card-section class="text-h6">
            <div v-if="state.round.whoPlays === 1">
              <q-icon name="person" />
              {{ state.round.player1 }}
            </div>
            <div v-if="state.round.whoPlays === 2">
              <q-icon name="person" />
              {{ state.round.player2 }}
            </div>
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            <div class="text-h6">
              {{ activeQuestion.title }}
            </div>
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            <div class="row text-center">
              <div class="col">
                <div class="text-h2">
                  <q-card class="bg-primary">
                    <q-card-section>
                      {{ activeQuestion.help }}
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </template>

    <q-inner-loading :showing="loading.state">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading>

    <player-sound-icon />
    <select-random-winner :start="randomizeWinner" :stop-with-winner="randomizedWinnerIs" />
  </q-page>
</template>

<script>
import getQuestionButtonColor from '../../helpers/get-question-button-color'
import PlayerSoundIcon from '../../components/PlayerSoundIcon'
import SelectRandomWinner from '../../components/SelectRandomWinner'

export default {
  name: 'PagePanelPlayer',
  components: {
    PlayerSoundIcon,
    SelectRandomWinner
  },
  data () {
    return {
      loading: {
        state: false
      },
      state: {
        questions: [],
        round: {
          running: false
        }
      },
      handler: null,
      getQuestionButtonColor,
      roundTimer: 0,
      randomizeWinner: false,
      randomizedWinnerIs: -1
    }
  },
  computed: {
    activeQuestion () {
      try {
        return this.state.round.questions.find(q => q.active) || null
      } catch (error) {
        if (error) {
          // do nothing
        }
        return null
      }
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
    this.fetch()

    this.handler = data => {
      if (!data) {
        return false
      }

      if (data.action) {
        switch (data.action) {
          case 'round.start':
            this.$sounder.start()
            this.fetch(false)
            break

          case 'round.select.question':
            this.fetch(false)
            this.$sounder.selectQuestion()
            break

          case 'round.result':
            this.fetch(false)

            if (data.result === 0) {
              this.$sounder.questionFail()
            }

            if (data.result === 1) {
              this.$sounder.questionWin()
            }
            break

          case 'round.pause':
            this.fetch(false)
            break

          case 'round.timer':
            if (typeof data.timer !== 'undefined') {
              this.roundTimer = data.timer
            }
            break

          // game ended or reset
          case 'round.end':
          case 'round.reset':
            this.fetch()
            break

          case 'round.winner.by.chance.start':
            this.$sounder.drumheart()

            this.randomizeWinner = true
            this.fetch(false)
            break

          case 'round.winner.by.chance.end':
            this.$sounder.Howler.stop() // stop all sounds

            this.randomizeWinner = true // must be true for dialog to stay opened
            this.randomizedWinnerIs = data.winner

            this.$sounder.reward()
            this.fetch(false) // let's load the result before the dialog closes

            setTimeout(() => {
              this.randomizeWinner = false // now close the dialog
              this.randomizedWinnerIs = -1
            }, 2000)
            break
        }
      }
    }

    this.$mitt.on('round', this.handler)
  },

  destroyed () {
    this.$mitt.off('round', this.handler)
  },

  methods: {
    fetch (verbose = true, cb = null) {
      if (verbose) {
        this.loading.state = true
      }

      try {
        this.$sailsIo.socket.get(`/v1/round/${this.$route.params.round}/state`, {
          game: this.$route.params.id
        }, (response) => {
          if (!response) {
            // go for 404
            return this.$router.replace({
              name: 'game.404'
            })
          }

          if (verbose) {
            this.loading.state = false
          }

          this.state = response.data

          // play win sound in case the 1st and 2nd player won
          if (this.state.round.winner > 0) {
            this.$sounder.winner()
          }

          if (this.state.round.winner === 0) {
            return this.$router.push({
              name: 'panel.winner',
              query: {
                winner: this.state.round.winner
              }
            })
          }

          if (this.state.round.winner > 0) {
            return this.$router.push({
              name: 'panel.winner',
              query: {
                winner: this.state.round.winner,
                player: (this.state.round.winner === 1 ? this.state.round.player1 : this.state.round.player2)
              }
            })
          }

          if (typeof cb === 'function') {
            cb()
          }
        })
      } catch (error) {
        if (verbose) {
          this.loading.state = false
        }

        console.error(error)
        this.$smallgame.negative({
          message: 'Není možné pokračovat ve hře. Zkuste obnovit stránku.'
        })
      }
    }
  }
}
</script>
