import { computed } from "vue";
import { useI18n } from "vue-i18n";

const FEATURE_COUNT = 4;

/**
 * NOTE: `stripePlan` is the tier identifier sent to POST /subscriptions/checkout and
 * returned as `subscription.plan`. It must match a `SubscriptionPlan` enum name on the
 * backend (Subscriptions/Domain/Model/ValueObjects/SubscriptionPlan.cs): TrekkerAdventurer,
 * AgencyBase or AgencyPro. Explorer has no backend plan — it's the free tier, included by
 * default with no checkout/subscription row.
 */
const PLAN_DEFINITIONS = {
  trekker: [
    { id: "explorer", stripePlan: null, tier: "free", i18nKey: "iam.sign-up.plans.trekker.explorer" },
    { id: "recommended", stripePlan: "TrekkerAdventurer", tier: "paid", recommended: true, i18nKey: "iam.sign-up.plans.trekker.recommended" }
  ],
  agency: [
    { id: "base", stripePlan: "AgencyBase", tier: "paid", i18nKey: "iam.sign-up.plans.agency.base" },
    { id: "recommended", stripePlan: "AgencyPro", tier: "paid", recommended: true, i18nKey: "iam.sign-up.plans.agency.recommended" }
  ]
};

/**
 * Shared catalog of trekker/agency plans, used by both the sign-up plan
 * picker and the subscriptions checkout page so their content never drifts.
 * @returns {{trekkerPlans: import('vue').ComputedRef<Array>, agencyPlans: import('vue').ComputedRef<Array>}}
 */
export function usePlanCatalog() {
  const { t } = useI18n();

  function buildPlan(definition) {
    const features = Array.from(
      { length: FEATURE_COUNT },
      (_, i) => t(`${definition.i18nKey}.feature-${i + 1}`)
    );
    return {
      id: definition.id,
      stripePlan: definition.stripePlan,
      tier: definition.tier,
      recommended: Boolean(definition.recommended),
      name: t(`${definition.i18nKey}.name`),
      badge: t(`${definition.i18nKey}.badge`),
      description: t(`${definition.i18nKey}.description`),
      price: t(`${definition.i18nKey}.price`),
      features
    };
  }

  const trekkerPlans = computed(() => PLAN_DEFINITIONS.trekker.map(buildPlan));
  const agencyPlans = computed(() => PLAN_DEFINITIONS.agency.map(buildPlan));

  return { trekkerPlans, agencyPlans };
}
