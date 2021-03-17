<template>
  <q-page padding>
    <div class="q-mb-md">
      <q-btn @click="$router.push({ name: 'panel.questions' })">
        zpět
      </q-btn>
    </div>

    <h2 class="text-h4 q-ma-none q-mb-md">
      Import otázek
    </h2>

    <q-tabs
        v-model="tab"
        align="left"
      >
        <q-tab name="games" label="Hry" />
        <q-tab name="url" label="URL" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="games" class="q-gutter-md">
        <p>
          Připravili jsme pro vás sadu různých otázek, které můžete hned použít. Klikněte na kategorii a hned vám ji nahrajeme.
          <br>
          Z každé kategorie importujeme vždy max. 100 otázek.
        </p>
        <div class="row q-col-gutter-md">
          <div
            v-for="category in categories" :key="category.id"
            class="col-sm-4 col-md-4 col-lg-3 col-12"
          >
            <q-card class="cursor-pointer" @click="importFromUrl(category.url)">
              <q-img
                :src="`${baseUrl}/${category.image}`"
                basic
              >
                <div class="absolute-bottom text-subtitle2 text-center">
                  {{ category.title }}
                </div>
              </q-img>
            </q-card>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="url" class="q-gutter-md">
        <p>
          Zadejte URL zdroje, ze kterého lze importovat otázky. Duplikované otázky budou ignorovány.
        </p>
        <q-form @submit="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="url"
                label="URL"
                placeholder="https://"
              />
            </div>
            <div class="col-12">
              <q-btn
                type="submit"
                label="importovat"
                :disable="!url"
              />
            </div>
          </div>
        </q-form>
      </q-tab-panel>
    </q-tab-panels>

    <q-inner-loading :showing="loading.import">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import topics from '../../helpers/import-questions'

export default {
  name: 'PagesQuestionsImportForm',
  data () {
    return {
      loading: {
        import: false
      },
      tab: 'games',
      url: '',
      categories: topics.categories,
      baseUrl: topics.baseUrl
    }
  },
  methods: {
    async onSubmit () {
      await this.importFromUrl(this.url)
    },

    async importFromUrl (url) {
      try {
        this.loading.import = true
        this.$sailsIo.socket.post(`/v1/game/${this.$route.params.id}/import`, {
          url: `${this.baseUrl}/${url}`
        }, response => {
          this.loading.import = false

          if (!response || typeof response !== 'boolean') {
            this.$smallgame.negative({
              message: 'Otázky není možné ze zadané URL importovat.'
            })
            return false
          }

          this.$smallgame.positive({
            message: 'Otázky jsme vám importovali do této hry.'
          })
        })
      } catch (error) {
        this.loading.import = false

        console.error(error)
        this.$smallgame.negative({
          message: 'Otázky není možné ze zadané URL importovat.'
        })
      }
    }
  }
}
</script>
