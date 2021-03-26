<template>
  <div class="fullscreen bg-primary text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        500
      </div>

      <div class="text-h2" style="opacity:.4">
        Něco se nám pokazilo.
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="úvodní stránka"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error500'
}
</script>
