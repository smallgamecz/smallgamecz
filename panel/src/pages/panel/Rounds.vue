<template>
  <q-page padding>
    <h1 class="text-h4 q-ma-none q-mb-md">
      Soutěžní kola
    </h1>

    <div class="q-mb-md" v-if="this.items.length">
      <q-btn
        icon="img:/logo/app.svg"
        color="secondary"
        :to="{ name: 'panel.moderator', params: { id: $route.params.id } }"
      >nová hra</q-btn>
    </div>

    <div v-if="!hasEnoughQuestions && !loading.questions" class="q-mb-md text-red">
      Každé soutěžní kolo vyžaduje konkrétní množství otázek (podle typu soutěžního kola).
      Momentálně nemáte dostatek volných otázek, abyste mohli zahájit všechna kola.
      <br>
      Přidejte <router-link :to="{ name: 'panel.questions', params: { id: $route.params.id } }">nové otázky</router-link> nebo smažte ta existující kola.
    </div>

    <div v-if="this.items.length">
      <q-table
        title="Přehled"
        :data="tableData"
        :columns="table.columns"
        row-key="name"
        :rows-per-page-options="[100]"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td name="options" auto-width class="q-gutter-xs">
              <q-btn
                round
                dense
                size="sm"
                icon="delete"
                color="red"
                @click="destroy(props.row)"
              />
            </q-td>
            <q-td key="title" :props="props">
              <div>
                {{ props.row.name }}
                <q-icon name="circle" :color="props.row.running ? 'green' : 'grey'" />
              </div>
              <div class="q-gutter-sm">
                <q-btn
                  size="sm"
                  outline
                  :to="{ name: 'panel.moderator', params: { id: $route.params.id, round: props.row.id }}"
                  :disable="playButtonStateDisabled(props.row)"
                >
                  <template v-if="props.row.winner > -1">
                    detail
                  </template>
                  <template v-else>
                    <template v-if="props.row.running">
                      pokračovat
                    </template>
                    <template v-else>
                      hrát
                    </template>
                  </template>
                </q-btn>

                <q-btn
                  v-if="props.row.questions.length"
                  size="sm"
                  outline
                  :icon-right="props.expand ? 'arrow_drop_up' : 'arrow_drop_down'"
                  @click="props.expand = !props.expand"
                >
                  otázky
                </q-btn>
              </div>
            </q-td>
            <q-td key="players" :props="props">
              {{ props.row.player1 }}
              <q-icon name="star" v-if="props.row.winner === 1" color="orange" />
              <br>
              {{ props.row.player2 }}
              <q-icon name="star" v-if="props.row.winner === 2" color="orange" />
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                <ul style="overflow: scroll">
                  <li v-for="q in props.row.questions" :key="q.id">
                    {{ q.title }}
                  </li>
                </ul>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <q-banner class="bg-grey-3" v-if="!this.items.length && !loading.items">
      <template v-slot:avatar>
        <q-icon name="face" color="primary" />
      </template>

      Momentálně zde nejsou žádná soutěžní kola. Přidejte nové.

      <template v-slot:action>
        <q-btn
          flat
          icon="img:/logo/app.svg"
          color="secondary"
          :to="{ name: 'panel.moderator' }"
        >začít nové kolo</q-btn>
      </template>
    </q-banner>

    <q-inner-loading :showing="loading.items || loading.delete">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
export default {
  name: 'PagelPanelRounds',
  data () {
    return {
      items: [],
      loading: {
        items: false,
        delete: false,
        questions: false
      },
      table: {
        columns: [
          {
            name: 'options'
          },
          {
            name: 'title',
            required: true,
            label: 'Kolo',
            align: 'left',
            field: row => row.name,
            format: val => `${val}`,
            sortable: false
          },
          {
            name: 'players',
            required: true,
            label: 'Hráči',
            align: 'left'
          }
        ]
      },
      questionsCount: 0
    }
  },
  computed: {
    tableData () {
      return this.items.map(item => {
        return {
          id: item.id,
          name: item.name,
          player1: item.player1,
          player2: item.player2,
          running: item.running,
          winner: item.winner,
          questions: item.questions,
          type: item.type
        }
      })
    },
    hasEnoughQuestions () {
      // no rounds here
      if (!this.items.length) {
        return true
      }

      // no questions at all
      if (this.questionsCount === 0) {
        return false
      }

      // filter rounds that has no winner or not running or the have a questions
      const freeRounds = this.items.filter(r => r.running === false && r.winner === -1)

      // count how much questions do we need
      let questionsNeeded = 0
      for (const fr of freeRounds) {
        questionsNeeded += fr.type.questions
      }

      if (!questionsNeeded) {
        return true
      }

      if (questionsNeeded <= this.questionsCount) {
        return true
      }

      return false
    }
  },
  async created () {
    this.fetch()
    this.fetchQuestions()
  },
  methods: {
    fetch () {
      this.loading.items = true

      this.$sailsIo.socket.get('/v1/round', {
        game: this.$route.params.id
      }, (results = []) => {
        this.loading.items = false

        if (results) {
          this.items = results
        }
      })
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

    async destroy (item) {
      const confirm = window.confirm(`Chcete odstranit kolo "${item.name}"?`)

      if (!confirm) {
        return false
      }

      try {
        this.loading.delete = true

        this.$sailsIo.socket.delete(`/v1/round/${item.id}`, _ => {
          this.loading.delete = false

          this.fetch()
          this.fetchQuestions()

          this.$smallgame.positive({
            message: `Smazali jste kolo "${item.name}".`
          })
        })
      } catch (error) {
        console.error(error)
        this.$smallgame.positive({
          message: `Není možné smazat kolo "${item.name}". Zkuste to prosím znovu.`
        })
      }
    },

    playButtonStateDisabled (round) {
      if (!round.type) {
        return true
      }

      if (!round.questions.length) {
        return true
      }

      // and has some amout of questions as the configured type
      if (round.questions.length === round.type.questions) {
        return false
      }

      // round is not running but we do not have en enough questions
      if (!round.running && !this.hasEnoughQuestions) {
        return true
      }

      return false
    }
  }
}
</script>
