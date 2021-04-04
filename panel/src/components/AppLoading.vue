<template>
  <q-inner-loading :showing="loading">
    <q-spinner-gears size="100px" color="primary" class="fixed-center" />
  </q-inner-loading>
</template>

<script>
export default {
  name: 'AppLoadingComponent',
  computed: {
    loading () {
      return this.$store.state.app.loading
    }
  }
}
</script>
