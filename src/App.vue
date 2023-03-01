<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import KeyboardHandlerMixin from "./components/KeyboardHandlerMixin.vue";
import Settings from "./components/Settings.vue";

@Component({ components: { Settings } })
export default class App extends Mixins(KeyboardHandlerMixin) {}
</script>

<template>
  <div id="app" class="app">
    <header>
      <div class="wrapper">
        <Settings />
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
