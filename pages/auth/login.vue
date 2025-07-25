<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v';
import { ref } from 'vue';
import EmailIcon from '~/components/svg/EmailIcon.vue';
import Eye from '~/components/svg/Eye.vue';
import EyeSlash from '~/components/svg/EyeSlash.vue';
import { BASE_URL } from '~/constants/BASE_URL';
import PasswordIcon from '~/components/svg/PasswordIcon.vue';

const token = useCookie('bintel_auth_token');

const passwordInput = ref(true);
const submitButton = ref<HTMLButtonElement | null>(null);

function changeInputType() {
  passwordInput.value = !passwordInput.value;
}

const email = ref('');
const password = ref('');
const responseMessage = ref('');

const submit = () => {
  submitButton.value?.click();
};

const loading = ref(false);
const success = ref(false);
const error = ref(false);

const setLoading = (state: boolean) => {
  loading.value = state;
};

const setSuccess = (state: boolean) => {
  success.value = state;
};

const setError = (state: boolean) => {
  error.value = state;
};

const setResponseMessage = (message: string) => {
  if (message && message.length > 2) {
    responseMessage.value = message;
  } else {
    responseMessage.value = 'Try again in a moment.';
  }
};

const login = async (e: Event) => {
  e.preventDefault();

  setLoading(true);
  setError(false);
  setSuccess(false);

  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (response.status == 200) {
      setSuccess(true);
      setResponseMessage(data.message);
      token.value = data.token;
      window.setTimeout(()=>{
        navigateTo('/');
      }, 1500)
    } else {
      setResponseMessage(data.message);
      setError(true);
    }
  } catch (err) {
    setError(true);
  } finally {
    setLoading(false);
  }
};
</script>

<template>
  <AnimatePresence mode="popLayout">
    <motion.form
      key="form"
      @submit="login"
      layout="position"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="{ ease: [0.25, 0.1, 0.25, 1.0], duration: 0.5 }"
      class="flex flex-col gap-3"
    >
      <NuxtImg class="mx-auto mb-4" src="/bintel.png" />

      <div class="input-group">
        <EmailIcon />
        <input required v-model="email" type="text" placeholder="Email" />
      </div>

      <div class="input-group">
        <PasswordIcon />

        <input
          required
          v-model="password"
          :type="passwordInput ? 'password' : 'text'"
          placeholder="Password"
        />

        <span class="cursor-pointer" @click="changeInputType">
          <span v-if="passwordInput"> <Eye /> </span>
          <span v-if="!passwordInput"> <EyeSlash /> </span>
        </span>
      </div>
      <button ref="submitButton" :disabled="loading" class="cta">
        <UxLoader v-if="loading" />
        <template v-else>Login</template>
      </button>
      <NuxtLink to="#" class="ml-auto font-semibold hover:underline"
        >Forgot password?</NuxtLink
      >
    </motion.form>

    <motion.span
      key="error"
      :initial="{ opacity: 0, y: 60 }"
      :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0, y: 60 }"
      :transition="{ ease: [0.25, 0.1, 0.25, 1.0], duration: 0.5 }"
      v-if="error"
      layout="position"
      class="error bg-red-100 font-semibold px-8 py-2 rounded-3xl font-p-3 text-red-600 border border-red-200"
      >{{ responseMessage }}.
      <span
        @click="submit"
        class="font-bold underline text-red-600 cursor-pointer"
        >Try again</span
      ></motion.span
    >

    <motion.div
      key="success"
      :initial="{ opacity: 0, y: 60 }"
      :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0, y: 60 }"
      :transition="{ ease: [0.25, 0.1, 0.25, 1.0], duration: 0.5 }"
      layout="position"
      class="bg-green-200 font-semibold px-8 py-2 rounded-3xl font-p-3 text-green-600 border border-green-300"
      v-if="success"
      >You're logged in and ready to go...
    </motion.div>
  </AnimatePresence>
</template>

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
