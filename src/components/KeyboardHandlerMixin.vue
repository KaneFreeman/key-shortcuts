<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { useShortcutStore } from "./stores/shortcut";

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
export default class KeyboardHandlerMixin extends Vue {
  keys: Record<string, boolean> = {};

  handler: number | null = null;

  numKeysRecorded = 0;
  recordedShortcut: string | null = null;
  recordingShortcutTimeout: number | null = null;

  get recordingShortcut() {
    return useShortcutStore().recordingShortcut;
  }

  get hotkeyToAction() {
    return useShortcutStore().hotkeyToAction;
  }

  created() {
    window.addEventListener("keydown", this.keydownHandler);
    window.addEventListener("keyup", this.keyupHandler);
  }

  beforeDestroy() {
    window.removeEventListener("keydown", this.keydownHandler);
    window.removeEventListener("keyup", this.keyupHandler);
  }

  handleHotkeyEvent(event?: KeyboardEvent) {
    const keys = this.getSortedKeys();
    const keysStr = keys.join(" + ");

    if (this.recordingShortcut) {
      event?.preventDefault();
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
      event?.preventDefault();
      hotkeyToAction[keysStr]();
    }
  }

  endRecordShortcut() {
    if (!this.recordingShortcut) {
      return;
    }

    if (this.recordedShortcut) {
      useShortcutStore().updateShortcut(this.recordingShortcut, this.recordedShortcut);
      this.recordedShortcut = null;
    } else {
      useShortcutStore().endRecording();
    }

    this.numKeysRecorded = 0;
  }

  getSortedKeys(): string[] {
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

    return finalKeys;
  }

  getKey(event: KeyboardEvent): string {
    return /^[a-zA-Z]{1}$/.test(event.key) ? event.key.toUpperCase() : event.key;
  }

  handleTimeout(): void {
    if (this.handler) {
      clearTimeout(this.handler);
      this.handler = null;
    }

    this.handler = setTimeout(() => {
      this.keys = {};
      this.handleHotkeyEvent();
    }, 2000);
  }

  keydownHandler(event: KeyboardEvent) {
    if (event.key in this.keys) {
      return;
    }
    this.keys[this.getKey(event)] = true;
    this.handleHotkeyEvent(event);
    this.handleTimeout();
  }

  keyupHandler(event: KeyboardEvent) {
    delete this.keys[this.getKey(event)];
    this.handleHotkeyEvent(event);
    this.handleTimeout();
  }
}
</script>
