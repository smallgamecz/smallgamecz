<template>
  <q-page padding>
    <h1 class="text-h4 q-ma-none q-mb-md">
      Otázky
    </h1>

    <div class="row">
      <div class="col-xs-12 col-sm-6 text-left">
        <q-btn
          v-if="this.items.length"
          icon="add"
          color="secondary"
          :to="{ name: 'panel.questions.new', params: { id: $route.params.id } }"
        >přidat další otázku</q-btn>
      </div>
      <div class="col-xs-12 col-sm-6 text-right">
        <q-btn
          color="accent"
          icon="get_app"
          :to="{ name: 'panel.questions.import', params: { id: $route.params.id } }"
        >přidat z encyklopedie</q-btn>
      </div>
    </div>

    <div class="q-mb-md">

    </div>

    <div v-if="this.items.length">
      <q-table
        title="Přehled"
        :data="tableData"
        :columns="table.columns"
        row-key="title"
        :rows-per-page-options="[100]"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td name="options" auto-width class="q-gutter-xs">
              <q-btn
                round
                :to="{ name: 'panel.questions.edit', params: { id: $route.params.id, question: props.row.id } }"
                dense
                size="sm"
                icon="edit"
              />

              <q-btn
                round
                dense
                color="secondary"
                size="sm"
                icon="content_copy"
                @click="copyItem(props.row)"
              />

              <q-btn
                round
                dense
                size="sm"
                icon="delete"
                color="red"
                @click="destroy(props.row)"
                :disable="props.row.round && props.row.round.length > 0"
              />
            </q-td>
            <q-td key="title" :props="props">
              <div>{{ props.row.title }}</div>
              <div class="text-caption">{{ props.row.answer }}</div>
            </q-td>
            <q-td key="round" :props="props">
              {{ props.row.round ? 'ano' : 'ne' }}
            </q-td>
            <q-td key="help" :props="props">
              {{ props.row.help }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <q-banner class="bg-grey-3" v-if="!this.items.length && !loading">
      <template v-slot:avatar>
        <q-icon name="question_answer" color="primary" />
      </template>

      Momentálně zde nejsou žádné soutěžní otázky. Přidejte nové.

      <template v-slot:action>
        <q-btn
          flat
          icon="question_answer"
          color="secondary"
          :to="{ name: 'panel.questions.new', params: { id: $route.params.id } }"
        >přidat novou otázku</q-btn>
      </template>
    </q-banner>
  </q-page>
</template>

<script>
export default {
  name: 'PagelPanelQuestions',
  data () {
    return {
      items: [],
      table: {
        columns: [
          {
            name: 'options'
          },
          {
            name: 'title',
            required: true,
            label: 'Otázka',
            align: 'left',
            field: row => row.title,
            format: val => `${val}`,
            sortable: false,
            style: 'max-width: 300px; overflow: hidden'
          },
          {
            name: 'round',
            required: true,
            label: 'Použito ve hře',
            align: 'left',
            field: row => row.round,
            format: val => `${val}`,
            sortable: true
          },
          {
            name: 'help',
            required: true,
            label: 'Nápověda',
            align: 'left',
            field: row => row.help,
            format: val => `${val}`,
            sortable: true
          }
        ]
      }
    }
  },
  computed: {
    loading () {
      return this.$store.state.app.loading
    },
    tableData () {
      return this.items.map(item => {
        return {
          id: item.id,
          title: item.title,
          answer: item.answer,
          round: item.round,
          help: item.help,
          game: item.game
        }
      })
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.$store.commit('app/loading', true)

      try {
        this.$sailsIo.socket.get('/v1/question', {
          where: {
            game: this.$route.params.id
          }
        }, (results = {}) => {
          this.$store.commit('app/loading', false)

          if (results && results.data) {
            this.items = results.data
          } else {
            this.items = []
          }
        })
      } catch (error) {
        this.$store.commit('app/loading', false)

        console.error(error)
        this.$smallgame.negative({
          message: 'Není možné otázky nahrát. Zkuste to prosím znovu.'
        })
      }
    },

    destroy (item) {
      const confirm = window.confirm(`Chcete odstranit otázku "${item.title}"?`)

      if (!confirm) {
        return false
      }

      try {
        this.$store.commit('app/loading', true)

        this.$sailsIo.socket.delete(`/v1/question/${item.id}`, _ => {
          this.$store.commit('app/loading', false)

          this.$smallgame.positive({
            message: `Smazali jste otázku "${item.title}".`
          })

          this.fetch()
        })
      } catch (error) {
        this.$store.commit('app/loading', false)

        console.error(error)
        this.$smallgame.positive({
          message: `Není možné smazat otázku "${item.title}". Zkuste to prosím znovu.`
        })
      }
    },

    copyItem (itemToCopy) {
      const item = JSON.parse(JSON.stringify(itemToCopy))

      delete item.id
      delete item.round // not used in the round

      // update title due to "unique"
      item.title = `${item.title} (kopie)`

      try {
        this.$store.commit('app/loading', true)

        this.$sailsIo.socket.post('/v1/question', item, (_) => {
          this.$store.commit('app/loading', false)
          this.fetch()

          this.$smallgame.positive({
            message: `Zkopírovali jste otázku "${item.title}".`
          })
        })
      } catch (error) {
        this.$store.commit('app/loading', false)

        console.error(error)
        this.$smallgame.negative({
          message: 'Není možné otázku duplikovat. Zkuste to prosím znovu.'
        })
      }
    }
  }
}
</script>
