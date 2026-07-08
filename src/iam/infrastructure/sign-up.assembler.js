import {SignUpResource} from "./sign-up.resource.js";

/**
 * Maps registration endpoint responses into IAM infrastructure resources.
 *
 * @class SignUpAssembler
 */
export class SignUpAssembler {
    /**
     * @param {import('axios').AxiosResponse<{message: string}>} response - HTTP response from sign-up endpoint.
     * @returns {SignUpResource|null} Parsed resource when the response is successful; otherwise null.
     */
    static toResourceFromResponse(response) {
        if (response.status < 200 || response.status >= 300) {
            console.error(`${response.status}, ${response.statusText}`);
            return null;
        }
        const data = response.data ?? {};
        const message = typeof data.message === "string"
            ? data.message
            : data.message?.value ?? data.message?.name ?? "User created successfully";
        return new SignUpResource({message});
    }
}