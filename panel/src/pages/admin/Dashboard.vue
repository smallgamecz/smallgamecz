<template>
  <q-page padding>
    <p>dashboard</p>
    <q-inner-loading :showing="loading.data">
      <q-spinner-gears size="100px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
export default {
  name: 'PageAdminDasbhoard',
  data () {
    return {
      loading: {
        data: false
      }
    }
  }
}
</script>
