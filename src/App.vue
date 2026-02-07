<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="navbar">
        <div class="brand">🏥 MediCare System</div>        
        <div class="menu">
          <RouterLink to="/">Dashboard</RouterLink>
          <RouterLink to="/doctors">Doctors</RouterLink>
          <RouterLink to="/patients">Patients</RouterLink>
          <RouterLink to="/appointments">Appointments</RouterLink>
          <button @click="logout" class="btn-logout">Logout</button>
        </div>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>

header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.navbar {
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.brand { 
  font-size: 1.5rem; 
  font-weight: bold; 
}

.menu a.router-link-active { 
  color: var(--primary); 
  border-bottom: 2px solid var(--primary); 
}

.btn-logout {
  background: none; 
  border: 1px solid var(--danger); 
  color: var(--danger);
  padding: 0.5rem 1rem; 
  border-radius: 4px; 
  cursor: pointer;
}
.btn-logout:hover { 
  background: var(--danger); 
}
</style>
