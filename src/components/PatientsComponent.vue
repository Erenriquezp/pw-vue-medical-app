<template lang="">
  <div class="container">
    <h2>Doctors</h2>
    <p class="page-subtitle">
      Gestiona pacientes y mantén su informacion actualizada.
    </p>
    <div class="card">
      <h3>Registrar Nuevo Paciente</h3>
      <p class="helper-text">Completa los datos basicos antes de guardar.</p>
      <div v-if="statusMessage" class="message" :class="statusType">
        {{ statusMessage }}
      </div>
      <form @submit.prevent="savePatient">
        <input
          v-model="newPatient.firstName"
          type="text"
          placeholder="Nombre"
        />
        <input
          v-model="newPatient.lastName"
          type="text"
          placeholder="Apellido"
        />
        <input
          v-model="newPatient.birthDate"
          type="text"
          placeholder="Fehca de nacimiento"
        />
        <input v-model="newPatient.email" type="email" placeholder="Email" />
        <input
          v-model="newPatient.phoneNumber"
          type="text"
          placeholder="Celular"
        />
        <input
          v-model="newPatient.address"
          type="text"
          placeholder="Direccion"
        />
        <button type="submit">Guardar Paciente</button>
      </form>
    </div>
    <div class="report-section">
      <div class="report-actions">
        <button class="button-secondary" @click="getAll">
          Consultar Todos
        </button>
        <span class="hint">Actualiza la lista para ver cambios recientes.</span>
      </div>
      <div v-if="loading" class="loading-state">Cargando pacientes...</div>
      <div v-else-if="error" class="message error">{{ error }}</div>
      <div v-else-if="patients && patients.length === 0" class="empty-state">
        No hay pacientes registrados. Agrega uno nuevo para comenzar.
      </div>
      <table v-else-if="patients && patients.length" class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Fehca de nacimiento</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Direccion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pat in patients">
            <td>{{ pat.id }}</td>
            <td>{{ pat.firstName }} {{ pat.lastName }}</td>
            <td>{{ pat.birthDate }}</td>
            <td>{{ pat.email }}</td>
            <td>{{ pat.phoneNumber }}</td>
            <td>{{ pat.address }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { createPatient, getPatients } from "@/clients/MedicalClient";

export default {
  data() {
    return {
      patients: null,
      loading: false,
      newPatient: {
        firstName: "",
        lastName: "",
        birthDate: "",
        phoneNumber: "",
        email: "",
        address: "",
      },
      error: null,
      statusMessage: "",
      statusType: "info",
    };
  },
  methods: {
    async getAll() {
      try {
        this.loading = true;
        this.error = null;
        const res = await getPatients();
        this.patients = res;
      } catch (error) {
        this.error = "Error: " + error.message;
        this.doctors = null;
      } finally {
        this.loading = false;
      }
    },
    async savePatient() {
      try {
        this.statusMessage = "";
        const body = {
          firstName: this.newPatient.firstName,
          lastName: this.newPatient.lastName,
          //birthDate: this.newPatient.birthDate,
          email: this.newPatient.email,
          phoneNumber: this.newPatient.phoneNumber,
          address: this.newPatient.address,
        };
        await createPatient(body);
        this.statusType = "success";
        this.statusMessage = "Paciente registrado correctamente.";
      } catch (error) {
        this.statusType = "error";
        this.statusMessage = "No se pudo registrar el paciente.";
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 980px;
  margin: 0 auto;
  padding: 2rem 0;
}

h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--color-text);
}

.page-subtitle {
  color: var(--color-text-muted);
  margin-bottom: 20px;
  font-size: 0.98rem;
}

h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--color-text);
}

.helper-text {
  color: var(--color-text-muted);
  font-size: 0.92rem;
  margin-bottom: 16px;
}

.card {
  background: var(--color-surface);
  padding: 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-2);
  margin-bottom: 24px;
}

form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

input {
  height: 42px;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.96rem;
}

input:focus {
  outline: 2px solid rgba(11, 107, 203, 0.2);
  border-color: var(--color-primary);
}

button {
  height: 42px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-primary);
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  grid-column: span 2;
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

button:hover {
  background: var(--color-primary-strong);
  box-shadow: 0 8px 20px rgba(11, 107, 203, 0.2);
  transform: translateY(-1px);
}

.button-secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-border-strong);
  grid-column: auto;
}

.button-secondary:hover {
  background: var(--color-surface-muted);
  color: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: none;
  transform: none;
}

.report-section {
  margin-top: 16px;
}

.report-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.hint {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.table th {
  background: rgba(11, 107, 203, 0.12);
  color: var(--color-text);
  padding: 12px;
  text-align: left;
  font-size: 14px;
}

.table td {
  border-bottom: 1px solid var(--color-border);
  padding: 12px;
  font-size: 14px;
  color: var(--color-text-muted);
}

.table tr:hover {
  background: var(--color-surface-muted);
}

.message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 14px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-2);
}

.message.success {
  background: rgba(26, 163, 168, 0.12);
  border-color: rgba(26, 163, 168, 0.3);
  color: var(--color-text);
}

.message.error {
  background: rgba(198, 40, 40, 0.12);
  border-color: rgba(198, 40, 40, 0.3);
  color: var(--color-text);
}

.message.info {
  background: rgba(11, 107, 203, 0.12);
  border-color: rgba(11, 107, 203, 0.3);
  color: var(--color-text);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 24px;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1px dashed var(--color-border);
}

@media (max-width: 900px) {
  form {
    grid-template-columns: 1fr;
  }

  button {
    grid-column: span 1;
  }

  .report-actions {
    align-items: stretch;
  }
}
</style>
