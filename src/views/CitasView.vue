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
      <div class="card-header">
        <div>
          <h4>Citas Registradas</h4>
          <p class="header-subtitle">
            Consulta, agenda y gestiona citas médicas
          </p>
        </div>
        <div class="header-actions">
          <button
            class="btn-refresh"
            @click="loadAllData()"
            title="Actualizar lista"
          >
            🔄
          </button>
          <button class="btn-add" @click="openModal">
            <span class="btn-icon">📅</span>
            <span class="btn-text">Agendar Cita</span>
          </button>
        </div>
      </div>

      <!-- formulario ahora en modal -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <header class="modal-header">
            <h4>{{ isEditing ? 'Editar Cita' : 'Agendar Cita' }}</h4>
            <button class="close" @click="closeModal">✕</button>
          </header>
          <section class="modal-body">
            <GenericForm
              :key="isEditing ? `edit-${editingId}` : 'new'"
              :fields="citaFields"
              :initial="nuevaCita"
              :submitLabel="isEditing ? 'Actualizar Cita' : 'Agendar Cita'"
              :showCancel="true"
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
      No hay citas registradas. Agrega una nueva para comenzar.
    </div>

    <GenericTable v-else :columns="citaColumns" :rows="citas" key-field="id">
      <template #cell="{ row, col }">
        <template v-if="col.field === 'status'">
          <span
            :class="[
              'badge',
              row.status === 'ACTIVA' ? 'bg-active' : 'bg-inactive'
            ]"
          >
            {{ row.status }}
          </span>
        </template>
        <template v-else-if="col.field === 'actions'">
          <div class="action-buttons">
            <button
              @click="editCita(row)"
              class="btn-action btn-edit"
              :class="{ 'btn-disabled': row.status !== 'ACTIVA' }"
              :disabled="row.status !== 'ACTIVA'"
              :title="
                row.status !== 'ACTIVA'
                  ? 'No se puede editar una cita inactiva'
                  : 'Editar'
              "
            >
              ✏️
            </button>
            <button
              @click="cancelCita(row.id)"
              class="btn-action btn-cancel"
              :class="{ 'btn-disabled': row.status !== 'ACTIVA' }"
              :disabled="row.status !== 'ACTIVA'"
              :title="
                row.status !== 'ACTIVA'
                  ? 'No se puede cancelar una cita inactiva'
                  : 'Cancelar'
              "
            >
              ❌
            </button>
          </div>
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
  getPatientsFacade,
  updateAppointmentFacade
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
      isEditing: false,
      editingId: null,
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
        { label: 'Acciones', field: 'actions' }
      ]
    }
  },
  methods: {
    openModal() {
      this.isEditing = false
      this.editingId = null
      this.nuevaCita = { fechaCita: '', doctorId: '', pacienteId: '' }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.isEditing = false
      this.editingId = null
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
          doctor: c.doctor || `${c.doctorNombre || ''}`,
          paciente: c.paciente || `${c.pacienteNombre || ''}`
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

        if (this.isEditing) {
          const body = {
            fechaCita: this.formatDateTimeForApi(payload.fechaCita),
            doctorId: payload.doctorId,
            pacienteId: payload.pacienteId
          }
          await updateAppointmentFacade(this.editingId, body)
          this.showMessage('Cita actualizada correctamente', 'success')
          await this.getAll(true)
        } else {
          const body = {
            fechaCita: this.formatDateTimeForApi(payload.fechaCita),
            doctorId: payload.doctorId,
            pacienteId: payload.pacienteId
          }
          await createAppointmentFacade(body)
          this.showMessage('Cita agendada correctamente', 'success')
          await this.getAll(true)
        }

        this.closeModal()
      } catch (error) {
        this.showMessage(
          `No se pudo ${this.isEditing ? 'actualizar' : 'agendar'} la cita`,
          'error'
        )
      } finally {
        this.loading = false
      }
    },
    editCita(cita) {
      // Validar que la cita esté activa
      if (cita.status !== 'ACTIVA') {
        this.showMessage('No se puede editar una cita inactiva', 'error')
        return
      }

      this.isEditing = true
      this.editingId = cita.id

      // Convertir la fecha formateada de vuelta a datetime-local format
      // Si viene como "2024-01-15 10:30", necesitamos "2024-01-15T10:30"
      let fechaFormatted = cita.fechaCita
      if (cita.fechaCita && !cita.fechaCita.includes('T')) {
        fechaFormatted = cita.fechaCita.replace(' ', 'T')
      }

      this.nuevaCita = {
        fechaCita: fechaFormatted,
        doctorId: cita.doctorId,
        pacienteId: cita.pacienteId
      }
      this.showModal = true
    },
    async cancelCita(id) {
      // Buscar la cita para validar su estado
      const cita = this.citas.find((c) => c.id === id)
      if (cita && cita.status !== 'ACTIVA') {
        this.showMessage(
          'No se puede cancelar una cita que ya está inactiva',
          'error'
        )
        return
      }

      this.loading = true
      try {
        await cancelAppointmentFacade(id)
        this.showMessage('Cita cancelada correctamente', 'success')
        await this.loadAllData()
      } catch (error) {
        this.showMessage(
          'No se pudo cancelar la cita. ' + (error.message || ''),
          'error'
        )
        console.error('Error al cancelar cita:', error)
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
        this.citas = appointments.map((c) => ({
          ...c,
          fechaCita: this.formatFecha(c.fechaCita),
          doctor: c.doctorName || c.doctor || `${c.doctorNombre || ''}`,
          paciente: c.pacienteName || c.paciente || `${c.pacienteNombre || ''}`
        }))
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
  margin: 0 0 4px 0;
  color: var(--color-text);
}

.header-subtitle {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin: 0;
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #0b6bcb 0%, #1a7fd5 100%);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.65rem 1.25rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(11, 107, 203, 0.2);
}

.btn-add:hover {
  background: linear-gradient(135deg, #0a5bb5 0%, #1670c0 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(11, 107, 203, 0.3);
}

.btn-add:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(11, 107, 203, 0.2);
}

.btn-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.btn-text {
  line-height: 1;
}

.btn-refresh {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: 10px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-refresh:hover {
  background: rgba(11, 107, 203, 0.08);
  border-color: var(--color-primary);
  transform: rotate(180deg);
}

.btn-refresh:active {
  transform: rotate(180deg) scale(0.95);
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

/* Botones de acción en la tabla */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-action {
  background: transparent;
  border: 1px solid var(--color-border-strong);
  padding: 0.35rem 0.6rem;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  cursor: pointer;
  transition:
    border 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.btn-action:hover {
  transform: scale(1.1);
}

.btn-edit:hover {
  border-color: var(--color-primary);
  background: rgba(11, 107, 203, 0.08);
}

.btn-cancel:hover {
  border-color: var(--color-danger);
  background: rgba(198, 40, 40, 0.08);
}

.btn-delete:hover {
  border-color: var(--color-danger);
  background: rgba(198, 40, 40, 0.08);
}

.btn-disabled {
  opacity: 0.4;
  cursor: not-allowed !important;
  pointer-events: none;
}

.btn-disabled:hover {
  transform: none !important;
  border-color: var(--color-border-strong) !important;
  background: transparent !important;
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
