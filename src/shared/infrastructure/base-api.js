import axios from "axios";

<<<<<<< HEAD
const platformApi = String(import.meta.env.VITE_API_BASE_URL ?? '').trim();
=======
// Support either the new generic VITE_API_BASE_URL or the older VITE_VITALTREK_PLATFORM_API_URL
const platformApi = String(import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_VITALTREK_PLATFORM_API_URL ?? "").trim();
>>>>>>> feature/navigation

/**
 * Shared infrastructure base class that owns the configured Axios client.
 * Bounded-context adapters extend this class to access a consistent HTTP gateway.
 *
 * @class BaseApi
 */
export class BaseApi {
    /** @type {import('axios').AxiosInstance} */
    #http;

    /** Initializes the shared Axios client with environment-driven configuration. */
    constructor() {
        if (!platformApi) {
            // Helpful warning for local development when env vars are missing
            // eslint-disable-next-line no-console
            console.warn('BaseApi: API base URL not configured (VITE_API_BASE_URL or VITE_VITALTREK_PLATFORM_API_URL). Requests may fail.');
        }

        this.#http = axios.create({
            baseURL: platformApi || undefined,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            timeout: 10000
        });

        // Centralized response interceptor to normalize errors if needed
        this.#http.interceptors.response.use(
            response => response,
            error => Promise.reject(error?.response ?? error)
        );
    }

    /**
     * Axios client used by infrastructure endpoint adapters.
     * @returns {import('axios').AxiosInstance}
     */
    get http() {
        return this.#http;
    }
}
