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

/**
 * Returns a per-browser identifier persisted in localStorage, standing in for
 * "the agency whose loyalty program a tourist is currently browsing". There
 * is no multi-agency directory or booking flow yet to derive this from, so
 * tourist-facing Loyalty views still use this placeholder even though real
 * user identity now comes from the IAM bounded context (see iam.store.js).
 * Agency-role users' own agencyId comes from their authenticated session
 * (useIamStore().currentAgencyId), not from here.
 */
export function getLocalAgencyId() {
    let id = localStorage.getItem(LOCAL_AGENCY_ID_KEY);
    if (!id) {
        id = generateUuid();
        localStorage.setItem(LOCAL_AGENCY_ID_KEY, id);
    }
    return id;
}
