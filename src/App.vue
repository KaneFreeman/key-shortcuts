<script setup lang="ts">
import HelloWorld from './components/Settings.vue'
</script>

<template>
  <div id="app" class="app">
    <header>
      <div class="wrapper">
        <HelloWorld />
      </div>
    </header>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.app {
  width: 600px;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
