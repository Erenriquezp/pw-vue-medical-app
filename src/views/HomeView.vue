<script setup>
import TheWelcome from "../components/DashboardComponent.vue";
</script>

<template>
  <main class="home">
    <section class="home-shell">
      <div class="home-card">
        <TheWelcome />
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  padding: 0 0 3rem;
}

.home-shell {
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  background: linear-gradient(
    140deg,
    rgba(11, 107, 203, 0.08),
    rgba(26, 163, 168, 0.08)
  );
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-1);
}

.home-card {
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-2);
}

.home :deep(h1),
.home :deep(h2),
.home :deep(h3) {
  color: var(--color-text);
  font-weight: 700;
  letter-spacing: 0.2px;
}

.home :deep(p) {
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .home-shell,
  .home-card {
    padding: 1.75rem;
  }
}
</style>
