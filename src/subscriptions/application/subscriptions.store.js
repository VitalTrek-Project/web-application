import {defineStore} from "pinia";
import {ref} from "vue";
import {SubscriptionsApi} from "../infrastructure/subscriptions-api.js";
import {SubscriptionAssembler} from "../infrastructure/subscription.assembler.js";

const subscriptionsApi = new SubscriptionsApi();

/**
 * Application store for subscription queries and checkout/cancel commands.
 */
const useSubscriptionsStore = defineStore("subscriptions", () => {
    const subscription = ref(null);
    const checkoutUrl = ref(null);
    const loading = ref(false);
    const errors = ref([]);

    function toErrorMessage(error) {
        return error?.data?.detail
            ?? error?.data?.title
            ?? error?.data?.message
            ?? error?.message
            ?? "Something went wrong with subscriptions.";
    }

    async function fetchMySubscription() {
        loading.value = true;
        errors.value = [];
        try {
            const response = await subscriptionsApi.getMySubscription();
            subscription.value = SubscriptionAssembler.toEntityFromResponse(response);
            return subscription.value;
        } catch (error) {
            if (error?.status === 404) {
                subscription.value = null;
                return null;
            }
            errors.value = [toErrorMessage(error)];
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function startCheckout(plan) {
        loading.value = true;
        errors.value = [];
        checkoutUrl.value = null;
        try {
            const response = await subscriptionsApi.createCheckoutSession(plan);
            checkoutUrl.value = response.data?.checkoutUrl ?? null;
            return checkoutUrl.value;
        } catch (error) {
            errors.value = [toErrorMessage(error)];
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function cancelSubscription() {
        loading.value = true;
        errors.value = [];
        try {
            const response = await subscriptionsApi.cancelMySubscription();
            subscription.value = SubscriptionAssembler.toEntityFromResponse(response)
                ?? subscription.value;
            return subscription.value;
        } catch (error) {
            errors.value = [toErrorMessage(error)];
            throw error;
        } finally {
            loading.value = false;
        }
    }

    return {
        subscription,
        checkoutUrl,
        loading,
        errors,
        fetchMySubscription,
        startCheckout,
        cancelSubscription
    };
});

export default useSubscriptionsStore;
