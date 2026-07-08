import {BaseApi} from "../../shared/infrastructure/base-api.js";

const subscriptionsEndpointPath =
    import.meta.env.VITE_SUBSCRIPTIONS_ENDPOINT_PATH || "/subscriptions";

/**
 * Infrastructure adapter for subscription & Stripe checkout endpoints.
 *
 * @class SubscriptionsApi
 * @extends BaseApi
 */
export class SubscriptionsApi extends BaseApi {
    /**
     * Starts a Stripe Checkout session for the current authenticated user.
     * @param {string} plan
     */
    createCheckoutSession(plan) {
        return this.http.post(`${subscriptionsEndpointPath}/checkout`, {plan});
    }

    /**
     * Returns the current user's subscription.
     */
    getMySubscription() {
        return this.http.get(`${subscriptionsEndpointPath}/me`);
    }

    /**
     * Cancels the current user's active subscription.
     */
    cancelMySubscription() {
        return this.http.post(`${subscriptionsEndpointPath}/me/cancel`);
    }
}
