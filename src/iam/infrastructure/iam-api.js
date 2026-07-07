import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";
import {BaseApi} from "../../shared/infrastructure/base-api.js";
const signInEndpointPath = import.meta.env.VITE_SIGNIN_ENDPOINT_PATH;
const signUpEndpointPath = import.meta.env.VITE_SIGNUP_ENDPOINT_PATH;
const usersEndpointPath   = import.meta.env.VITE_USERS_ENDPOINT_PATH;

/**
 * Infrastructure adapter for IAM HTTP endpoints.
 *
 * @class IamApi
 * @extends BaseApi
 */
export class IamApi extends BaseApi {
    #signInEndpoint;
    #signUpEndpoint;
    #usersEndpoint;

    /** Creates endpoint clients for sign-in, sign-up, and user listing. */
    constructor() {
        super();
        this.#signInEndpoint = new BaseEndpoint(this, signInEndpointPath);
        this.#signUpEndpoint = new BaseEndpoint(this, signUpEndpointPath);
        this.#usersEndpoint = new BaseEndpoint(this, usersEndpointPath);
    }

    /**
     * Sends a sign-in command to the authentication endpoint.
     * @param {import('../domain/sign-in.command.js').SignInCommand} signInRequest - Sign-in command.
     * @returns {Promise<import('axios').AxiosResponse<{id: number|string, username: string, token: string}>>} HTTP response with authentication resource.
     */
    signIn(signInRequest) {
        return this.#signInEndpoint.create(signInRequest);
    }

    /**
     * Sends a sign-up command to the registration endpoint.
     * @param {import('../domain/sign-up.command.js').SignUpCommand} signUpRequest - Sign-up command.
     * @returns {Promise<import('axios').AxiosResponse<{message: string}>>} HTTP response with registration resource.
     */
    signUp(signUpRequest) {
        return this.#signUpEndpoint.create(signUpRequest);
    }

    /**
     * Retrieves users visible to the IAM context.
     * @returns {Promise<import('axios').AxiosResponse<Array<{id: number|string, username: string}>|{users:Array<{id: number|string, username: string}>}>>} HTTP response with user resources.
     */
    getUsers() {
        return this.#usersEndpoint.getAll();
    }
}