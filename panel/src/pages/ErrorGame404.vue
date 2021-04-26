<template>
  <div class="fullscreen bg-primary text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        <q-icon name="gamepad" />
      </div>

      <div class="text-h2" style="opacity:.4">
        Tato hra neexistuje.
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        :to="{ name: 'play' }"
        label="zkusit jinou hru"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorGame404'
}
</script>
