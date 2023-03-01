<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import KeyboardHandler from "./KeyboardHandler.vue";

@Component({ components: { KeyboardHandler } })
export default class HelloWorld extends Vue {
  keys = '';

  updateKeys(keys: string[]) {
    console.log('KEYS', keys)
    this.keys = keys.join(' + ');
  }
}
</script>

<template>
  <div class="greetings">
    <h3>
      {{ keys }}
    </h3>
    <KeyboardHandler @keydown="updateKeys" />
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    display: block;
    text-align: left;
  }
}
</style>
