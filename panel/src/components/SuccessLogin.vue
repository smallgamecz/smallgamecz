<template>
  <q-dialog v-model="show" persistent transition-show="scale" transition-hide="scale">
    <q-card class="bg-transparent no-border no-box-shadow">
      <q-card-section>
        <q-avatar
          color="accent"
          size="15em"
          icon="thumb_up"
          text-color="white"
          class="animate__animated animate__bounceIn"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ComponentSuccessLogin',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>
