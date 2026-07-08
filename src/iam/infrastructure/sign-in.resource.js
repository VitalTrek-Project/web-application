/**
 * Infrastructure resource returned by the authentication endpoint.
 *
 * @class SignInResource
 */
export class SignInResource {
    /**
     * @param {{id: string, username: string, role: string, agencyId: string|null, token: string}} params - Resource payload.
     */
    constructor({id, username, role, agencyId, token}) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.agencyId = agencyId ?? null;
        this.token = token;
    }
}
