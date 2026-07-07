<script setup>
  import useIamStore from "../../application/iam.store.js";
  import {reactive} from "vue";
  import {SignInCommand} from "../../domain/sign-in.command.js";
  import {useRouter} from "vue-router";

  /** Router used to redirect after IAM use-case execution. */
  const router = useRouter();
  /** IAM application service store. */
  const store = useIamStore();
  const {signIn} = store;
  /** @type {{username: string, password: string}} Form state for sign-in command creation. */
  const form = reactive({
    username: '',
    password: ''
  })
  /**
   * Builds a SignInCommand from form state and delegates execution
   * to IAM application services.
   *
   * @returns {void}
   */
  function performSignIn() {
    let signInCommand = new SignInCommand(form);
    console.log(signInCommand);
    signIn(signInCommand, router);
  }
</script>

<template>
  <div>
    <h3>Sign In</h3>
  </div>
  <p class="p-fluid mb-5">Please enter the required information to sign in.</p>
  <div>
    <form @submit.prevent="performSignIn">
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
          <pv-button type="submit">Sign In</pv-button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>