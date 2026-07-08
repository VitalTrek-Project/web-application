<script setup>
import { useI18n } from "vue-i18n";

const props = defineProps({
  completeness: { type: Object, default: null }
});

const { t } = useI18n();

const fieldLabels = {
  emergencyContact: "profile.completeness.fields.emergencyContact",
  identityDocument: "profile.completeness.fields.identityDocument",
  phoneNumber: "profile.completeness.fields.phoneNumber",
  dateOfBirth: "profile.completeness.fields.dateOfBirth",
  nationality: "profile.completeness.fields.nationality"
};
</script>

<template>
  <section v-if="completeness" class="support-info-card completeness-card">
    <div class="completeness-header">
      <h3>{{ t("profile.completeness.title") }}</h3>
      <span class="completeness-percentage">{{ completeness.completionPercentage }}%</span>
    </div>
    <div class="community-stat-bar completeness-bar">
      <div class="community-stat-fill" :style="{ width: `${completeness.completionPercentage}%` }" />
    </div>
    <p v-if="completeness.canJoinExpedition" class="completeness-ready">
      {{ t("profile.completeness.ready") }}
    </p>
    <template v-else>
      <p class="completeness-missing-intro">{{ t("profile.completeness.missing-intro") }}</p>
      <ul class="completeness-missing-list">
        <li v-for="field in completeness.missingFields" :key="field">
          {{ t(fieldLabels[field] || field) }}
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
.completeness-card {
  margin-bottom: 24px;
}

.completeness-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.completeness-header h3 {
  margin: 0;
}

.completeness-percentage {
  font-weight: 800;
  color: #ffb07a;
  font-size: 1.1rem;
}

.completeness-bar {
  margin-bottom: 12px;
}

.completeness-ready {
  color: #86efac;
  font-size: 0.82rem;
  margin: 0;
}

.completeness-missing-intro {
  color: #fca5a5;
  font-size: 0.82rem;
  margin: 0 0 6px;
}

.completeness-missing-list {
  margin: 0;
  padding-left: 18px;
  color: #cbd5e1;
  font-size: 0.8rem;
}
</style>
