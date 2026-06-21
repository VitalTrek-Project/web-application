import { defineStore } from 'pinia';
import { ref } from 'vue';

// TODO [IAM]: Este store es temporal. Cuando se implemente el bounded context IAM
// en el backend (Account + TrekkerProfile / CompanyProfile con JWT), eliminar este
// store y derivar el modo del claim `role` del token. Ver análisis en:
// vital-trek-platform/NexumDevs.VitalTrek.Platform/Iam (pendiente de implementación).
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