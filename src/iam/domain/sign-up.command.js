/**
 * Command used by IAM application services to register a new user.
 *
 * @class SignUpCommand
 */
export class SignUpCommand {
    /**
     * @param {Object} params - Command attributes.
     * @param {string} params.username - Desired username.
     * @param {string} params.password - Desired password.
     * @param {string} params.role - Desired role: 'Tourist' or 'Agency'.
     */
    constructor({username, password, role}) {
        this.username = username;
        this.password = password;
        this.role = role;
    }
}
