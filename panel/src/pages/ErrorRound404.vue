<template>
  <div class="fullscreen bg-primary text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        <q-icon name="gamepad" />
      </div>

      <div class="text-h2" style="opacity:.4">
        Toto soutěžní kolo neexistuje.
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Zkuste hlavní stranu"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorRound404'
}
</script>
