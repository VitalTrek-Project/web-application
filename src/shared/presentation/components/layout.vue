<script setup>

import LanguageSwitcher from "./language-switcher.vue";
import {ref} from "vue";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import FooterContent from "./footer-content.vue";
// To import when IAM is implemented
// import AuthenticationSection from "../../../iam/presentation/components/authentication-section.vue";
const { t } = useI18n();

const route = useRoute();
const drawer = ref(false);
const toggleDrawer = () => {
  /**
   * Toggles the state of the drawer between open and closed.
   */
  drawer.value = !drawer.value;
}
const items = [
  {label: 'option.home', to: '/home', icon: 'pi pi-home'},
  { label: 'option.navigation', to: '/navigation', icon: 'pi pi-map' },
];

const isActive = (to) => route.path === to || route.path.startsWith(to);
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>
  <div class="header">
    <pv-toolbar class="bg-primary">
      <template #start>
        <pv-button class="p-button-text" icon="pi pi-bars" @click="toggleDrawer"/>
        <h3>VitalTrek</h3>
      </template>
      <template #center>

      </template>
      <template #end>
        <div class="flex-column mr-3">
          <pv-button v-for="item in items" :key="item.label" as-child v-slot="slotProps">
            <router-link :to="item.to" :class="[slotProps['class'], { active: isActive(item.to) }]">
              <i :class="item.icon" aria-hidden="true" style="margin-right:6px"></i>
              {{ t(item.label) }}
            </router-link>
          </pv-button>
        </div>
        <!-- To add when IAM is implemented -->
        <!-- <authentication-section/> -->
        <language-switcher/>
      </template>
    </pv-toolbar>
    <pv-drawer v-model:visible="drawer"/>
  </div>
  <div class="main-content">
    <router-view/>
  </div>
  <div class="footer">
    <footer-content/>
  </div>
</template>

<style scoped>
.header {
  position: absolute;
  left: 0;
  top:0;
  width:100%;
}

.main-content {
  margin-top: 60px;
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
}

/* Active link styling */
.router-link-active,
.active {
  font-weight: 600;
  text-decoration: underline;
}
</style>