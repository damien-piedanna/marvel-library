<template>
  <NuxtLink :to="`/character/${character.id}`" class="max-w-sm rounded-lg overflow-hidden shadow-lg hover:bg-gray-100 hover:scale-105">
    <img class="w-full h-64 object-cover border-b-4 border-gray-900" v-bind:src="character.thumbnail.path + '.' + character.thumbnail.extension" v-bind:alt="character.name">
    <div class="px-6 py-4 font-bold text-xl text-center">{{ character.name }}</div>
  </NuxtLink>
</template>
<script setup lang="ts">
const props = defineProps({
  character: {
    type: Object,
    required: true,
  },
});
</script>