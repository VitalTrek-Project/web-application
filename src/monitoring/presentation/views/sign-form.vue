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
const {errors, tourists, addSign, updateSign, fetchTourists} = store;


const form = ref({touristId: null, expeditionId: null, heartRate: null,
                        bloodOxygen: null,
                        bodyTemperature: null, steps: null, recordedAt: ''});
/** Determines whether the current route represents edition of an existing sign. */
const isEdit = computed(() => !!route.params.id);

/**
 * Reads one sign entity from application state.
 * @param {number|string} id - Sign identifier.
 * @returns {Sign|undefined}
 */
onMounted(() => {
  console.log(route.params.id);
  if (!tourists.length) fetchTourists();
  if (isEdit.value) {
    const sign = getSignById(route.params.id);
    console.log(sign);
    if (sign){
      form.value.touristId = sign.touristId;
      form.value.expeditionId = sign.expeditionId;
      form.value.heartRate = sign.heartRate;
      form.value.bloodOxygen = sign.bloodOxygen;
      form.value.bodyTemperature = sign.bodyTemperature;
      form.value.steps = sign.steps;
      form.value.recordedAt = sign.recordedAt;
    } else navigateBack();

  }
});



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
    touristId: form.value.touristId,
    expeditionId: form.value.expeditionId,
    heartRate: form.value.heartRate,
    bloodOxygen: form.value.bloodOxygen,
    bodyTemperature: form.value.bodyTemperature,
    steps: form.value.steps,
    recordedAt: form.value.recordedAt,

  });
  isEdit.value ? updateSign(sign) : addSign(sign);
  navigateBack();
}


</script>

<template>
  <div class="p-4">
    <h1>{{ isEdit ? t('sign.edit-title') : t('sign.new-title') }}</h1>
    <form @submit.prevent="saveSign">
      <div class="field mb-3">
        <label for="tourist">{{ t('sign.tourist') }}</label>
        <pv-select
            id="tourist"
            v-model="form.touristId"
            :options="tourists"
            optionLabel="fullName"
            optionValue="id"
            placeholder="Select a tourist"
            class="w-full"
        />
      </div>
      <div class="field mb-3">
        <label for="expeditionId">{{ t('sign.expeditionId') }}</label>
        <pv-input-text id="expeditionId" v-model="form.expeditionId" required class="w-full" />
      </div>
      <div class="field mb-3">
        <label for="heartRate">{{ t('sign.heartRate') }}</label>
        <pv-input-text id="heartRate" v-model="form.heartRate" required class="w-full" />
      </div>
      <div class="field mb-3">
        <label for="bloodOxygen">{{ t('sign.bloodOxygen') }}</label>
        <pv-textarea id="bloodOxygen" v-model="form.bloodOxygen" rows="4" class="w-full" />
      </div>
      <div class="field mb-3">
        <label for="bodyTemperature">{{ t('sign.bodyTemperature') }}</label>
        <pv-textarea id="bodyTemperature" v-model="form.bodyTemperature" rows="4" class="w-full" />
      </div>
      <div class="field mb-3">
        <label for="steps">{{ t('sign.steps') }}</label>
        <pv-textarea id="steps" v-model="form.steps" rows="4" class="w-full" />
      </div>
      <div class="field mb-3">
        <label for="recordedAt">{{ t('sign.recordedAt') }}</label>
        <pv-textarea id="recordedAt" v-model="form.recordedAt" rows="4" class="w-full" />
      </div>


      <pv-button type="submit" :label="t('sign.save')" icon="pi pi-save" />
      <pv-button :label="t('sign.cancel')" severity="secondary" class="ml-2" @click="navigateBack" />
    </form>
    <div v-if="errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>
<style scoped>

</style>