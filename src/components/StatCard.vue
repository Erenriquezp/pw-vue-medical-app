<template>
  <div :class="['stat-card', variant]">
    <div class="icon-wrapper">
      <slot name="icon">{{ icon }}</slot>
    </div>
    <div class="info">
      <h3>{{ value }}</h3>
      <p>{{ label }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: false,
      default: ''
    },
    value: {
      type: [Number, String],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    variant: {
      type: String,
      default: 'blue',
      validator: (value) => ['blue', 'green', 'orange'].includes(value)
    }
  }
}
</script>

<style scoped>
.stat-card {
  background: var(--color-surface);
  padding: 1.35rem 1.5rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-2);
  border: 1px solid var(--color-border);
  border-left: 4px solid transparent;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-1);
}

.stat-card.blue {
  border-left-color: var(--color-primary);
}
.stat-card.green {
  border-left-color: var(--color-accent);
}
.stat-card.orange {
  border-left-color: var(--color-danger);
}

.stat-card .icon-wrapper {
  font-size: 1.8rem;
  background: var(--color-surface-muted);
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
}

.stat-card .icon-wrapper svg {
  width: 1.8rem;
  height: 1.8rem;
  stroke: var(--color-text);
}

.stat-card.blue .icon-wrapper svg {
  stroke: var(--color-primary);
}

.stat-card.green .icon-wrapper svg {
  stroke: var(--color-accent);
}

.stat-card.orange .icon-wrapper svg {
  stroke: var(--color-danger);
}

.stat-card h3 {
  font-size: 1.8rem;
  margin: 0;
  font-weight: 700;
  color: var(--color-text);
}

.stat-card p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}
</style>
