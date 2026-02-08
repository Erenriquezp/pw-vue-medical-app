<template>
  <div class="container">
    <h2>Reporte de Doctores</h2>

    <!-- Mensaje informativo -->
    <div v-if="message" :class="['message', message.type]">
      {{ message.text }}
    </div>

    <div class="card">
      <h3>Registrar Nuevo Doctor</h3>
      <form @submit.prevent="saveDoctor" class="form-grid">
        <div class="form-group">
          <label>Nombre:</label>
          <input v-model="newDoctor.firstName" type="text" required />
        </div>
        <div class="form-group">
          <label>Apellido:</label>
          <input v-model="newDoctor.lastName" type="text" required />
        </div>
        <div class="form-group">
          <label>Especialidad:</label>
          <input v-model="newDoctor.specialty" type="text" required />
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input v-model="newDoctor.email" type="email" required />
        </div>
        <div class="form-group">
          <label>Telefono:</label>
          <input v-model="newDoctor.phoneNumber" type="text" />
        </div>
        <div class="form-group">
          <label>Numero de oficina:</label>
          <input v-model="newDoctor.officeNumber" type="text" />
        </div>

        <button class="btn-primary full-width" type="submit">
          Guardar Doctor
        </button>
      </form>
    </div>
    <div class="report-section">
      <h3>Lista de Doctores</h3>
      <button @click="getAll">Consultar Todos</button>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialty</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Office Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in doctors">
            <td>{{ doc.id }}</td>
            <td>{{ doc.firstName }} {{ doc.lastName }}</td>
            <td>{{ doc.specialty }}</td>
            <td>{{ doc.email }}</td>
            <td>{{ doc.phoneNumber }}</td>
            <td>{{ doc.officeNumber }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { createDoctor, getDoctors } from "@/clients/MedicalClient";

export default {
  data() {
    return {
      doctors: [],
      newDoctor: {
        firstName: "",
        lastName: "",
        specialty: "",
        email: "",
        phoneNumber: "",
        officeNumber: "",
      },
      message: null,
      loading: false,
    };
  },
  methods: {
    async getAll() {
      this.loading = true;
      try {
        this.doctors = await getDoctors();
        this.showMessage(`${this.doctors.length} doctor(es) cargado(s)`);
      } catch (error) {
        this.showMessage("Error al cargar doctores", "error");
        console.error("Error loading doctors:", error);
      }
    },
    async saveDoctor() {
      this.loading = true;
      try {
        await createDoctor(this.newDoctor);
        this.showMessage("Doctor registrado exitosamente", "success");

        this.newDoctor = {
          firstName: "",
          lastName: "",
          specialty: "",
          email: "",
          phoneNumber: "",
          officeNumber: "",
        };
      } catch (error) {
        this.showMessage("Error al guardar doctor", "error");
        console.error("Error saving doctor:", error);
        this.loading = false;
      }
    },
    showMessage(text, type = "success") {
      this.message = { text, type };
      setTimeout(() => {
        this.message = null;
      }, 4000);
    },
  },
  mounted() {
    this.getAll();
  },
};
</script>

<style scoped>
.container {
  max-width: 980px;
  margin: 0 auto;
  padding: 24px;
}

h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--color-text);
}

h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--color-text);
}

.card {
  background: var(--color-surface);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-2);
  margin-bottom: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text);
}

.form-group input {
  height: 40px;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-text);
}

.form-group input:focus {
  outline: 2px solid rgba(11, 107, 203, 0.2);
  border-color: var(--color-primary);
}

.full-width {
  grid-column: span 2;
}

button {
  height: 40px;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  border-color: var(--color-border-strong);
  background: var(--color-surface-muted);
}

.btn-primary {
  background: var(--color-primary);
  color: #ffffff;
  border: none;
}

.btn-primary:hover {
  background: var(--color-primary-strong);
}

.report-section {
  margin-top: 16px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
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
  border-radius: 12px;
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

.empty-message {
  text-align: center;
  color: var(--color-text-muted);
  padding: 20px;
  font-style: italic;
}

.full-width {
  width: 100%;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 24px;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px dashed var(--color-border);
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width,
  .full-with {
    grid-column: span 1;
  }
}
</style>
