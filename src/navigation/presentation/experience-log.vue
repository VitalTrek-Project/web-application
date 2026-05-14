<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

import useNavigationStore from "../application/navigation.store.js";

const { t } = useI18n();
const store = useNavigationStore();

/**
 * STATE
 */
const note = ref("");
const mediaFile = ref(null);
const saving = ref(false);

/**
 * DATA FROM STORE
 */
const experiences = computed(() =>
    store.experiences ?? []
);

/**
 * METHODS
 */
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

    // reset
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
  <div class="experience-log">
    <h3>{{ t('experience.title') }}</h3>

    <!-- FORM -->
    <div class="experience-form">
      <pv-textarea
          v-model="note"
          :placeholder="t('experience.placeholder')"
          rows="3"
          auto-resize
          class="w-full"
      />

      <input
          type="file"
          @change="handleFileChange"
      />

      <pv-button
          icon="pi pi-save"
          :label="t('experience.save')"
          @click="saveExperience"
          :loading="saving"
          :disabled="!note && !mediaFile"
      />
    </div>

    <!-- LIST -->
    <div class="experience-list">
      <h4>{{ t('experience.history') }}</h4>

      <div v-if="!experiences.length">
        {{ t('experience.empty') }}
      </div>

      <div
          v-else
          v-for="exp in experiences"
          :key="exp.id"
          class="experience-item"
      >
        <p class="note">
          {{ exp.note }}
        </p>

        <img
            v-if="exp.mediaUrl"
            :src="exp.mediaUrl"
            alt="experience"
            class="media"
        />

        <small class="date">
          {{ exp.createdAt }}
        </small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.experience-log {
  background: #33465f;
  border: 1px solid rgba(185, 198, 216, 0.16);
  border-radius: 10px;
  padding: 16px;
  color: #ffffff;
}

.experience-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.experience-list {
  margin-top: 12px;
}

.experience-item {
  background: #3b506b;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}

.note {
  margin-bottom: 6px;
}

.media {
  max-width: 100%;
  border-radius: 6px;
  margin-top: 6px;
}

.date {
  font-size: 0.7rem;
  color: #d0d9e6;
}
</style>
