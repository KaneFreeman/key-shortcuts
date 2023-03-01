<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import KeyboardHandler from "./KeyboardHandler.vue";
import { useShortcutStore } from "./stores/shortcut";
import Widget from "./Widget.vue";
import Widget2 from "./Widget2.vue";

@Component({ components: { KeyboardHandler, Widget, Widget2 } })
export default class Settings extends Vue {
  keys = "";

  keyEvents: Record<string, () => void> = {};

  numKeysRecorded = 0;
  recordedShortcut: string | null = null;
  recordingShortcutTimeout: number | null = null;

  get shortcuts() {
    return useShortcutStore().shortcuts;
  }

  get isRecordingShortcut() {
    return useShortcutStore().isRecording;
  }

  startRecordShortcut(shortcut: string) {
    useShortcutStore().startRecording(shortcut);
  }
}
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <h3 style="margin-bottom: 20px">Current: {{ keys }}</h3>
    <div v-for="shortcut in shortcuts" style="display: flex; gap: 40px; margin-bottom: 40px;">
      <span>Shortcut: {{ shortcut.name }}</span>
      <span>{{ shortcut.currentHotkey }}</span>
      <button @click="startRecordShortcut(shortcut.name)" :disabled="isRecordingShortcut">
        Record Shortcut
      </button>
    </div>
    <KeyboardHandler />
    <Widget />
    <Widget2 />
  </div>
</template>
