import { createPinia, PiniaVuePlugin } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import Vue from "vue";
import App from "./App.vue";

Vue.use(PiniaVuePlugin);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

import "./assets/main.css";

new Vue({
  render: (h) => h(App),
  pinia,
}).$mount("#app");
