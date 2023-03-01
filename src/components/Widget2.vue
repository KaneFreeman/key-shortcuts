<template>
  <div>Shortcut for widget 2 called {{ shortcutCalled }} times</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { useShortcutStore } from "./stores/shortcut";

@Component({})
export default class Widget2 extends Vue {
  shortcutCalled = 0;

  mounted() {
    useShortcutStore().registerShortcut('widget2', 'Shift + F', this.shortcutFn.bind(this))
  }

  beforeDestroy() {
    useShortcutStore().unregisterShortcut('widget2')
  }

  shortcutFn() {
    this.shortcutCalled++;
  }
}
</script>
