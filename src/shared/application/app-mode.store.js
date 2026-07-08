import { defineStore } from 'pinia';
import { ref } from 'vue';

// Once a user is authenticated, the router derives `mode` automatically from
// their IAM role claim (see router.js). This store still holds `mode` for
// unauthenticated/pre-sign-in browsing via the manual mode-selector.
export const useAppModeStore = defineStore('appMode', () => {
  // null = sin modo seleccionado; 'trekker' | 'empresa' una vez elegido
  const mode = ref(null);

  function setMode(newMode) {
    mode.value = newMode;
  }

  function clearMode() {
    mode.value = null;
  }

  return { mode, setMode, clearMode };
});