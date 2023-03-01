<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import KeyboardHandler from "./KeyboardHandler.vue";

@Component({ components: { KeyboardHandler } })
export default class HelloWorld extends Vue {
  keys = "";

  keyEvents: Record<string, () => void> = {};

  recordingShortcut = false;
  numKeysRecorded = 0;
  recordedShortcut: string | null = null;
  recordingShortcutTimeout: number | null = null;

  mounted() {
    this.buildShortcuts();
  }

  updateKeys(keys: string[]) {
    const keysStr = keys.join(" + ");
    this.keys = keysStr;

    if (this.recordingShortcut) {
      if (keys.length === 0 || this.numKeysRecorded > keys.length) {
        this.endRecordShortcut();
        return;
      }

      if (!this.recordingShortcutTimeout) {
        this.recordingShortcutTimeout = setTimeout(() => this.endRecordShortcut(), 2000);
      }

      this.recordedShortcut = keysStr;
      this.numKeysRecorded = keys.length;
      return;
    }

    if (keysStr in this.keyEvents) {
      this.keyEvents[keysStr]();
    }
  }

  startRecordShortcut() {
    this.recordingShortcut = true;
  }

  endRecordShortcut() {
    this.recordingShortcut = false;
    this.numKeysRecorded = 0;
    if (this.recordedShortcut && this.recordedShortcut !== "") {
      localStorage.setItem("shortcut", this.recordedShortcut);
    }
    this.buildShortcuts();
  }

  buildShortcuts() {
    this.keyEvents = {
      [localStorage.getItem("shortcut") ?? "Shift + B"]: this.shortcutEvent,
    };
    console.log("building shortcuts", this.keyEvents);
  }

  shortcutEvent() {
    console.log("You just triggered a shortcut event!");
  }
}
</script>

<template>
  <div class="greetings">
    <h3 v-if="recordingShortcut">Recording!</h3>
    <h3 v-if="recordedShortcut?.length">Recorded: {{ recordedShortcut }}</h3>
    <h3>
      {{ keys }}
    </h3>
    <KeyboardHandler @keydown="updateKeys" />
    <button @click="startRecordShortcut" :disabled="recordingShortcut">Record Shortcut</button>
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
