<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import useNavigationStore from "../application/navigation.store.js";
import NavigationPanel from "./components/navigation-panel.vue";
import { formatNavigationDate } from "./utils/navigation-presenter.js";

const { t } = useI18n();
const store = useNavigationStore();
const { experiences, errors } = storeToRefs(store);
const { ensureExpeditionLoaded, fetchExperiences } = store;

const note = ref("");
const mediaFile = ref(null);
const saving = ref(false);

onMounted(async () => {
  try {
    const expedition = await ensureExpeditionLoaded(3);
    await fetchExperiences(expedition.id);
  } catch {
    /* errors shown in template */
  }
});

const handleFileChange = (event) => {
  const file = event.target.files?.[0];
  mediaFile.value = file ?? null;
};

const saveExperience = async () => {
  if (!note.value && !mediaFile.value) return;

  saving.value = true;
  try {
    await store.recordExperience({
      note: note.value,
      media: mediaFile.value
    });
    note.value = "";
    mediaFile.value = null;
  } catch (error) {
    console.error(error);
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <NavigationPanel>
    <div class="navigation-card">
      <div class="navigation-dashboard-header">
        <div>
          <h2 class="navigation-section-title">{{ t("experience.title") }}</h2>
          <p class="navigation-meta">{{ t("experience.subtitle") }}</p>
        </div>
      </div>

      <section class="navigation-info-card">
        <h3>{{ t("experience.new-entry") }}</h3>

        <form class="bc-form" @submit.prevent="saveExperience">
          <div class="bc-form-field">
            <pv-textarea
                v-model="note"
                :placeholder="t('experience.placeholder')"
                rows="4"
                auto-resize
                class="w-full"
            />
          </div>

          <div class="bc-form-field">
            <label class="navigation-meta">{{ t("experience.attach-media") }}</label>
            <input type="file" class="navigation-file-input" @change="handleFileChange" />
          </div>

          <div class="bc-form-actions">
            <pv-button
                type="submit"
                icon="pi pi-save"
                :label="t('experience.save')"
                class="navigation-primary-button"
                :loading="saving"
                :disabled="!note && !mediaFile"
            />
          </div>
        </form>
      </section>

      <section class="navigation-info-card" style="margin-top: 20px">
        <h3>{{ t("experience.history") }}</h3>

        <p v-if="!experiences.length" class="navigation-empty">
          {{ t("experience.empty") }}
        </p>

        <div v-else class="navigation-experience-timeline">
          <article
              v-for="exp in experiences"
              :key="exp.id"
              class="navigation-experience-card"
          >
            <p>{{ exp.note }}</p>
            <img v-if="exp.mediaUrl" :src="exp.mediaUrl" alt="experience" />
            <time>{{ formatNavigationDate(exp.createdAt) }}</time>
          </article>
        </div>
      </section>

      <div v-if="errors.length" class="monitoring-error">
        {{ t("errors.occurred") }}:
        {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </NavigationPanel>
</template>

<style scoped>
.navigation-file-input {
  display: block;
  width: 100%;
  margin-top: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px dashed rgba(148, 163, 184, 0.35);
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;
  font-size: 0.82rem;
}
</style>
