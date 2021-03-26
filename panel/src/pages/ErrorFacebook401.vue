<template>
  <div class="fullscreen bg-primary text-white text-center q-pa-md flex flex-center">
    <div>
      <div class="text-h4" style="opacity:.4">
        Není možné se přihlásit přes Facebook.
      </div>

      <div class="text-h5" style="opacity:.4">
        Zkuste to znovu nebo vyberte jiný způsob přihlášení.
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Přejít na hlavní stranu"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorFacebook401'
}
</script>
