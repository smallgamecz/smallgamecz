<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12">
        <div class="row q-col-gutter-md">
          <div v-if="showEmptyValue" class="col-12 text-right">
            <q-btn outline @click="importFromUrl()">přeskočit, mám vlastní otázky</q-btn>
          </div>

          <div class="col-12" v-if="!categories.length && !loading">
            <q-banner class="bg-red text-white q-mt-md">
              <template v-slot:avatar>
                <q-icon name="error" />
              </template>
              Nyní není možné použít žádné otázky z oficiálního katalogu. Krok můžete přeskočit.
            </q-banner>
          </div>

          <template v-if="categories.length">
            <div
              v-for="category in categories" :key="category.id"
              class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
            >
              <q-card class="cursor-pointer" @click="importFromUrl(category.url)">
                <q-img
                  :src="`${API_URL}/v1/questioncatalogue/image/${category.key}`"
                >
                  <div class="absolute-bottom">
                    {{ category.name }}
                  </div>
                  <q-chip class="absolute-top-right bg-accent">{{ category.count }}</q-chip>
                </q-img>
              </q-card>
            </div>
          </template>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
const API_URL = process.env.APP_API_URL

export default {
  name: 'ListOfTopicsComponent',
  props: {
    showEmptyValue: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      categories: [],
      API_URL
    }
  },
  computed: {
    loading () {
      return this.$store.state.app.loading
    }
  },
  created () {
    try {
      this.$store.commit('app/loading', true)

      this.$sailsIo.socket.get('/v1/questioncatalogue?omit=image_base64,createdAt,updatedAt', response => {
        this.$store.commit('app/loading', false)

        if (typeof response === 'object' && response) {
          this.categories = response
        }
      })
    } catch (error) {
      this.$store.commit('app/loading', false)

      if (error) {
        console.error(error)
      }
    }
  },
  methods: {
    async importFromUrl (source) {
      this.$emit('source', source)
    }
  }
}
</script>
