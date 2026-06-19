import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";

/**
 * Shared incident-report flow used by the tourist map and the global SOS button.
 *
 * Opens a confirmation dialog and, on accept, simulates dispatching an emergency
 * incident with immediate visual feedback (sending -> sent toasts).
 *
 * @returns {{ reportIncident: (context?: Object) => void }}
 */
export function useIncidentReport() {
  const confirm = useConfirm();
  const toast = useToast();
  const { t } = useI18n();

  function dispatchIncident(context) {
    toast.add({
      severity: "warn",
      summary: t("incident.sending-summary"),
      detail: t("incident.sending-detail"),
      life: 2000
    });

    // Simulated emergency dispatch (no backend endpoint in the mock API).
    console.log("Incident reported:", context);

    setTimeout(() => {
      toast.add({
        severity: "success",
        summary: t("incident.sent-summary"),
        detail: t("incident.sent-detail"),
        life: 5000
      });
    }, 1200);
  }

  /**
   * @param {Object} [context] - Optional metadata (expeditionId, checkpoint, etc.).
   */
  function reportIncident(context = {}) {
    confirm.require({
      message: t("incident.confirm-message"),
      header: t("incident.confirm-header"),
      icon: "pi pi-exclamation-triangle",
      acceptProps: {
        label: t("incident.confirm-accept"),
        severity: "danger",
        icon: "pi pi-send"
      },
      rejectProps: {
        label: t("incident.confirm-reject"),
        severity: "secondary",
        outlined: true
      },
      accept: () => dispatchIncident(context)
    });
  }

  return { reportIncident };
}