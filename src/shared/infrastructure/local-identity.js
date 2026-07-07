const LOCAL_USER_ID_KEY = "vitaltrek_local_user_id";

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

/**
 * Returns a per-browser identifier persisted in localStorage. There is no
 * authentication yet (IAM bounded context pending), so this is used as a
 * stand-in "current user id" wherever the backend expects one (e.g. Support
 * tickets' userId), consistent with the rest of the app not having real
 * per-user identity today.
 */
export function getLocalUserId() {
    let id = localStorage.getItem(LOCAL_USER_ID_KEY);
    if (!id) {
        id = generateUuid();
        localStorage.setItem(LOCAL_USER_ID_KEY, id);
    }
    return id;
}
