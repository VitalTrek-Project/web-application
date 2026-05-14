<script setup>

import { computed, onMounted, ref, toRefs } from "vue";

import { useRouter } from "vue-router";

import { useI18n } from "vue-i18n";

import { useConfirm } from "primevue/useconfirm";

import useTourManagementStore
  from "../../application/tourManagement.store.js";

const { t } = useI18n();

const router = useRouter();

const confirm = useConfirm();

const store = useTourManagementStore();

const searchTerm = ref('');

const filteredTours = computed(() =>
    searchTours(searchTerm.value)
);

const {
  tours,
  errors,
  toursLoaded
} = toRefs(store);

const {
  fetchTours,
  deleteTour,
  searchTours
} = store;

const translateTourValue = (type, value) => {
  if (!value) return '';

  const key = `tour.${type}.${value.toLowerCase()}`;

  const translatedValue = t(key);

  return translatedValue === key ? value : translatedValue;
};

/**
 * Navigates to the tour creation route.
 */
const navigateToNew = () =>
    router.push({
      name: 'tour-management-tour-new'
    });

/**
 * Navigates to the tour edit route.
 *
 * @param {number|string} id
 */
const navigateToEdit = (id) =>
    router.push({
      name: 'tour-management-tour-edit',
      params: { id }
    });

/**
 * Requests user confirmation before deleting a tour.
 *
 * @param {import('../../domain/model/tour.entity.js').Tour} tour
 */
const confirmDelete = (tour) => {

  confirm.require({

    message: t(
        'tours.confirm-delete',
        { title: tour.title }
    ),

    header: t('tours.delete-header'),

    icon: 'pi pi-exclamation-triangle',

    accept: () => deleteTour(tour.id)
  });
};

onMounted(() => { fetchTours(); });

</script>

<template>
  <section class="tour-page">
    <div class="tour-tabs">
      <router-link to="/tours" class="tour-tab active">
        {{ t('tour.tabs.list') }}
      </router-link>

      <router-link to="/tours/new" class="tour-tab">
        {{ t('tour.tabs.form') }}
      </router-link>

      <router-link to="/tourists-assignment" class="tour-tab">
        {{ t('tour.tabs.assign-tourists') }}
      </router-link>
    </div>

    <div class="tour-card">
      <div class="tour-card-header">
        <div>
          <h2>{{ t('tour.title') }}</h2>
          <p>{{ t('tour.description') }}</p>
        </div>

        <div class="tour-card-actions">
    <span class="p-input-icon-left search-wrapper">
      <i class="pi pi-search"></i>

      <pv-input-text
          v-model="searchTerm"
          :placeholder="t('tour.search-placeholder')"
          class="tour-search"
      />
    </span>

          <pv-button
              :label="t('tour.new')"
              class="new-tour-button"
              icon="pi pi-plus"
              @click="navigateToNew"
          />
        </div>
      </div>

      <pv-data-table
          :loading="!toursLoaded"
          :rows="5"
          :rows-per-page-options="[5, 10, 20]"
          :value="filteredTours"
          class="tour-table"
          paginator
          table-style="min-width: 100%"
      >
        <pv-column
            field="id"
            :header="t('tours.id')"
            sortable
        />

        <pv-column
            field="title"
            :header="t('tours.title-column')"
            sortable
        />

        <pv-column
            field="difficulty"
            :header="t('tours.difficulty')"
            sortable
        >
          <template #body="slotProps">
            {{ translateTourValue('difficulty', slotProps.data.difficulty) }}
          </template>
        </pv-column>

        <pv-column
            field="status"
            :header="t('tours.status')"
            sortable
        >
          <template #body="slotProps">
            {{ translateTourValue('status', slotProps.data.status) }}
          </template>
        </pv-column>

        <pv-column
            field="capacity"
            :header="t('tours.capacity')"
            sortable
        />

        <pv-column :header="t('tours.actions')">
          <template #body="slotProps">
            <div class="table-actions">
              <pv-button
                  icon="pi pi-pencil"
                  rounded
                  text
                  class="edit-button"
                  @click="navigateToEdit(slotProps.data.id)"
              />

              <pv-button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  class="delete-button"
                  @click="confirmDelete(slotProps.data)"
              />
            </div>
          </template>
        </pv-column>
      </pv-data-table>

      <div
          v-if="errors.length"
          class="error-message"
      >
        {{ t('errors.occurred') }}:
        {{ errors.map(e => e.message).join(', ') }}
      </div>

      <pv-confirm-dialog />
    </div>
  </section>
</template>

<style scoped>
.tour-page {
  width: min(1080px, 100%);
  margin: 0 auto;
  text-align: left;
}

.tour-tabs {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 12px;
  padding-left: 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
}

.tour-tab {
  position: relative;
  color: #aab6c5;
  text-decoration: none;
  font-size: 0.78rem;
  padding: 0 0 12px;
  white-space: nowrap;
}

.tour-tab.active {
  color: #f26a3d;
  font-weight: 700;
}

.tour-tab.active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: #f26a3d;
  border-radius: 999px;
}

.tour-card {
  background: #33465f;
  border: 1px solid rgba(185, 198, 216, 0.16);
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.16);
}

.tour-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 24px;
}

.tour-card-header h2 {
  color: #ffffff;
  font-family: var(--heading);
  font-size: 1.2rem;
  margin: 0 0 6px;
}

.tour-card-header p {
  color: #d0d9e6;
  font-size: 0.78rem;
  line-height: 1.5;
}

.new-tour-button {
  background: #f26a3d;
  border-color: #f26a3d;
  color: #ffffff;
  font-size: 0.74rem;
  padding: 0.5rem 0.85rem;
  flex: 0 0 auto;
}

.new-tour-button:hover {
  background: #ff7a4f;
  border-color: #ff7a4f;
}

.tour-table {
  font-size: 0.8rem;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.edit-button {
  color: #dbeafe;
}

.delete-button {
  color: #fecaca;
}

.error-message {
  margin-top: 16px;
  color: #fecaca;
  font-size: 0.8rem;
}

:deep(.p-datatable) {
  background: #33465f;
  color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.p-datatable-table) {
  border-collapse: collapse;
  background: #33465f;
}

:deep(.p-datatable-thead > tr > th) {
  background: #3b506b;
  color: #e7eef8;
  border-color: rgba(220, 229, 241, 0.12);
  font-size: 0.74rem;
  font-weight: 700;
  padding: 13px 12px;
}

:deep(.p-datatable-tbody > tr) {
  background: #33465f;
  color: #ffffff;
}

:deep(.p-datatable-tbody > tr > td) {
  background: #33465f;
  color: #ffffff;
  border-color: rgba(220, 229, 241, 0.1);
  padding: 13px 12px;
}

:deep(.p-datatable-tbody > tr:hover > td) {
  background: #3a4f69;
}

:deep(.p-datatable-tbody > tr.p-datatable-emptymessage > td) {
  background: #33465f;
  color: #d0d9e6;
}

:deep(.p-paginator) {
  background: #33465f;
  border-color: rgba(220, 229, 241, 0.1);
  color: #ffffff;
  padding-top: 16px;
}

:deep(.p-paginator .p-paginator-page),
:deep(.p-paginator .p-paginator-first),
:deep(.p-paginator .p-paginator-prev),
:deep(.p-paginator .p-paginator-next),
:deep(.p-paginator .p-paginator-last) {
  color: #ffffff;
  background: transparent;
  border-radius: 6px;
}

:deep(.p-paginator .p-paginator-page:hover),
:deep(.p-paginator .p-paginator-first:hover),
:deep(.p-paginator .p-paginator-prev:hover),
:deep(.p-paginator .p-paginator-next:hover),
:deep(.p-paginator .p-paginator-last:hover) {
  background: #3b506b;
}

:deep(.p-paginator .p-paginator-page.p-highlight) {
  background: #f26a3d;
  color: #ffffff;
}

:deep(.p-dropdown),
:deep(.p-select) {
  background: #3b506b;
  border-color: rgba(220, 229, 241, 0.16);
  color: #ffffff;
}

:deep(.p-dropdown-label),
:deep(.p-select-label) {
  color: #ffffff;
}

.tour-card-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-wrapper {
  display: inline-flex;
  align-items: center;
}

.tour-search {
  width: 230px;
  background: #3b506b;
  border-color: rgba(220, 229, 241, 0.16);
  color: #ffffff;
  font-size: 0.78rem;
}

.tour-search::placeholder {
  color: #b8c4d4;
}

@media (max-width: 800px) {
  .tour-page {
    width: 100%;
  }

  .tour-tabs {
    overflow-x: auto;
    gap: 18px;
    padding-left: 4px;
  }

  .tour-card {
    padding: 16px;
  }

  .tour-card-header {
    flex-direction: column;
  }

  .new-tour-button {
    width: 100%;
  }

  .tour-card-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .tour-search {
    width: 100%;
  }
}
</style>