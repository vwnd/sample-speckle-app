<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div v-if="isLoading" class="max-w-md">
        <progress class="progress w-56"></progress>
      </div>
      <div v-else class="max-w-md">
        <div v-if="userInfo" class="avatar">
          <div
            class="w-24 rounded-full mb-6 ring ring-primary ring-offset-base-100 ring-offset-2"
          >
            <img :src="userInfo.avatar" />
          </div>
        </div>
        <h1 class="text-5xl font-bold">Hey {{ userInfo?.name || "there" }}!</h1>
        <p v-if="userInfo" class="py-6">
          Welcome back to your sample Speckle app! 🚀
        </p>
        <p v-else class="py-6">
          It seems like you have not authorized this app yet with the Speckle
          guys 🤔. Go ahead and do that now!
        </p>
        <button class="btn btn-primary" @click="handleGetStarted()">
          Get Started
        </button>
        <p
          v-if="userInfo"
          class="py-2 text-sm text-gray-500 underline underline-offset-2 cursor-pointer"
          @click="store.signOut()"
        >
          Sign out
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/stores/store";
import { computed, ref } from "vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const store = useStore();
const isLoading = ref(false);
const router = useRouter();

onMounted(async () => {
  isLoading.value = true;
  await store.fetchUserInfo();
  isLoading.value = false;
});

const userInfo = computed(() => store.userInfo);
const isAuthenticated = computed(() => store.isAuthenticated);

function handleGetStarted() {
  if (isAuthenticated.value) {
    router.push("/home");
  } else {
    store.goToSpeckleAuthPage();
  }
}
</script>

<style scoped></style>
