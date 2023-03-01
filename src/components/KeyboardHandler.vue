<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

const staticKeys = [
  "Meta",
  "Control",
  "Shift",
  "Alt",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
];

@Component({})
export default class KeyboardHandler extends Vue {
  keys: Record<string, boolean> = {};

  handler: number | null = null;

  get optimizeEvents() {
    return Math.random();
  }

  created() {
    window.addEventListener("keydown", this.keydownHandler);
    window.addEventListener("keyup", this.keyupHandler);
  }

  beforeDestroy() {
    window.removeEventListener("keydown", this.keydownHandler);
    window.removeEventListener("keyup", this.keyupHandler);
  }

  emitKeydownEvent() {
    const finalKeys = Object.keys(this.keys ?? {});
    finalKeys.sort((a, b) => {
      const staticIndexA = staticKeys.indexOf(a);
      const staticIndexB = staticKeys.indexOf(b);

      if (staticIndexA !== -1 && staticIndexB !== -1) {
        return staticIndexA - staticIndexB;
      }

      if (staticIndexA !== -1) {
        return -1;
      }

      if (staticIndexB !== -1) {
        return 1;
      }

      return a.localeCompare(b);
    });

    this.$emit("keydown", finalKeys);
  }

  getKey(e: KeyboardEvent): string {
    return /^[a-zA-Z]{1}$/.test(e.key) ? e.key.toUpperCase() : e.key;
  }

  handleTimeout(): void {
    if (this.handler) {
      clearTimeout(this.handler);
      this.handler = null;
    }

    this.handler = setTimeout(() => {
      this.keys = {};
      this.emitKeydownEvent();
    }, 2000);
  }

  keydownHandler(e: KeyboardEvent) {
    e.preventDefault();
    if (e.key in this.keys) {
      return;
    }
    this.keys[this.getKey(e)] = true;
    this.emitKeydownEvent();
    this.handleTimeout();
  }

  keyupHandler(e: KeyboardEvent) {
    e.preventDefault();
    delete this.keys[this.getKey(e)];
    this.emitKeydownEvent();
    this.handleTimeout();
  }
}
</script>

<style scoped>
div {
  display: none;
}
</style>
