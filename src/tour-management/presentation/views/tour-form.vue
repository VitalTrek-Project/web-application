<script setup>
import { computed, onMounted, reactive, ref  } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";

import useTourManagementStore
  from "../../application/tourManagement.store.js";
import TourPanel from "../components/tour-panel.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const store = useTourManagementStore();

const loading = ref(false);

const saving = ref(false);

const isEditMode = computed(() => Boolean(route.params.id));

const form = reactive({
  id: null,
  agencyId: '',
  title: '',
  description: '',
  difficulty: 'easy',
  status: 'available',
  capacity: 1,
  checkpoints: []
});

const difficultyOptions = computed(() => [
  {
    label: t('tour.difficulty.easy'),
    value: 'easy'
  },
  {
    label: t('tour.difficulty.medium'),
    value: 'medium'
  },
  {
    label: t('tour.difficulty.difficult'),
    value: 'difficult'
  }
]);

const statusOptions = computed(() => [
  { label: t('tour.status.published'), value: 'published' },
  { label: t('tour.status.draft'), value: 'draft' },
  { label: t('tour.status.available'), value: 'available' },
  { label: t('tour.status.unavailable'), value: 'unavailable' }
]);

const fillForm = (tour) => {
  form.id = tour.id;
  form.agencyId = tour.agencyId ?? '';
  form.title = tour.title ?? '';
  form.description = tour.description ?? '';
  form.difficulty = tour.difficulty ?? 'easy';
  form.status = tour.status ?? 'available';
  form.capacity = Number(tour.capacity ?? 1);
  form.checkpoints = tour.checkpoints ?? [];
};

const goBackToList = () => {
  router.push({
    name: 'tour-management-tours'
  });
};

const addCheckpoint = () => {
  form.checkpoints.push({
    order: form.checkpoints.length + 1,
    name: '',
    latitude: null,
    longitude: null,
    bluetoothBeaconId: ''
  });
};

const removeCheckpoint = (index) => {
  form.checkpoints.splice(index, 1);
  form.checkpoints.forEach((checkpoint, i) => {
    checkpoint.order = i + 1;
  });
};

const moveCheckpoint = (index, direction) => {
  const target = index + direction;
  if (target < 0 || target >= form.checkpoints.length) return;
  const [moved] = form.checkpoints.splice(index, 1);
  form.checkpoints.splice(target, 0, moved);
  form.checkpoints.forEach((checkpoint, i) => {
    checkpoint.order = i + 1;
  });
};

const normalizeCheckpoints = () =>
  form.checkpoints.map((checkpoint, index) => ({
    order: index + 1,
    name: checkpoint.name,
    latitude:
        checkpoint.latitude === '' || checkpoint.latitude === null
            ? null
            : Number(checkpoint.latitude),
    longitude:
        checkpoint.longitude === '' || checkpoint.longitude === null
            ? null
            : Number(checkpoint.longitude),
    bluetoothBeaconId: checkpoint.bluetoothBeaconId ?? ''
  }));

const saveTour = async () => {
  saving.value = true;

  const tourPayload = {
    id: form.id,
    agencyId: form.agencyId,
    title: form.title,
    description: form.description,
    difficulty: form.difficulty,
    status: form.status,
    capacity: Number(form.capacity),
    checkpoints: normalizeCheckpoints()
  };

  try {
    if (isEditMode.value) {
      await store.updateTour(tourPayload);
    } else {
      await store.addTour(tourPayload);
    }

    toast.add({
      severity: 'success',
      summary: isEditMode.value
          ? t('tour.form.toast.updated-summary')
          : t('tour.form.toast.created-summary'),
      detail: t('tour.form.toast.detail', { title: form.title }),
      life: 3500
    });

    await router.push({
      name: 'tour-management-tours'
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: t('tour.form.toast.error-summary'),
      detail: t('tour.form.toast.error-detail'),
      life: 4000
    });
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  if (!isEditMode.value) return;

  loading.value = true;

  try {
    const tourId = route.params.id;

    const existingTour =
        store.tours.find(tour => String(tour.id) === String(tourId));

    if (existingTour) {
      fillForm(existingTour);
      return;
    }

    const fetchedTour = await store.fetchTourById(tourId);

    if (fetchedTour) {
      fillForm(fetchedTour);
    }
  } finally {
    loading.value = false;
  }
});

</script>

<template>
  <TourPanel>
    <div class="tour-card tour-form-card">
      <div class="tour-dashboard-header">
        <div>
          <h2 class="tour-section-title">
            {{ isEditMode ? t('tour.form.edit-title') : t('tour.form.create-title') }}
          </h2>
          <p class="tour-meta">
            {{ isEditMode ? t('tour.form.edit-description') : t('tour.form.create-description') }}
          </p>
        </div>
      </div>

      <section class="tour-info-card">
      <form class="tour-form" @submit.prevent="saveTour">
        <div v-if="loading" class="loading-message">
          {{ t('tour.form.loading') }}
        </div>

        <template v-else>
          <div class="form-grid">
            <div class="form-field">
              <label for="title">
                {{ t('tour.form.fields.title') }}
              </label>

              <pv-input-text
                  id="title"
                  v-model="form.title"
                  class="w-full"
                  required
              />
            </div>

            <div class="form-field">
              <label for="agencyId">
                {{ t('tour.form.fields.agency-id') }}
              </label>

              <pv-input-text
                  id="agencyId"
                  v-model="form.agencyId"
                  class="w-full"
              />
            </div>

            <div class="form-field full">
              <label for="description">
                {{ t('tour.form.fields.description') }}
              </label>

              <pv-textarea
                  id="description"
                  v-model="form.description"
                  class="w-full"
                  rows="4"
                  auto-resize
              />
            </div>

            <div class="form-field">
              <label for="difficulty">
                {{ t('tour.form.fields.difficulty') }}
              </label>

              <pv-select
                  id="difficulty"
                  v-model="form.difficulty"
                  :options="difficultyOptions"
                  option-label="label"
                  option-value="value"
                  class="w-full"
              />
            </div>

            <div class="form-field">
              <label for="status">
                {{ t('tour.form.fields.status') }}
              </label>

              <pv-select
                  id="status"
                  v-model="form.status"
                  :options="statusOptions"
                  option-label="label"
                  option-value="value"
                  class="w-full"
              />
            </div>

            <div class="form-field">
              <label for="capacity">
                {{ t('tour.form.fields.capacity') }}
              </label>

              <pv-input-number
                  id="capacity"
                  v-model="form.capacity"
                  class="w-full"
                  :min="1"
                  show-buttons
              />
            </div>
          </div>

          <section class="checkpoints-section">
            <div class="checkpoints-header">
              <div>
                <h3>{{ t('tour.form.checkpoints.title') }}</h3>
                <p>{{ t('tour.form.checkpoints.subtitle') }}</p>
              </div>
              <pv-button
                  type="button"
                  :label="t('tour.form.checkpoints.add')"
                  icon="pi pi-plus"
                  class="tour-primary-button"
                  @click="addCheckpoint"
              />
            </div>

            <p
                v-if="!form.checkpoints.length"
                class="checkpoints-empty"
            >
              {{ t('tour.form.checkpoints.empty') }}
            </p>

            <ul v-else class="checkpoints-list">
              <li
                  v-for="(checkpoint, index) in form.checkpoints"
                  :key="index"
                  class="checkpoint-row"
              >
                <span class="checkpoint-order">{{ index + 1 }}</span>

                <div class="checkpoint-fields">
                  <div class="checkpoint-field checkpoint-field--name">
                    <label>{{ t('tour.form.checkpoints.name') }}</label>
                    <pv-input-text
                        v-model="checkpoint.name"
                        class="w-full"
                        :placeholder="t('tour.form.checkpoints.name-placeholder')"
                    />
                  </div>
                  <div class="checkpoint-field">
                    <label>{{ t('tour.form.checkpoints.latitude') }}</label>
                    <pv-input-text
                        v-model="checkpoint.latitude"
                        class="w-full"
                        placeholder="-13.163"
                    />
                  </div>
                  <div class="checkpoint-field">
                    <label>{{ t('tour.form.checkpoints.longitude') }}</label>
                    <pv-input-text
                        v-model="checkpoint.longitude"
                        class="w-full"
                        placeholder="-72.545"
                    />
                  </div>
                  <div class="checkpoint-field">
                    <label>{{ t('tour.form.checkpoints.beacon') }}</label>
                    <pv-input-text
                        v-model="checkpoint.bluetoothBeaconId"
                        class="w-full"
                        :placeholder="t('tour.form.checkpoints.beacon-placeholder')"
                    />
                  </div>
                </div>

                <div class="checkpoint-actions">
                  <pv-button
                      type="button"
                      icon="pi pi-arrow-up"
                      rounded
                      text
                      :disabled="index === 0"
                      :aria-label="t('tour.form.checkpoints.move-up')"
                      @click="moveCheckpoint(index, -1)"
                  />
                  <pv-button
                      type="button"
                      icon="pi pi-arrow-down"
                      rounded
                      text
                      :disabled="index === form.checkpoints.length - 1"
                      :aria-label="t('tour.form.checkpoints.move-down')"
                      @click="moveCheckpoint(index, 1)"
                  />
                  <pv-button
                      type="button"
                      icon="pi pi-trash"
                      rounded
                      text
                      class="delete-button"
                      :aria-label="t('tour.form.checkpoints.remove')"
                      @click="removeCheckpoint(index)"
                  />
                </div>
              </li>
            </ul>
          </section>

          <div
              v-if="store.errors.length"
              class="error-message"
          >
            {{ t('errors.occurred') }}:
            {{ store.errors.map(e => e.message).join(', ') }}
          </div>

          <div class="form-actions">
            <pv-button
                type="button"
                :label="t('tour.form.cancel')"
                severity="secondary"
                outlined
                @click="goBackToList"
            />

            <pv-button
                type="submit"
                :label="isEditMode ? t('tour.form.update') : t('tour.form.create')"
                class="tour-primary-button"
                icon="pi pi-save"
                :loading="saving"
            />
          </div>
        </template>
      </form>
      </section>
    </div>
  </TourPanel>
</template>

<style scoped>
.tour-form-card {
  padding: 0;
}

.tour-form-header {
  margin-bottom: 24px;
}

.tour-form-header h2 {
  color: #ffffff;
  font-family: var(--heading);
  font-size: 1.45rem;
  margin: 0 0 6px;
}

.tour-form-header p {
  color: #d0d9e6;
  font-size: 0.78rem;
  line-height: 1.5;
  margin: 0;
}

.tour-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field.full {
  grid-column: 1 / -1;
}

.form-field label {
  color: #e7eef8;
  font-size: 0.78rem;
  font-weight: 700;
}

.loading-message {
  color: #ffffff;
  font-size: 0.85rem;
}

.error-message {
  color: #fecaca;
  font-size: 0.8rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.checkpoints-section {
  border-top: 1px solid rgba(220, 229, 241, 0.16);
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.checkpoints-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.checkpoints-header h3 {
  color: #ffffff;
  font-family: var(--heading);
  font-size: 1.05rem;
  margin: 0 0 4px;
}

.checkpoints-header p {
  color: #aebacb;
  font-size: 0.75rem;
  margin: 0;
}

.checkpoints-empty {
  color: #aebacb;
  font-size: 0.82rem;
  background: rgba(59, 80, 107, 0.4);
  border: 1px dashed rgba(220, 229, 241, 0.22);
  border-radius: 10px;
  padding: 16px;
  text-align: center;
}

.checkpoints-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkpoint-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(59, 80, 107, 0.4);
  border: 1px solid rgba(220, 229, 241, 0.14);
  border-radius: 12px;
  padding: 14px;
}

.checkpoint-order {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #f26a3d;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.85rem;
  margin-top: 18px;
}

.checkpoint-fields {
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.4fr;
  gap: 12px;
}

.checkpoint-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.checkpoint-field label {
  color: #cdd7e5;
  font-size: 0.7rem;
  font-weight: 700;
}

.checkpoint-actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 12px;
}

.checkpoint-actions :deep(.delete-button) {
  color: #fca5a5;
}

@media (max-width: 750px) {
  .checkpoint-fields {
    grid-template-columns: 1fr 1fr;
  }

  .checkpoint-row {
    flex-wrap: wrap;
  }

  .checkpoint-actions {
    flex-direction: row;
    margin-top: 0;
  }
}

:deep(.p-inputtext),
:deep(.p-textarea),
:deep(.p-select),
:deep(.p-inputnumber-input) {
  background: #3b506b;
  border-color: rgba(220, 229, 241, 0.16);
  color: #ffffff;
}

:deep(.p-inputtext:enabled:focus),
:deep(.p-textarea:enabled:focus),
:deep(.p-select:not(.p-disabled).p-focus),
:deep(.p-inputnumber-input:enabled:focus) {
  border-color: #f26a3d;
  box-shadow: 0 0 0 1px rgba(242, 106, 61, 0.25);
}

:deep(.p-select-label),
:deep(.p-select-dropdown) {
  color: #ffffff;
}

@media (max-width: 750px) {
  .tour-form-card {
    padding: 18px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions :deep(.p-button) {
    width: 100%;
  }
}
</style>