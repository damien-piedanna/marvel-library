<template>
  <div class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center mb-4">
        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Marvel's characters
        </p>
        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Get hooked on a hearty helping of heroes and villains from the humble House of Ideas!
        </p>
      </div>
      <div class="relative mb-5">
        <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg aria-hidden="true" class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input type="search" v-model="searchedName" class="block p-4 pl-10 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Name of the character...">
      </div>
      <div v-if="characters.length > 0" class="mt-10">
        <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-4 md:gap-x-6 md:gap-y-10">
          <CharacterItem v-for="character in characters" :key="character.id" :character="character" />
        </dl>
      </div>
      <p v-if="characters.length === 0 && status === 'ok'" class="text-2xl">No result, try with a different name.</p>
      <p v-if="status === 'error'" class="text-2xl">Error while fetching characters.</p>
      <div v-else-if="status === 'pending'" role="status" class="text-center pt-5">
        <Loading></Loading>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import md5 from 'md5';
  import { useRuntimeConfig } from "nuxt/app";
  import { ref } from "@vue/reactivity";
  import { onMounted, onUnmounted, watch } from "@vue/runtime-core";
  import { useHead } from "@vueuse/head";

  const config = useRuntimeConfig();

  const characters = ref([]);
  const searchedName = ref('');
  const status = ref('pending');
  const offset = ref(0);
  const limit = ref(20);

  //fetch characters from API
  const fetchCharacters = async () => {
    status.value ='pending';
    try {
      const ts = Date.now();
      const hash = md5(ts + config.API_PRIVATE_KEY + config.API_PUBLIC_KEY);
      let url = `${config.API_BASE_URL}/characters?ts=${ts}&apikey=${config.API_PUBLIC_KEY}&hash=${hash}&limit=${limit.value}&offset=${offset.value}`;
      if (searchedName.value) {
        url += `&nameStartsWith=${searchedName.value}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      characters.value = [...characters.value, ...data.data.results];
      offset.value += limit.value;
    } catch (e) {
      status.value = 'error';
    } finally {
      status.value ='ok';
    }
  };

  //infinite scroll
  watch(searchedName, () => {
    if (searchedName.value.length > 2 || searchedName.value.length === 0) {
      characters.value = [];
      offset.value = 0;
      fetchCharacters();
    }
  });
  const onScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
      fetchCharacters();
    }
  };

  onMounted(() => {
    fetchCharacters();
    window.addEventListener('scroll', onScroll);
    useHead({
      title: 'Marvel test',
    })
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
  });
</script>