<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="$route.params.id"
          flat
          dense
          round
          icon="img:/logo/app.svg"
          aria-label="Home"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Small Game
          <template v-if="title">
            - {{ title }}
          </template>
          <q-icon name="edit" size=".8em" @click="changeGameTitle" class="cursor-pointer" title="Upravit název hry" />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item
          clickable
          tag="a"
          :to="{ name: 'panel.dashboard' }"
        >
          <q-item-section
            avatar
          >
            <q-icon name="dashboard" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Přehled</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          tag="a"
          :to="{ name: 'panel.rounds' }"
        >
          <q-item-section
            avatar
          >
            <q-icon name="face" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Soutěžní kola</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          tag="a"
          :to="{ name: 'panel.questions' }"
        >
          <q-item-section
            avatar
          >
            <q-icon name="question_answer" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Otázky</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator />

      <q-list>
        <q-item
          clickable
          tag="a"
          :to="{ name: 'panel.backuprestore' }"
        >
          <q-item-section
            avatar
          >
            <q-icon name="import_export" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Zálohovat & Obnovit</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-list>
        <q-item
          clickable
          tag="a"
          :to="{ name: 'panel.rules' }"
        >
          <q-item-section
            avatar
          >
            <q-icon name="gavel" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Pravidla hry</q-item-label>
          </q-item-section>
        </q-item>
       </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'PanelLayout',
  data () {
    return {
      leftDrawerOpen: false,
      title: ''
    }
  },
  created () {
    this.fetch()
    this.lastUsed()
  },
  methods: {
    fetch () {
      try {
        this.$sailsIo.socket.get(`/v1/game/${this.$route.params.id}`, response => {
          if (response) {
            this.title = response.name
          } else {
            // game not found - probably
            return this.$router.replace({
              name: 'game.404'
            })
          }
        })
      } catch (error) {
        if (error) {
          console.error(error)
        }
      }
    },

    changeGameTitle () {
      const name = window.prompt('Název hry:', this.title)

      try {
        this.$sailsIo.socket.patch(`/v1/game/${this.$route.params.id}`, {
          name
        }, (response) => {
          this.fetch()
        })
      } catch (error) {
        if (error) {
          console.error(error)
        }
      }
    },

    lastUsed () {
      try {
        this.$sailsIo.socket.patch(`/v1/game/${this.$route.params.id}`, {
          lastSeen: Date.now()
        })
      } catch (error) {
        if (error) {
          console.error(error)
        }
      }
    }
  }
}
</script>
