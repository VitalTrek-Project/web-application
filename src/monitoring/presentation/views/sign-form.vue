<script setup>
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import useMonitoringStore from "../../application/monitoring.store.js";
import {computed, onMounted, ref} from "vue";
import {Sign} from "../../domain/model/sign.entity.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useMonitoringStore();
const {errors, addSign, updateSign} = store;

/** @type {import('vue').Ref<{name: string}>} Presentation form state mapped to Sign entity fields. */
const form = ref({name: ''});
/** Determines whether the current route represents edition of an existing sign. */
const isEdit = computed(() => !!route.params.id);

/**
 * Reads one sign entity from application state.
 * @param {number|string} id - Sign identifier.
 * @returns {Sign|undefined}
 */
function getSignById(id) {
  return store.getSignById(id);
}

/** Navigates back to the signs list route. */
const navigateBack = () => router.push({ name: 'monitoring-signs' });

/**
 * Creates a Sign entity from form state and delegates
 * add/update behavior to Monitoring application services.
 *
 * @returns {void}
 */
const saveSign = () => {
  const sign = new Sign({
    id: isEdit.value ? route.params.id : null,
    name: form.value.name
  });
  isEdit.value ? updateSign(sign) : addSign(sign);
  navigateBack();
}

onMounted(() => {
  console.log(route.params.id);
  if (isEdit.value) {
    const sign = getSignById(route.params.id);
    console.log(sign);
    if (sign) form.value.name = sign.recordedAt; else navigateBack();
  }
})
</script>

<template>
  <div class="p-4">
    <h1>{{ isEdit ? t('sign.edit-title') : t('sign.new-title')}}</h1>
    <form @submit.prevent="saveSign">
      <div class="field mb-3">
        <label for="name">{{ t('sign.name')}}</label>
        <pv-input-text id="name" v-model="form.name" class="w-full" required/>
      </div>
      <pv-button :label="t('sign.save')" icon="pi pi-save" type="submit"/>
      <pv-button :label="t('sign.cancel')" class="ml-2" severity="secondary" @click="navigateBack"/>
    </form>
    <div v-if="errors.length" class="text-red-500 mt-3">
      {{t('errors.occurred')}}: {{ errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>

</style>