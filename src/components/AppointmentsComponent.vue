<template lang="">
  <div class="container">
    <h2>Reporte de Citas</h2>
    <p class="page-subtitle">
      Consulta, agenda y gestiona citas en un solo lugar.
    </p>

    <div v-if="message" :class="['message', message.type]">
      {{ message.text }}
    </div>
    <div class="card">
      <h3>Agendar Nueva Cita</h3>
      <p class="helper-text">
        Selecciona un doctor y un paciente para crear la cita.
      </p>
      <form @submit.prevent="saveAppointment" class="form-grid">
        <div class="form-group">
          <select v-model="newAppointment.doctorId" class="form-control">
            <option value="">Escoger Doctor</option>
            <option v-for="doc in doctors" :value="doc.id">
              Dr. {{ doc.lastName }} - {{ doc.specialty }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <select v-model="newAppointment.patientId" class="form-control">
            <option value="">Escoger Paciente</option>
            <option v-for="pat in patients" :value="pat.id">
              Dr. {{ pat.lastName }} - {{ pat.firstName }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <input
            v-model="newAppointment.appointmentDate"
            class="form-control"
            type="datetime-local"
            :min="minDateTime"
          />
        </div>
        <button type="submit" class="btn-primary full-width">
          Agendar Cita
        </button>
      </form>
      <div class="report-actions">
        <button class="button-secondary" @click="getAll()">
          Obtener Citas
        </button>
        <span class="hint"
          >Actualiza la lista para ver los cambios mas recientes.</span
        >
      </div>
    </div>

    <h3>Lista de Citas</h3>
    <div v-if="loading" class="loading-state">Cargando citas...</div>
    <div v-else-if="error" class="message error">{{ error }}</div>
    <div v-else-if="appointments.length === 0" class="empty-state">
      No hay citas registradas. Agenda una nueva para comenzar.
    </div>
    <table v-else class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Fecha</th>
          <th>Doctor</th>
          <th>Paciente</th>
          <th>Estado</th>
          <th>Accion</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="app in appointments" :key="app.id">
          <td>{{ app.id }}</td>
          <td>{{ app.appointmentDate }}</td>
          <td>{{ app.doctorName }}</td>
          <td>{{ app.patientName }}</td>
          <td>
            <span
              :class="[
                'badge',
                app.status === 'ACTIVE' ? 'bg-active' : 'bg-inactive',
              ]"
            >
              {{ app.status }}
            </span>
          </td>
          <td>
            <button
              @click="cancel(app.id)"
              class="btn-danger"
              style="font-size: 0.8rem"
            >
              Cancel
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import {
  cancelAppointment,
  createAppointment,
  getAppointments,
  getDoctors,
  getPatients,
} from "@/clients/MedicalClient";

export default {
  data() {
    return {
      appointments: [],
      doctors: [],
      patients: [],
      newAppointment: {
        appointmentDate: "",
        doctorId: "",
        patientId: "",
      },
      minDateTime: "",
      message: null,
      loading: false,
      error: null,
    };
  },
  methods: {
    async getAll(silent = false) {
      this.loading = true;
      this.error = null;
      try {
        this.appointments = await getAppointments();
        if (!silent) {
          this.showMessage(
            `${this.appointments.length} cita(s) cargada(s)`,
            "info",
          );
        }
      } catch (error) {
        this.error = "Error al cargar citas";
        this.showMessage("Error al cargar citas", "error");
      } finally {
        this.loading = false;
      }
    },
    async saveAppointment() {
      this.loading = true;
      try {
        if (
          !this.newAppointment.doctorId ||
          !this.newAppointment.patientId ||
          !this.newAppointment.appointmentDate
        ) {
          this.showMessage("Completa doctor, paciente y fecha.", "info");
          return;
        }
        const body = {
          appointmentDate: this.formatDateTimeForApi(
            this.newAppointment.appointmentDate,
          ),
          doctorId: this.newAppointment.doctorId,
          patientId: this.newAppointment.patientId,
        };
        await createAppointment(body);
        this.newAppointment.doctorId = "";
        this.newAppointment.patientId = "";
        this.newAppointment.appointmentDate = "";
        this.showMessage("Cita agendada correctamente", "success");
        await this.getAll(true);
      } catch (error) {
        this.showMessage("No se pudo agendar la cita", "error");
      } finally {
        this.loading = false;
      }
    },
    async cancel(id) {
      this.loading = true;
      try {
        await cancelAppointment(id);
        this.showMessage("Cita cancelada", "success");
        await this.getAll(true);
      } catch (error) {
        this.showMessage("No se pudo cancelar la cita", "error");
      } finally {
        this.loading = false;
      }
    },
    async loadAllData() {
      this.loading = true;
      this.error = null;
      try {
        const [appointments, doctors, patients] = await Promise.all([
          getAppointments(),
          getDoctors(),
          getPatients(),
        ]);
        this.appointments = appointments;
        this.doctors = doctors;
        this.patients = patients;
      } catch (error) {
        this.error = "Error al cargar datos";
        this.showMessage("Error al cargar datos", "error");
      } finally {
        this.loading = false;
      }
    },
    showMessage(text, type = "success") {
      this.message = { text, type };
      setTimeout(() => {
        this.message = null;
      }, 4000);
    },
    formatDateTimeForApi(value) {
      if (!value) {
        return "";
      }
      return value.length === 16 ? `${value}:00` : value;
    },
    setMinDateTime() {
      const now = new Date();
      const pad = (value) => String(value).padStart(2, "0");
      const year = now.getFullYear();
      const month = pad(now.getMonth() + 1);
      const day = pad(now.getDate());
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      this.minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    },
  },
  mounted() {
    this.setMinDateTime();
    this.loadAllData();
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
  margin: 24px 0 8px;
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
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-control {
  height: 42px;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.96rem;
}

.form-control:focus {
  outline: 2px solid rgba(11, 107, 203, 0.2);
  border-color: var(--color-primary);
}

.full-width {
  grid-column: span 2;
}

button {
  height: 42px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

button:hover {
  border-color: var(--color-border-strong);
  background: var(--color-surface-muted);
}

.btn-primary {
  background: var(--color-primary);
  color: #ffffff;
  border: none;
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.btn-primary:hover {
  background: var(--color-primary-strong);
  box-shadow: 0 8px 20px rgba(11, 107, 203, 0.2);
  transform: translateY(-1px);
}

.button-secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-border-strong);
}

.button-secondary:hover {
  background: var(--color-surface-muted);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.report-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
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

.table th,
.table td {
  padding: 12px;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
  font-size: 14px;
}

.table th {
  background: rgba(11, 107, 203, 0.12);
  color: var(--color-text);
}

.badge {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.bg-active {
  background: rgba(26, 163, 168, 0.16);
  color: var(--color-accent);
}

.bg-inactive {
  background: rgba(198, 40, 40, 0.12);
  color: var(--color-danger);
}

.btn-danger {
  background: rgba(198, 40, 40, 0.1);
  color: var(--color-danger);
  border: 1px solid rgba(198, 40, 40, 0.3);
  padding: 6px 12px;
  height: auto;
}

.btn-danger:hover {
  background: rgba(198, 40, 40, 0.18);
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
  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: span 1;
  }

  .report-actions {
    align-items: stretch;
  }
}
</style>
