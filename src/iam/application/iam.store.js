import {IamApi} from "../infrastructure/iam-api.js";
import {defineStore} from "pinia";
import {ref} from "vue";
import {SignInAssembler} from "../infrastructure/sign-in.assembler.js";
import {UserAssembler} from "../infrastructure/user.assembler.js";
import {SignUpAssembler} from "../infrastructure/sign-up.assembler.js";
import {SignInCommand} from "../domain/sign-in.command.js";
import {SignUpCommand} from "../domain/sign-up.command.js";

const iamApi = new IamApi();
const SESSION_STORAGE_KEY = "vitaltrek_iam_session";

/**
 * Reads a previously persisted session (id, username, role, agencyId, token) from localStorage.
 * @returns {{id: string, username: string, role: string, agencyId: string|null, token: string}|null}
 */
function readPersistedSession() {
    try {
        const raw = localStorage.getItem(SESSION_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

/**
 * Extracts a human-readable message from an error thrown by the shared Axios client.
 * @param {*} error - Error captured while executing an IAM use case.
 * @returns {string}
 */
function toErrorMessage(error) {
    return error?.data?.detail ?? error?.data?.title ?? error?.message ?? "Something went wrong. Please try again.";
}

/**
 * Application service store for the IAM bounded context.
 * It coordinates authentication commands and exposes UI-facing auth state.
 *
 * @returns {Object} Reactive IAM state and use-case actions.
 */
const useIamStore = defineStore('iam', () => {
    const persisted = readPersistedSession();

    /** @type {import('vue').Ref<Array<import('../domain/user.entity.js').User>>} Collection of IAM user entities. */
    const users = ref([]);
    /** @type {import('vue').Ref<Array<string>>} Human-readable errors captured while executing IAM use cases. */
    const errors = ref([]);
    /** @type {import('vue').Ref<boolean>} Flag indicating if users have been loaded. */
    const usersLoaded = ref(false);
    /** @type {import('vue').Ref<boolean>} Flag indicating if a user is signed in. */
    const isSignedIn = ref(Boolean(persisted));
    /** @type {import('vue').Ref<string|null>} Identifier of the active session user. */
    const currentUserId = ref(persisted?.id ?? null);
    /** @type {import('vue').Ref<string|null>} Username of the active session. */
    const currentUsername = ref(persisted?.username ?? null);
    /** @type {import('vue').Ref<string|null>} Role of the active session user: 'Tourist' or 'Agency'. */
    const currentRole = ref(persisted?.role ?? null);
    /** @type {import('vue').Ref<string|null>} Agency identifier, present only for Agency-role sessions. */
    const currentAgencyId = ref(persisted?.agencyId ?? null);
    /** @type {import('vue').Ref<string|null>} JWT access token for the active session. */
    const currentToken = ref(persisted?.token ?? null);

    /**
     * Persists the active session so it survives a page reload.
     * @param {{id: string, username: string, role: string, agencyId: string|null, token: string}} session
     */
    function persistSession(session) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }

    /**
     * Executes the sign-in use case and updates authentication state.
     * @param {SignInCommand} signInCommand - Sign-in command.
     * @param {import('vue-router').Router} router - Router used to redirect on result.
     * @param {string|null} [redirectTo] - Optional path to navigate to after a successful sign-in.
     * @returns {Promise<void>}
     */
    async function signIn(signInCommand, router, redirectTo = null) {
        try {
            const response = await iamApi.signIn(signInCommand);
            const signInResource = SignInAssembler.toResourceFromResponse(response);
            if (!signInResource) throw new Error('Sign-in failed');

            currentUserId.value = signInResource.id;
            currentUsername.value = signInResource.username;
            currentRole.value = signInResource.role;
            currentAgencyId.value = signInResource.agencyId;
            currentToken.value = signInResource.token;
            isSignedIn.value = true;
            persistSession({
                id: signInResource.id,
                username: signInResource.username,
                role: signInResource.role,
                agencyId: signInResource.agencyId,
                token: signInResource.token
            });
            errors.value = [];
            await router.push(redirectTo ?? {name: 'home'});
        } catch (error) {
            isSignedIn.value = false;
            errors.value = [toErrorMessage(error)];
        }
    }

    /**
     * Executes the sign-up use case and routes the user to the sign-in screen.
     * @param {SignUpCommand} signUpCommand - Sign-up command.
     * @param {import('vue-router').Router} router - Router used to redirect on result.
     * @returns {Promise<void>}
     */
    async function signUp(signUpCommand, router) {
        try {
            const response = await iamApi.signUp(signUpCommand);
            const signUpResource = SignUpAssembler.toResourceFromResponse(response);
            if (!signUpResource) throw new Error('Sign-up failed');

            errors.value = [];
            await router.push({name: 'iam-sign-in'});
        } catch (error) {
            errors.value = [toErrorMessage(error)];
        }
    }

    /**
     * Clears the active IAM session and local auth artifacts.
     * @param {import('vue-router').Router} [router] - Router used to navigate to the sign-in screen after sign-out.
     */
    function signOut(router) {
        currentUserId.value = null;
        currentUsername.value = null;
        currentRole.value = null;
        currentAgencyId.value = null;
        currentToken.value = null;
        isSignedIn.value = false;
        localStorage.removeItem(SESSION_STORAGE_KEY);
        errors.value = [];
        if (router) router.push({name: 'iam-sign-in'});
    }

    /**
     * Loads user entities from infrastructure.
     * @returns {Promise<void>}
     */
    async function fetchUsers() {
        try {
            const response = await iamApi.getUsers();
            users.value = UserAssembler.toEntitiesFromResponse(response);
            usersLoaded.value = true;
            errors.value = [];
        } catch (error) {
            errors.value = [toErrorMessage(error)];
        }
    }

    return {
        users,
        errors,
        usersLoaded,
        currentUserId,
        currentUsername,
        currentRole,
        currentAgencyId,
        currentToken,
        isSignedIn,
        signIn,
        signUp,
        signOut,
        fetchUsers
    };
});

export default useIamStore;
