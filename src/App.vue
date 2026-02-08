<template>
  <header header v-if="$route.name !== 'login'">
    <div class="wrapper">
      <nav class="navbar">
        <div class="brand">🏥 MediCare System</div>
        <div class="menu">
          <RouterLink to="/">Inicio</RouterLink>
          <RouterLink to="/doctors">Doctores</RouterLink>
          <RouterLink to="/patients">Pacientes</RouterLink>
          <RouterLink to="/appointments">Citas</RouterLink>
          <button @click="handleLogout" class="btn-logout" :disabled="isLoggingOut">
            {{ isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión' }}
          </button>
        </div>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { logOut } from './clients/AuthorizationClient';

const router = useRouter();
const isLoggingOut = ref(false);

const handleLogout = async () => {
  if (isLoggingOut.value) return;
  
  try {
    isLoggingOut.value = true;
    
    logOut();
    await router.push('/login');
  } catch (error) {
    console.error('Error durante el logout:', error);
  } finally {
    isLoggingOut.value = false;
  }
};
</script>
