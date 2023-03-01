<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import KeyboardHandler from "./KeyboardHandler.vue";
import { useShortcutStore } from "./stores/shortcut";
import Widget from "./Widget.vue";
import Widget2 from "./Widget2.vue";

@Component({ components: { KeyboardHandler, Widget, Widget2 } })
export default class HelloWorld extends Vue {
  keys = "";

  keyEvents: Record<string, () => void> = {};

  recordingShortcut: string | null = null;
  numKeysRecorded = 0;
  recordedShortcut: string | null = null;
  recordingShortcutTimeout: number | null = null;

  get shortcuts() {
    return useShortcutStore().shortcuts;
  }

  get hotkeyToAction() {
    return useShortcutStore().hotkeyToAction;
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

    const hotkeyToAction = this.hotkeyToAction;
    if (keysStr in hotkeyToAction) {
      hotkeyToAction[keysStr]();
    }
  }

  startRecordShortcut(shortcut: string) {
    this.recordingShortcut = shortcut;
  }

  endRecordShortcut() {
    if (!this.recordingShortcut) {
      return;
    }

    if (this.recordedShortcut) {
      useShortcutStore().updateShortcut(this.recordingShortcut, this.recordedShortcut);
      this.recordedShortcut = null;
    }

    this.recordingShortcut = null;
    this.numKeysRecorded = 0;
  }

  shortcutEvent() {
    console.log("You just triggered a shortcut event!");
  }
}
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <h3 style="margin-bottom: 20px">Current: {{ keys }}</h3>
    <div v-for="shortcut in shortcuts" style="display: flex; gap: 40px; margin-bottom: 40px;">
      <span>Shortcut: {{ shortcut.name }}</span>
      <span>{{ shortcut.currentHotkey }}</span>
      <button @click="startRecordShortcut(shortcut.name)" :disabled="Boolean(recordingShortcut)">
        Record Shortcut
      </button>
    </div>
    <KeyboardHandler @keydown="updateKeys" />
    <Widget />
    <Widget2 />
  </div>
</template>
