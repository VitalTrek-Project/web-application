<script setup>
import { reactive, watch } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  visible: { type: Boolean, default: false },
  contact: { type: Object, default: null }
});

const emit = defineEmits(["update:visible", "save"]);

const { t } = useI18n();

const form = reactive({ name: "", relationship: "", phoneNumber: "" });

watch(() => props.visible, (visible) => {
  if (!visible) return;
  form.name = props.contact?.name ?? "";
  form.relationship = props.contact?.relationship ?? "";
  form.phoneNumber = props.contact?.phoneNumber ?? "";
});

function close() {
  emit("update:visible", false);
}

function save() {
  emit("save", { ...form });
  close();
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      modal
      :header="contact ? t('profile.emergency-contact.edit-title') : t('profile.emergency-contact.add-title')"
      :style="{ width: '380px' }"
      @update:visible="close"
  >
    <div class="p-fluid emergency-contact-form">
      <div class="field">
        <label for="ec-name">{{ t("profile.emergency-contact.name") }}</label>
        <pv-input-text id="ec-name" v-model="form.name" />
      </div>
      <div class="field">
        <label for="ec-relationship">{{ t("profile.emergency-contact.relationship") }}</label>
        <pv-input-text id="ec-relationship" v-model="form.relationship" />
      </div>
      <div class="field">
        <label for="ec-phone">{{ t("profile.emergency-contact.phone") }}</label>
        <pv-input-text id="ec-phone" v-model="form.phoneNumber" />
      </div>
    </div>
    <template #footer>
      <pv-button text :label="t('common.cancel')" @click="close" />
      <pv-button :label="t('common.save')" :disabled="!form.name || !form.phoneNumber" @click="save" />
    </template>
  </pv-dialog>
</template>

<style scoped>
.emergency-contact-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>
