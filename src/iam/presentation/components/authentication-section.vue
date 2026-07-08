<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import useIamStore from "../../application/iam.store.js";

const { t } = useI18n();
const router = useRouter();
const store = useIamStore();
const { signOut } = store;

const isSignedIn = computed(() => !!store.isSignedIn);
const currentUsername = computed(() => store.currentUsername);

/**
 * Navigate to the sign-in page.
 * @function performSignIn
 */
function performSignIn() {
  router.push({ name: "iam-sign-in" });
}

/**
 * Navigate to the sign-up page.
 * @function performSignUp
 */
function performSignUp() {
  router.push({ name: "iam-sign-up" });
}

/**
 * Sign out the current user and navigate to the sign-in page.
 * @function performSignOut
 */
function performSignOut() {
  signOut(router);
}
</script>

<template>
  <div class="auth-section">
    <div v-if="isSignedIn" class="auth-signed-in">
      <div class="auth-identity">
        <div class="user-avatar" aria-hidden="true">
          <i class="pi pi-user" />
        </div>
        <div class="auth-identity-text">
          <span class="auth-identity-label">{{ t("auth.signed-in-as") }}</span>
          <span class="auth-username">{{ currentUsername }}</span>
        </div>
      </div>
      <pv-button
          class="auth-button auth-button--signout"
          outlined
          size="small"
          icon="pi pi-sign-out"
          :label="t('auth.sign-out')"
          @click="performSignOut"
      />
    </div>
    <div v-else class="auth-signed-out">
      <pv-button
          class="auth-button auth-button--signin"
          size="small"
          icon="pi pi-sign-in"
          :label="t('auth.sign-in')"
          @click="performSignIn"
      />
      <pv-button
          class="auth-button auth-button--signup"
          text
          size="small"
          icon="pi pi-user-plus"
          :label="t('auth.sign-up')"
          @click="performSignUp"
      />
    </div>
  </div>
</template>

<style scoped>
.auth-section {
  width: 100%;
}

.auth-signed-in {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
}

.auth-identity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #f26a3d;
  color: #ffffff;
  font-size: 0.95rem;
  box-shadow: 0 0 0 4px rgba(242, 106, 61, 0.12);
}

.auth-identity-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.auth-identity-label {
  color: #8c99aa;
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 700;
}

.auth-username {
  color: #f1f5f9;
  font-size: 0.85rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.auth-signed-out {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.auth-button {
  width: 100%;
  justify-content: center;
}

.auth-button--signin {
  background: linear-gradient(180deg, #ff7a4f 0%, #e85a2e 100%) !important;
  border: none !important;
  color: #ffffff !important;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(242, 106, 61, 0.3);
}

.auth-button--signin:hover {
  filter: brightness(1.06);
}

.auth-button--signup {
  color: #dbe4ef !important;
}

.auth-button--signout {
  border-color: rgba(148, 163, 184, 0.35) !important;
  color: #dbe4ef !important;
}

.auth-button--signout:hover {
  background: rgba(255, 255, 255, 0.06) !important;
}
</style>
