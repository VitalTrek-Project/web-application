<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import {useRoute, useRouter} from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm} from "primevue/useconfirm";

import useNavigationStore from "../application/navigation.store.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const store = useNavigationStore();


</script>

<template>

</template>

<style scoped>

</style>