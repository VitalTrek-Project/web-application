import { defineStore } from 'pinia';
import { ref } from 'vue';

// `mode` is derived exclusively from the authenticated user's IAM role claim
// (see router.js). It is null while signed out, showing every nav item.
export const useAppModeStore = defineStore('appMode', () => {
  // null = sin sesión iniciada; 'trekker' | 'empresa' según el rol autenticado
  const mode = ref(null);

  function setMode(newMode) {
    mode.value = newMode;
  }

  function clearMode() {
    mode.value = null;
  }

  return { mode, setMode, clearMode };
});