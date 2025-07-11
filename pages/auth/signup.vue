<script setup lang="ts">
import { motion } from 'motion-v';
import { ref } from 'vue';
import Eye from '~/components/svg/Eye.vue';
import { BASE_URL } from '~/constants/BASE_URL';
import EyeSlash from '~/components/svg/EyeSlash.vue';
const submitButton = ref<HTMLButtonElement | null>(null);
const passwordInput = ref(true);

const partnersFirstName = ['walu', 'bryan', 'malango', 'jerome'];

const first_name = ref('');
const last_name = ref('');
const email = ref('');
const phone = ref('');
const role = ref('');
const password = ref('');
const responseMessage = ref('');

function changeInputType() {
  passwordInput.value = !passwordInput.value;
}

const getUserRole = (first_name: string) => {
  if (partnersFirstName.includes(first_name.toLowerCase())) {
    role.value = 'Partner';
  } else {
    role.value = 'Employee';
  }
};

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
  responseMessage.value = message;
};

const signUp = async (e: Event) => {
  e.preventDefault();
  getUserRole(first_name.value);

  setLoading(true);
  setError(false);
  setSuccess(false);

  try {
    const response = await fetch(`${BASE_URL}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        phone: phone.value,
        role: role.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (response.status == 200) {
      setSuccess(true);
      setResponseMessage(data.message);
    } else {
      setError(true);
      setResponseMessage(data.message);
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
      layout="position"
      @submit="signUp"
      :initial="{ opacity: 0, x: -60 }"
      :animate="{ opacity: 1, x: 0 }"
      :exit="{ opacity: 0, x: -60 }"
      :transition="{ ease: [0.25, 0.1, 0.25, 1.0], duration: 0.5 }"
      class="flex flex-col gap-3"
    >
      <NuxtImg class="mx-auto mb-4" src="/bintel.png" />

      <div class="grid grid-cols-2 gap-3">
        <div class="input-group">
          <input
            v-model="first_name"
            required
            type="text"
            placeholder="First name"
          />
        </div>
        <div class="input-group">
          <input
            v-model="last_name"
            required
            type="text"
            placeholder="Last name"
          />
        </div>
      </div>

      <div class="input-group">
        <input v-model="email" required type="email" placeholder="Email" />
      </div>

      <div class="input-group">
        <input v-model="phone" required type="text" placeholder="Phone" />
      </div>

      <div class="input-group relative">
        <input
          required
          :type="passwordInput ? 'password' : 'text'"
          placeholder="Password"
          v-model="password"
        />

        <span class="cursor-pointer absolute right-2" @click="changeInputType">
          <span v-if="passwordInput"> <Eye /> </span>
          <span v-if="!passwordInput"> <EyeSlash /> </span>
        </span>
      </div>
      <button ref="submitButton" :disabled="loading" class="cta">
        <UxLoader v-if="loading" />
        <template v-else>Signup</template>
      </button>

      <NuxtLink to="/auth/login" class="ml-auto font-semibold hover:underline"
        >Already have an account?</NuxtLink
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
      class="error bg-green-200 font-semibold px-8 py-2 rounded-3xl font-p-3 text-green-600 border border-green-300"
      v-if="success"
      >{{ responseMessage }}
      <NuxtLink to="/auth/login" class="font-bold underline"
        >Login in now</NuxtLink
      >
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
  width: 100%;
  display: flex;
}

.input-group input {
  width: 100%;
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
  width: 27rem !important;
}

.ml-auto {
  font-size: var(--p2);
}
</style>
