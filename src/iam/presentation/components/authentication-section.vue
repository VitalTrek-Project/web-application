<script setup>
import useIamStore from "../../application/iam.store.js";
import {useRouter} from "vue-router";
import {computed} from "vue";

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
      <div class="user-avatar" aria-hidden="true">
        <i class="pi pi-user" />
      </div>
      <span class="auth-username">{{ currentUsername }}</span>
      <pv-button class="auth-signout" text size="small" @click="performSignOut">Sign Out</pv-button>
    </div>
    <div v-else class="auth-signed-out">
      <pv-button text size="small" @click="performSignIn">Sign In</pv-button>
      <pv-button text size="small" @click="performSignUp">Sign Up</pv-button>
    </div>
  </div>
</template>

<style scoped>
.auth-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.auth-signed-in {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.user-avatar {
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

.auth-username {
  color: #dbe4ef;
  font-size: 0.78rem;
  font-weight: 600;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.auth-signed-out {
  display: flex;
  gap: 6px;
}
</style>