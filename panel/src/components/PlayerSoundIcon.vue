<template>
  <q-icon
    :name="$store.state.round.sound ? 'volume_up' : 'volume_off'"
    style="font-size: 150%"
    @click="$store.commit('round/toggleSound')"
    class="absolute-bottom-right q-ma-md cursor-pointer"
  >
    <q-tooltip anchor="center left">
      {{ $store.state.round.sound ? 'vypnout zvuk' : 'zapnout zvuk' }}
    </q-tooltip>
  </q-icon>
</template>

<script>
export default {
  name: 'ComponentPlayerSoundIcon'
}
</script>
