<script setup>
import useIamStore from "../../application/iam.store.js";
import {useRouter} from "vue-router";
import {computed} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const router = useRouter();
const store = useIamStore();
const {signOut} = store;

let isSignedIn = computed(() => !!store.isSignedIn);
let currentUsername = computed(() => store.currentUsername);

/**
 * Navigate to the sign-in page.
 * @function performSignIn
 */
function performSignIn() {
  router.push({name: 'iam-sign-in'});
}

/**
 * Navigate to the sign-up page.
 * @function performSignUp
 */
function performSignUp() {
  router.push({name: 'iam-sign-up'});
}

/**
 * Sign out the current user and navigate to the appropriate page.
 * @function performSignOut
 */
function performSignOut() {
  signOut(router);
}
</script>

<template>
  <div class="auth-section">
    <div v-if="isSignedIn" class="auth-signed-in">
      <span class="user-avatar" aria-hidden="true">
        <i class="pi pi-user" />
      </span>
      <span class="auth-username">{{ currentUsername }}</span>
      <button type="button" class="auth-signout" @click="performSignOut">
        <i class="pi pi-sign-out" aria-hidden="true" />
        {{ t("common.sign-out") }}
      </button>
    </div>
    <div v-else class="auth-signed-out">
      <button type="button" class="auth-btn auth-btn--ghost" @click="performSignIn">
        {{ t("common.sign-in") }}
      </button>
      <button type="button" class="auth-btn auth-btn--solid" @click="performSignUp">
        {{ t("common.sign-up") }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.auth-section {
  display: flex;
  align-items: center;
}

.auth-signed-out {
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth-btn {
  appearance: none;
  border-radius: 999px;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0.55rem 1.15rem;
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease;
}

.auth-btn:active {
  transform: translateY(1px);
}

.auth-btn--ghost {
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: transparent;
  color: #f8fafc;
}

.auth-btn--ghost:hover {
  border-color: #f26a3d;
  background: rgba(242, 106, 61, 0.08);
  color: #ffffff;
}

.auth-btn--solid {
  border: 1px solid transparent;
  background: linear-gradient(135deg, #f26a3d 0%, #e0522a 100%);
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(242, 106, 61, 0.35);
}

.auth-btn--solid:hover {
  filter: brightness(1.06);
  box-shadow: 0 8px 20px rgba(242, 106, 61, 0.45);
}

.auth-signed-in {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #f26a3d;
  color: #ffffff;
  font-size: 0.9rem;
  box-shadow: 0 0 0 3px rgba(242, 106, 61, 0.14);
}

.auth-username {
  color: #dbe4ef;
  font-size: 0.82rem;
  font-weight: 600;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.auth-signout {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 999px;
  background: transparent;
  color: #94a3b8;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.4rem 0.85rem;
  cursor: pointer;
  transition: border-color 0.18s ease, color 0.18s ease;
}

.auth-signout:hover {
  border-color: #f26a3d;
  color: #f8fafc;
}
</style>
