<template>
  <q-page padding>
    <p>
      <q-icon name="help" />
      Lze zálohovat, obnovit a importovat pouze otázky.
    </p>
    <q-tabs
      v-model="tab"
      align="left"
    >
      <q-tab name="backup" label="Záloha" />
      <q-tab name="restore" label="Obnovení" />
    </q-tabs>
    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="backup" class="q-gutter-md">
        <div class="row">
          <div class="col-12">
            <q-btn
              label="zálohovat otázky"
              @click="exportData"
            />
          </div>
          <div class="col-12" v-if="exported.length">
            <p class="q-mt-md text-red">Otázky si zkopírujte a uložte někam do souboru.</p>
            <q-input
              v-model="exported"
              type="textarea"
              readonly
            />
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="restore" class="q-col-gutter-md">
         <div class="row q-col-gutter-md">
          <div class="col-12">
            <p>
              <q-icon name="help" />
              Duplikované otázky budou ignorovány.
            </p>
          </div>
          <div class="col-12">
            <q-input
              v-model="restoring"
              type="textarea"
            />
          </div>
           <div class="col-12">
            <q-btn
              label="obnovit otázky"
              @click="restoreData"
              :disable="!restoring.length"
            />
          </div>
          <div class="col-12 q-mt-md">
            <h6 class="text-h6 q-ma-none q-mb-md">Máte vlastní otázky?</h6>
            <p>
              V případě, že chcete importovat vlastní otázky, vložte JSON v následujícím formátu:
            </p>
            <pre>
              <code>
{
  "questions": [
    {
      "title": "Jaký tvar má Země?",
      "answer": "K",
      "help": "kulatý"
    }
  ]
}
              </code>
            </pre>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
export default {
  name: 'PagesPanelBackupRestore',
  data () {
    return {
      tab: 'backup',
      exported: '',
      restoring: '',
      url: ''
    }
  },
  computed: {
    loading () {
      return this.$store.state.app.loading
    }
  },
  methods: {
    exportData () {
      try {
        this.$store.commit('app/loading', true)

        this.$sailsIo.socket.post(`/v1/game/${this.$route.params.id}/backup`, response => {
          this.$store.commit('app/loading', false)

          this.exported = JSON.stringify(response)

          this.$smallgame.positive({
            message: 'Aktuální data jsme zálohovali do textového pole na stránce. Můžete si je zkopírovat a uložit.'
          })
        })
      } catch (error) {
        this.$store.commit('app/loading', false)

        if (error) {
          console.error(error)
        }
      }
    },

    restoreData () {
      if (!this.restoring.length) {
        this.$smallgame.negative({
          message: 'Doplňte prosím data k obnovení.'
        })

        return false
      }

      try {
        const data = JSON.parse(this.restoring)

        this.$store.commit('app/loading', true)

        this.$sailsIo.socket.post(`/v1/game/${this.$route.params.id}/restore`, {
          data
        }, response => {
          this.$store.commit('app/loading', false)

          if (typeof response !== 'boolean') {
            console.error(response)

            this.$smallgame.negative({
              message: 'Není možné otázky obnovit.'
            })
            return false
          }

          this.$smallgame.positive({
            message: 'Aktuální otázky jsme vám obnovili do této hry.'
          })
        })
      } catch (error) {
        this.$store.commit('app/loading', false)

        if (error) {
          console.error(error)
        }

        this.$smallgame.negative({
          message: 'Není možné otázky obnovit.'
        })
      }
    }
  }
}
</script>
