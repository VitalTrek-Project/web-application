<script setup>
import useIamStore from "../../application/iam.store.js";
import {reactive} from "vue";
import {SignUpCommand} from "../../domain/sign-up.command.js";
import {useRouter} from "vue-router";

/** Router used to redirect after IAM use-case execution. */
const router = useRouter();
/** IAM application service store. */
const store = useIamStore();
const {signUp} = store;
/** @type {{username: string, password: string, role: string}} Form state for sign-up command creation. */
const form = reactive({
  username: '',
  password: '',
  role: 'Tourist'
})
/**
 * Builds a SignUpCommand from form state and delegates execution
 * to IAM application services.
 *
 * @returns {void}
 */
function performSignUp() {
  let signUpCommand = new SignUpCommand(form);
  signUp(signUpCommand, router);
}
</script>

<template>
  <div>
    <h3>Sign Up</h3>
  </div>
  <p class="p-fluid mb-5">Please enter the required information to sign in.</p>
  <div>
    <pv-message v-if="store.errors.length" severity="error" :closable="false" class="mb-4">
      {{ store.errors[store.errors.length - 1] }}
    </pv-message>
    <form @submit.prevent="performSignUp">
      <div class="p-fluid">
        <div class="field mt-5">
          <pv-float-label>
            <label for="username">Username</label>
            <pv-input-text id="username" v-model="form.username" :class="{'p-invalid': !form.username}"/>
            <small v-if="!form.username" class="p-invalid">Username is required.</small>
          </pv-float-label>
        </div>
        <div class="p-field mt-5">
          <pv-float-label>
            <label for="password">Password</label>
            <pv-input-text id="password" v-model="form.password" :class="{'p-invalid': !form.password}" type="password"/>
            <small v-if="!form.password" class="p-invalid">Password is required.</small>
          </pv-float-label>
        </div>
        <div class="p-field mt-5">
          <label id="role-label" class="block mb-2">I am signing up as</label>
          <div class="role-options" role="radiogroup" aria-labelledby="role-label">
            <label class="role-option">
              <input type="radio" v-model="form.role" value="Tourist" name="role"/>
              Tourist
            </label>
            <label class="role-option">
              <input type="radio" v-model="form.role" value="Agency" name="role"/>
              Travel agency
            </label>
          </div>
        </div>
        <div class="p-field mt-5">
          <pv-button type="submit" :disabled="!form.username || !form.password">Sign Up</pv-button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.role-options {
  display: flex;
  gap: 1.5rem;
}

.role-option {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
}
</style>
