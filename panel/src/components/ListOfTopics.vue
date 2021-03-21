<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12">
        <div class="row q-col-gutter-md">
          <div v-if="showEmptyValue" class="col-12 text-right">
            <q-btn outline @click="importFromUrl()">přeskočit, mám vlastní otázky</q-btn>
          </div>
          <div
            v-for="category in categories" :key="category.id"
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card class="cursor-pointer" @click="importFromUrl(category.url)">
              <q-img
                :src="category.image"
              >
                <div class="absolute-bottom">
                  {{ category.name }}
                </div>
                <q-chip class="absolute-top-right bg-accent">{{ category.count }}</q-chip>
              </q-img>
            </q-card>
          </div>
        </div>
      </div>
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import repository from '../helpers/import-questions'

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
      loading: false,
      categories: []
    }
  },
  created () {
    this.loading = true

    try {
      this.$sailsIo.socket.get('/v1/game/data', {
        repository: repository.repository
      }, response => {
        this.loading = false
        this.categories = response.data.content.categories
      })
    } catch (error) {
      this.loading = false
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
