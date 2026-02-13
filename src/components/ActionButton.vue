<template>
  <button @click="handleClick" class="action-btn">
    <span class="icon-wrapper">
      <slot name="icon">{{ icon }}</slot>
    </span>
    {{ label }}
  </button>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: false,
      default: ''
    },
    label: {
      type: String,
      required: true
    },
    to: {
      type: String,
      default: null
    }
  },
  methods: {
    handleClick() {
      if (this.to) {
        this.$router.push(this.to)
      }
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.action-btn {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 0.9rem 1rem;
  border-radius: var(--radius-sm);
  text-align: left;
  font-size: 0.98rem;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: var(--color-text);
  width: 100%;
}

.icon-wrapper {
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper svg {
  width: 1.3rem;
  height: 1.3rem;
  stroke: currentColor;
}

.action-btn:hover {
  background: var(--color-surface-muted);
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
