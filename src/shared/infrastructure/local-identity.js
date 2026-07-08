function generateUuid() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    // Fallback RFC4122-ish v4 UUID for environments without crypto.randomUUID.
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
        const random = (Math.random() * 16) | 0;
        const value = char === "x" ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    });
}

const LOCAL_AGENCY_ID_KEY = "vitaltrek_local_agency_id";
const SELECTED_AGENCY_ID_KEY = "vitaltrek_selected_agency_id";

/**
 * Returns the agency context for loyalty/metrics views.
 * Prefer an explicitly selected agency, then fall back to a persisted local
 * placeholder until booking / multi-agency directory exists.
 */
export function getLocalAgencyId() {
    const selected = localStorage.getItem(SELECTED_AGENCY_ID_KEY);
    if (selected) return selected;

    let id = localStorage.getItem(LOCAL_AGENCY_ID_KEY);
    if (!id) {
        id = generateUuid();
        localStorage.setItem(LOCAL_AGENCY_ID_KEY, id);
    }
    return id;
}

/**
 * Persists the agency a tourist is browsing (e.g. after booking or deep-link).
 * @param {string} agencyId
 */
export function setSelectedAgencyId(agencyId) {
    if (agencyId) {
        localStorage.setItem(SELECTED_AGENCY_ID_KEY, String(agencyId));
    } else {
        localStorage.removeItem(SELECTED_AGENCY_ID_KEY);
    }
}
