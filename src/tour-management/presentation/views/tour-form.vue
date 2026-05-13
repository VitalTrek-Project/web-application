<script setup>

import { computed, onMounted, ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import { useI18n } from "vue-i18n";

import useTourManagementStore
  from "../../application/tour-management.store.js";

import { Tour }
  from "../../domain/model/tour.entity.js";

const { t } = useI18n();

const route = useRoute();

const router = useRouter();

const store = useTourManagementStore();

const {
  errors,
  addTour,
  updateTour
} = store;

/**
 * Presentation form state mapped to Tour entity fields.
 *
 * @type {import('vue').Ref<{
 *  agencyId: string,
 *  title: string,
 *  description: string,
 *  difficulty: string,
 *  status: string,
 *  capacity: number
 * }>}
 */
const form = ref({

  agencyId: '',
  title: '',
  description: '',
  difficulty: '',
  status: '',
  capacity: 0
});

/**
 * Determines whether current route is edit mode.
 */
const isEdit = computed(() =>
    !!route.params.id
);

/**
 * Reads one tour entity from application state.
 *
 * @param {number|string} id
 *
 * @returns {Tour|undefined}
 */
function getTourById(id) {

  return store.getTourById(id);
}

/**
 * Navigates back to tours list route.
 */
const navigateBack = () =>
    router.push({
      name: 'tour-management-tours'
    });

/**
 * Creates or updates a Tour entity.
 */
const saveTour = () => {

  const tour = new Tour(

      isEdit.value
          ? route.params.id
          : null,

      form.value.agencyId,

      form.value.title,

      form.value.description,

      form.value.difficulty,

      form.value.status,

      form.value.capacity
  );

  isEdit.value
      ? updateTour(tour)
      : addTour(tour);

  navigateBack();
};

onMounted(() => {

  if (isEdit.value) {

    const tour =
        getTourById(route.params.id);

    if (tour) {

      form.value = {

        agencyId: tour.agencyId,
        title: tour.title,
        description: tour.description,
        difficulty: tour.difficulty,
        status: tour.status,
        capacity: tour.capacity
      };

    } else {

      navigateBack();
    }
  }
});

</script>

<template>

  <div class="p-4">

    <h1>

      {{
        isEdit
            ? t('tour.edit-title')
            : t('tour.new-title')
      }}

    </h1>

    <form @submit.prevent="saveTour">

      <div class="field mb-3">

        <label for="title">
          {{ t('tour.title') }}
        </label>

        <pv-input-text
            id="title"
            v-model="form.title"
            class="w-full"
            required
        />

      </div>

      <div class="field mb-3">

        <label for="description">
          {{ t('tour.description') }}
        </label>

        <pv-textarea
            id="description"
            v-model="form.description"
            class="w-full"
            rows="4"
        />

      </div>

      <div class="field mb-3">

        <label for="difficulty">
          {{ t('tour.difficulty') }}
        </label>

        <pv-input-text
            id="difficulty"
            v-model="form.difficulty"
            class="w-full"
        />

      </div>

      <div class="field mb-3">

        <label for="status">
          {{ t('tour.status') }}
        </label>

        <pv-input-text
            id="status"
            v-model="form.status"
            class="w-full"
        />

      </div>

      <div class="field mb-3">

        <label for="capacity">
          {{ t('tour.capacity') }}
        </label>

        <pv-input-number
            id="capacity"
            v-model="form.capacity"
            class="w-full"
        />

      </div>

      <pv-button
          :label="t('tour.save')"
          icon="pi pi-save"
          type="submit"
      />

      <pv-button
          :label="t('tour.cancel')"
          class="ml-2"
          severity="secondary"
          @click="navigateBack"
      />

    </form>

    <div
        v-if="errors.length"
        class="text-red-500 mt-3"
    >

      {{ t('errors.occurred') }}:
      {{ errors.map(e => e.message).join(', ') }}

    </div>

  </div>

</template>

<style scoped>

</style>