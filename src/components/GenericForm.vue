<template>
  <form @submit.prevent="onSubmit" class="generic-form">
    <div
      v-for="field in fields"
      :key="field.name"
      :class="['form-group', { full: field.full }]"
    >
      <label>{{ field.label }}</label>

      <!-- Textarea -->
      <textarea
        v-if="field.type === 'textarea'"
        v-model="localModel[field.name]"
        :class="['form-control']"
        v-bind="field.props"
      ></textarea>

      <!-- Select -->
      <select
        v-else-if="field.type === 'select'"
        v-model="localModel[field.name]"
        :class="['form-control']"
        v-bind="field.props"
      >
        <option
          v-for="opt in resolveOptions(field)"
          :value="opt.value"
          :key="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>

      <!-- Input (default) -->
      <input
        v-else
        v-model="localModel[field.name]"
        :type="field.type || 'text'"
        :class="['form-control']"
        v-bind="field.props"
      />
    </div>

    <div class="form-actions">
      <button class="btn-primary" type="submit">{{ submitLabel }}</button>
      <button
        type="button"
        class="button-secondary"
        @click="onCancel"
        v-if="showCancel"
      >
        Cancelar
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'GenericForm',
  props: {
    fields: { type: Array, required: true },
    initial: { type: Object, default: () => ({}) },
    submitLabel: { type: String, default: 'Guardar' },
    showCancel: { type: Boolean, default: false }
  },
  emits: ['submit', 'cancel'],
  data() {
    return {
      localModel: {}
    }
  },
  created() {
    // Inicializar localModel con los valores de initial
    this.resetForm()
  },
  watch: {
    initial: {
      handler() {
        this.resetForm()
      },
      deep: true
    }
  },
  methods: {
    resetForm() {
      // Crear un nuevo objeto con todos los campos del formulario
      const newModel = {}
      this.fields.forEach((field) => {
        newModel[field.name] =
          this.initial[field.name] !== undefined ? this.initial[field.name] : ''
      })

      // Asignar el nuevo objeto completo para forzar reactividad
      this.localModel = newModel
    },
    resolveOptions(field) {
      const opts = field.options
      if (!opts) return []
      if (typeof opts === 'function') {
        try {
          return opts() || []
        } catch (e) {
          return []
        }
      }
      return Array.isArray(opts) ? opts : []
    },
    onSubmit() {
      this.$emit('submit', { ...this.localModel })
    },
    onCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
.generic-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group.full {
  grid-column: 1 / -1;
}
.form-group label {
  font-weight: 600;
  font-size: 14px;
}
.form-control {
  height: 40px;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}
.form-control[is='textarea'] {
  height: auto;
  min-height: 80px;
}
.form-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: flex-end;
}

/* Estilos de botones reutilizables */
.btn-primary {
  background: var(--color-primary);
  color: #ffffff;
  border: none;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 600;
}
.btn-primary:hover {
  background: var(--color-primary-strong);
}

.button-secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border-strong);
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 600;
}
.button-secondary:hover {
  background: var(--color-surface-muted);
}
</style>
