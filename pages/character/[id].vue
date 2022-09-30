<template>
  <div class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 px-8 text-center mb-4">
      <NuxtLink to="/" class="font-medium text-blue-600 w-100">
        <svg class="w-5 h-5 inline-block align-middle" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        <span class="align-middle"> Back to Characters</span>
      </NuxtLink>
      <Loading v-if="status === 'pending'" class="text-2xl text-center pt-5"></Loading>
      <div v-else class="pt-10">
        <img class="h-96 w-auto mx-auto rounded-xl outline" v-bind:src="character.thumbnail.path + '.' + character.thumbnail.extension" v-bind:alt="character.name">
        <p class="mt-6 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {{ character.name }}
        </p>
        <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          {{ character.description }}
        </p>
        <div class="pt-3">
          <a v-for="url in character.urls" v-bind:href="url.url" target="_blank" class="font-medium text-blue-600 hover:underline p-2">{{ url.type }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import md5 from 'md5';
  import { useRoute, useRuntimeConfig } from "nuxt/app";
  import { ref } from "@vue/reactivity";
  import { onMounted } from "@vue/runtime-core";
  import { useHead } from "@vueuse/head";

  const config = useRuntimeConfig();
  const route = useRoute()

  const character = ref({});
  const status = ref('pending');

  // Fetch character from API
  const fetchCharacter = async (id) => {
    try {
      const ts = Date.now();
      const hash = md5(ts + config.API_PRIVATE_KEY + config.API_PUBLIC_KEY);
      let url = `${config.API_BASE_URL}/characters/${id}?ts=${ts}&apikey=${config.API_PUBLIC_KEY}&hash=${hash}`;
      const response = await fetch(url);
      const data = await response.json();
      if (typeof data.data.results !== "number" && data.data.results?.length > 0) {
        character.value = data.data.results[0];
      }
    } catch (e) {
      status.value = 'error';
    } finally {
      status.value ='ok';
    }
  };

  onMounted(() => {
    fetchCharacter(route.params.id).then(() => {
      useHead({
        title: `Marvel test - ${character.value.name}`,
      })
    });
  });
</script>