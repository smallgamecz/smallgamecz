<template>
  <q-layout>
    <q-page-container>
      <template v-if="!$q.screen.gt.xs">
        <q-banner class="bg-primary text-white q-ma-md">
          <template v-slot:avatar>
            <q-icon name="info" />
          </template>
          Rozlišení obrazovky je už příliš malé na to, aby bylo možné zobrazit potřebné ovládací prvky.
          <br>
          Použijte proto větší obrazovku. Děkujeme.
        </q-banner>
      </template>
      <router-view v-else />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'PlayLayout'
}
</script>
