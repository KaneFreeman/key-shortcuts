import { defineStore } from "pinia";

interface Shortcut {
  name: string;
  currentHotkey: string;
  defaultHotkey: string;
  action: () => void;
}

export const useShortcutStore = defineStore({
  id: "shortcut",
  state: () => ({
    recordingShortcut: null as string | null,
    shortcuts: [] as Shortcut[],
    shortcutByName: {} as Record<string, Shortcut>,
    hotkeyToAction: {} as Record<string, () => void>,
  }),
  getters: {
    isRecording: (state) => Boolean(state.recordingShortcut)
  },
  actions: {
    startRecording(name: string) {
      this.recordingShortcut = name;
    },
    endRecording() {
      this.recordingShortcut = null;
    },
    updateShortcut(name: string, hotkey: string) {
      if (!(name in this.shortcutByName)) {
        return;
      }
      delete this.hotkeyToAction[this.shortcutByName[name].currentHotkey];
      this.hotkeyToAction[hotkey] = this.shortcutByName[name].action;
      this.shortcutByName[name].currentHotkey = hotkey;
      localStorage.setItem(`shortcut-${name}`, hotkey);
      this.recordingShortcut = null;
      console.info(`Hotkey updated for shortcut \"${name}\". New hotkey:`, hotkey);
    },
    registerShortcut(name: string, defaultHotkey: string, action: () => void) {
      if (name in this.shortcutByName) {
        console.warn(
          `Shortcut already registered with name \"${name}\". Hotkey: `,
          this.shortcutByName[name].currentHotkey
        );
        return;
      }
      const currentHotkey = localStorage.getItem(`shortcut-${name}`) ?? defaultHotkey;

      const shortcut: Shortcut = {
        name,
        currentHotkey,
        defaultHotkey,
        action,
      };

      this.shortcutByName[name] = shortcut;

      this.hotkeyToAction[currentHotkey] = action;
      this.shortcuts.push(shortcut);
      this.shortcuts.sort((a, b) => a.name.localeCompare(b.name))
      console.info(`Shortcut registered with name \"${name}\". Hotkey: `, currentHotkey);
    },
    unregisterShortcut(name: string) {
      if (!(name in this.shortcutByName)) {
        return;
      }
      const shortcut = this.shortcutByName[name];
      delete this.hotkeyToAction[shortcut.currentHotkey];
      delete this.shortcutByName[name];
      
      var index = this.shortcuts.indexOf(shortcut);
      if (index !== -1) {
        this.shortcuts.splice(index, 1);
      }

      console.info(`Shortcut unregistered with name \"${name}\"`);
    },
  },
});
