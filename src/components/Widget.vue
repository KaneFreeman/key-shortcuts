<template>
  <div>Shortcut for widget 1 called {{ shortcutCalled }} times</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { useShortcutStore } from "./stores/shortcut";

@Component({})
export default class Widget extends Vue {
  shortcutCalled = 0;

  mounted() {
    useShortcutStore().registerShortcut('widget1', 'Shift + B', this.shortcutFn.bind(this))
  }

  beforeDestroy() {
    useShortcutStore().unregisterShortcut('widget1')
  }

  shortcutFn() {
    this.shortcutCalled++;
  }
}
</script>
