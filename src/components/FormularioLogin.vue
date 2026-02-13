<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="username">Usuario</label>
      <div class="input-wrapper">
        <span class="icon">👤</span>
        <input
          id="username"
          v-model="credentials.username"
          type="text"
          placeholder="Ingrese su usuario"
          required
          autofocus
        />
      </div>
    </div>

    <div class="form-group">
      <label for="password">Contraseña</label>
      <div class="input-wrapper">
        <span class="icon">🔒</span>
        <input
          id="password"
          v-model="credentials.password"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>
    </div>

    <button type="submit" class="btn-login" :disabled="loading">
      <span v-if="loading" class="spinner"></span>
      {{ loading ? 'Autenticando...' : 'Iniciar Sesión' }}
    </button>
  </form>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.credentials)
    }
  }
}
</script>

<style scoped>
/* FORMULARIO */
.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.45rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper .icon {
  position: absolute;
  left: 14px;
  font-size: 1rem;
  color: var(--color-text-muted);
}

.input-wrapper input {
  width: 100%;
  padding: 11px 12px 11px 42px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.98rem;
  color: var(--color-text);
  background: var(--color-surface);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(11, 107, 203, 0.12);
}

/* BOTÓN */
.btn-login {
  width: 100%;
  padding: 12px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.btn-login:hover:not(:disabled) {
  background-color: var(--color-primary-strong);
  box-shadow: 0 8px 20px rgba(11, 107, 203, 0.2);
  transform: translateY(-1px);
}

.btn-login:disabled {
  background-color: rgba(11, 107, 203, 0.55);
  cursor: not-allowed;
  box-shadow: none;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
</style>
