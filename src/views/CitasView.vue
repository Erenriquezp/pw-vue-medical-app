<template>
  <div class="container">
    <h2>Reporte de Citas</h2>
    <p class="page-subtitle">
      Consulta, agenda y gestiona citas en un solo lugar.
    </p>

    <MessageComponent
      v-if="message"
      :type="message.type"
      :text="message.text"
    />

    <div class="card">
      <div>
        <h4>Agendar Nueva Cita</h4>
        <div>
          <button class="btn-primary" @click="openModal">Agendar Cita</button>
        </div>
      </div>

      <!-- formulario ahora en modal -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <header class="modal-header">
            <h4>Agendar Cita</h4>
            <button class="close" @click="closeModal">✕</button>
          </header>
          <section class="modal-body">
            <GenericForm
              :fields="citaFields"
              :initial="nuevaCita"
              submitLabel="Agendar Cita"
              @submit="handleFormSubmit"
              @cancel="closeModal"
            />
          </section>
        </div>
      </div>
    </div>

    <h3>Lista de Citas</h3>

    <div v-if="loading" class="loading-state">Cargando citas...</div>
    <div v-else-if="error" class="message error">{{ error }}</div>
    <div v-else-if="citas.length === 0" class="empty-state">
      No hay citas registradas. Agenda una nueva para comenzar.
    </div>

    <GenericTable :columns="citaColumns" :rows="citas" key-field="id">
      <template #cell="{ row, col }">
        <template v-if="col.field === 'status'">
          <span
            :class="[
              'badge',
              row.status === 'ACTIVE' ? 'bg-active' : 'bg-inactive'
            ]"
          >
            {{ row.status }}
          </span>
        </template>
        <template v-else-if="col.field === 'action'">
          <button
            @click="cancel(row.id)"
            class="btn-danger"
            style="font-size: 0.8rem"
          >
            Cancelar
          </button>
        </template>
        <template v-else>
          {{ row[col.field] }}
        </template>
      </template>
    </GenericTable>
  </div>
</template>

<script>
import {
  cancelAppointmentFacade,
  createAppointmentFacade,
  getAppointmentsFacade,
  getDoctorsFacade,
  getPatientsFacade
} from '@/clients/MedicalClient'
import MessageComponent from '@/components/MessageComponent.vue'
import GenericForm from '@/components/GenericForm.vue'
import GenericTable from '@/components/GenericTable.vue'

export default {
  components: { MessageComponent, GenericForm, GenericTable },
  data() {
    return {
      citas: [],
      doctors: [],
      pacientes: [],
      nuevaCita: {
        fechaCita: '',
        doctorId: '',
        pacienteId: ''
      },
      minDateTime: '',
      message: null,
      loading: false,
      error: null,
      showModal: false,
      citaFields: [
        {
          name: 'doctorId',
          label: 'Doctor',
          type: 'select',
          options: () =>
            this.doctors.map((d) => ({
              value: d.id,
              label: `Dr. ${d.nombre} - ${d.especialidad}`
            }))
        },
        {
          name: 'pacienteId',
          label: 'Paciente',
          type: 'select',
          options: () =>
            this.pacientes.map((p) => ({
              value: p.id,
              label: `${p.nombre} ${p.apellido}`
            }))
        },
        {
          name: 'fechaCita',
          label: 'Fecha',
          type: 'datetime-local',
          full: true
        }
      ],
      citaColumns: [
        { label: 'ID', field: 'id' },
        { label: 'Fecha', field: 'fechaCita' },
        { label: 'Doctor', field: 'doctor' },
        { label: 'Paciente', field: 'paciente' },
        { label: 'Estado', field: 'status' },
        { label: 'Accion', field: 'action' }
      ]
    }
  },
  methods: {
    openModal() {
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.nuevaCita = { fechaCita: '', doctorId: '', pacienteId: '' }
    },
    async getAll(silent = false) {
      this.loading = true
      this.error = null
      try {
        this.citas = await getAppointmentsFacade()
        // mapear campos para mostrar en tabla
        this.citas = this.citas.map((c) => ({
          ...c,
          fechaCita: this.formatFecha(c.fechaCita),
          doctor: c.doctorName || `${c.doctorNombre || ''}`,
          paciente: c.pacienteName || `${c.pacienteNombre || ''}`
        }))
        if (!silent)
          this.showMessage(`${this.citas.length} cita(s) cargada(s)`, 'info')
      } catch (error) {
        this.error = 'Error al cargar citas'
        this.showMessage('Error al cargar citas', 'error')
      } finally {
        this.loading = false
      }
    },
    setMinDateTime() {
      const now = new Date()
      const pad = (value) => String(value).padStart(2, '0')
      const year = now.getFullYear()
      const month = pad(now.getMonth() + 1)
      const day = pad(now.getDate())
      const hours = pad(now.getHours())
      const minutes = pad(now.getMinutes())
      this.minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`
    },
    async handleFormSubmit(payload) {
      this.loading = true
      try {
        if (!payload.doctorId || !payload.pacienteId || !payload.fechaCita) {
          this.showMessage('Completa doctor, paciente y fecha.', 'info')
          return
        }
        const body = {
          fechaCita: this.formatDateTimeForApi(payload.fechaCita),
          doctorId: payload.doctorId,
          pacienteId: payload.pacienteId
        }
        await createAppointmentFacade(body)
        this.nuevaCita = { fechaCita: '', doctorId: '', pacienteId: '' }
        this.showMessage('Cita agendada correctamente', 'success')
        this.closeModal()
        await this.getAll(true)
      } catch (error) {
        this.showMessage('No se pudo agendar la cita', 'error')
      } finally {
        this.loading = false
      }
    },
    async cancel(id) {
      this.loading = true
      try {
        await cancelAppointmentFacade(id)
        this.showMessage('Cita cancelada', 'success')
        await this.getAll(true)
      } catch (error) {
        this.showMessage('No se pudo cancelar la cita', 'error')
      } finally {
        this.loading = false
      }
    },
    async loadAllData() {
      this.loading = true
      this.error = null
      try {
        const [appointments, doctors, patients] = await Promise.all([
          getAppointmentsFacade(),
          getDoctorsFacade(),
          getPatientsFacade()
        ])
        this.citas = appointments.map((c) => ({ ...c }))
        this.doctors = doctors
        this.pacientes = patients
        this.showMessage(
          `Datos cargados: ${appointments.length} cita(s), ${doctors.length} doctor(es), ${patients.length} paciente(s)`,
          'success'
        )
      } catch (error) {
        this.error = 'Error al cargar datos'
        this.showMessage('Error al cargar datos', 'error')
      } finally {
        this.loading = false
      }
    },
    showMessage(text, type = 'success') {
      this.message = { text, type }
      setTimeout(() => {
        this.message = null
      }, 4000)
    },
    formatDateTimeForApi(value) {
      if (!value) {
        return ''
      }
      return value.length === 16 ? `${value}:00` : value
    },
    formatFecha(fechaStr) {
      if (!fechaStr) return ''
      const fecha = new Date(fechaStr)
      const opciones = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }
      return fecha.toLocaleString('es-ES', opciones)
    }
  },
  mounted() {
    this.setMinDateTime()
    this.loadAllData()
  }
}
</script>

<style scoped>
.container {
  max-width: 980px;
  margin: 0 auto;
  padding: 2rem 0;
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--color-text);
}

.page-subtitle {
  color: var(--color-text-muted);
  margin-bottom: 20px;
  font-size: 1rem;
}

h3,
h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 24px 0 8px;
  color: var(--color-text);
}

.helper-text {
  color: var(--color-text-muted);
  font-size: 0.95rem;
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

.btn-primary {
  border: 1px solid var(--color-border-strong);
  background: transparent;
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition:
    border 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}
.btn-primary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(11, 107, 203, 0.08);
}

.button-secondary {
  border: 1px solid var(--color-border-strong);
  background: transparent;
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition:
    border 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}
.button-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(11, 107, 203, 0.08);
}

.btn-danger {
  border: 1px solid var(--color-border-strong);
  background: transparent;
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition:
    border 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}
.btn-danger:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background: rgba(198, 40, 40, 0.08);
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
  font-size: 0.95rem;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-2);
  width: 95%;
  max-width: 480px;
  padding: 0;
  position: relative;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px 10px 22px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.modal-header h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.close {
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0 4px;
}

.modal-body {
  padding: 22px 22px 18px 22px;
  max-height: 60vh;
  overflow-y: auto;
  background: var(--color-surface);
}

@media (max-width: 900px) {
  .modal {
    max-width: 100vw;
    border-radius: 0;
  }
}
</style>
