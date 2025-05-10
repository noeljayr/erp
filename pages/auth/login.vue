<template>
  <motion.form
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :exit="{ opacity: 0 }"
    :transition="motionTranstion"
    class="flex flex-col gap-3"
  >
    <NuxtImg class="mx-auto mb-4" src="/bintel.png" />

    <div class="input-group">
      <EmailIcon />
      <input type="text" placeholder="Email" />
    </div>

    <div class="input-group">
      <PasswordIcon />

      <input
        :type="passwordInput ? 'password' : 'text'"
        placeholder="Password"
      />

      <span class="cursor-pointer" @click="changeInputType">
        <span v-if="passwordInput"> <Eye /> </span>
        <span v-if="!passwordInput"> <EyeSlash /> </span>
      </span>
    </div>
    <button class="cta">Login</button>
    <NuxtLink to="#" class="ml-auto font-semibold hover:underline"
      >Forgot password?</NuxtLink
    >
  </motion.form>
</template>

<script setup lang="ts">
import { motion } from 'motion-v';
import { ref } from 'vue';
import EmailIcon from '~/components/svg/EmailIcon.vue';
import Eye from '~/components/svg/Eye.vue';
import EyeSlash from '~/components/svg/EyeSlash.vue';
import PasswordIcon from '~/components/svg/PasswordIcon.vue';
import { motionTranstion } from '~/utils/motionTranstion';

const passwordInput = ref(true);

function changeInputType() {
  passwordInput.value = !passwordInput.value;
}
</script>

<style scoped>
.cta {
  height: 2.8rem;
  align-items: center;
  justify-content: center;
}

.input-group {
  height: 2.8rem;
}

img {
  height: 1.5rem;
  width: fit-content;
}

form {
  background-color: var(--white);
  padding: 1rem;
  border-radius: var(--radius-l);
  border: 1px solid var(--border);
}

.ml-auto {
  font-size: var(--p2);
}
</style>
