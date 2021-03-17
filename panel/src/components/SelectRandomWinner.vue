<template>
  <q-dialog v-model="start" persistent transition-show="scale" transition-hide="scale">
    <q-card class="bg-transparent no-border no-box-shadow">
      <q-card-section>
        <q-avatar :color="color" size="10em" :icon="icon" text-color="white" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ComponentSelectRandomWinner',
  props: {
    start: {
      type: Boolean,
      default: false
    },
    stopWithWinner: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      color: '',
      interval: null,
      icon: ''
    }
  },
  watch: {
    start: {
      immediate: true,
      handler (state) {
        this.color = ''
        this.icon = ''

        const colors = ['orange', 'blue']

        // blick only in case of "true"
        if (state) {
          this.interval = setInterval(() => {
            this.color = colors[Math.floor(Math.random() * colors.length)]
          }, 200)
        }
      }
    },
    stopWithWinner (winner) {
      clearInterval(this.interval)

      if (winner === 1) {
        this.color = 'blue'
      }

      if (winner === 2) {
        this.color = 'orange'
      }

      this.icon = 'done'
    }
  },
  destroyed () {
    clearInterval(this.interval)
  }
}
</script>
