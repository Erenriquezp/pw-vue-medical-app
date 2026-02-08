<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-icon">🏥</div>
        <h1>MediCare Access</h1>
        <p>Sistema de Gestión de Citas Médicas</p>
      </div>

      <div v-if="errorMessage" class="alert-error">⚠️ {{ errorMessage }}</div>

      <form @submit.prevent="handleLogin">
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
          {{ loading ? "Autenticando..." : "Iniciar Sesión" }}
        </button>
      </form>

      <div class="login-footer">
        <small>© 2026 MediCare System. Acceso restringido.</small>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/clients/AuthorizationClient";

export default {
  data() {
    return {
      credentials: {
        username: "",
        password: "",
      },
      loading: false,
      errorMessage: null,
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = null;

      try {
        await getToken(this.credentials.username, this.credentials.password);

        this.$router.push("/");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.errorMessage = "Usuario o contraseña incorrectos.";
        } else if (error.code === "ERR_NETWORK") {
          this.errorMessage = "No se puede conectar con el servidor.";
        } else {
          this.errorMessage = "Ocurrió un error inesperado.";
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  background: linear-gradient(
    140deg,
    var(--color-bg) 0%,
    var(--color-bg-alt) 100%
  );
}

/* TARJETA */
.login-card {
  background: var(--color-surface);
  width: 100%;
  max-width: 400px;
  padding: 2.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-1);
}

/* HEADER */
.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 0.85rem;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(11, 107, 203, 0.12);
  color: var(--color-primary);
  font-size: 1.6rem;
}

.login-header h1 {
  font-size: 1.5rem;
  color: var(--color-text);
  margin: 0;
  font-weight: 700;
}

.login-header p {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin-top: 0.35rem;
}

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

/* ERROR */
.alert-error {
  background-color: rgba(198, 40, 40, 0.1);
  color: var(--color-danger);
  padding: 10px;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  text-align: center;
  border: 1px solid rgba(198, 40, 40, 0.25);
}

/* FOOTER */
.login-footer {
  text-align: center;
  margin-top: 2rem;
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
