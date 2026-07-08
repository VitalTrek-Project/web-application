<script setup>
import { computed } from "vue";
import useIamStore from "../../../iam/application/iam.store.js";
import MyProfile from "./my-profile.vue";
import StaffProfile from "./staff-profile.vue";

const iamStore = useIamStore();
const isAgency = computed(() => iamStore.currentRole === "Agency");
</script>

<template>
  <StaffProfile v-if="isAgency" />
  <MyProfile v-else />
</template>
