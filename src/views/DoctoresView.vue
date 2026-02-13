<template>
  <div class="container">
    <h2>Doctores</h2>
    <p class="page-subtitle">
      Gestiona doctores y mantén su informacion actualizada.
    </p>

    <MessageComponent :text="message?.text" :type="message?.type" />

    <div class="card">
      <div class="card-header">
        <div>
          <h3>Doctores Registrados</h3>
          <p class="header-subtitle">
            Administra la información de los doctores
          </p>
        </div>
        <div class="header-actions">
          <button
            class="btn-refresh"
            @click="getAll()"
            title="Actualizar lista"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
              <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
            </svg>
          </button>
          <button class="btn-add" @click="openModal">
            <span class="btn-icon"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-stethoscope"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M6 4h-1a2 2 0 0 0 -2 2v3.5a5.5 5.5 0 0 0 11 0v-3.5a2 2 0 0 0 -2 -2h-1"
                />
                <path d="M8 15a6 6 0 1 0 12 0v-3" />
                <path d="M11 3v2" />
                <path d="M6 3v2" />
                <path d="M18 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /></svg
            ></span>
            <span class="btn-text">Nuevo Doctor</span>
          </button>
        </div>
      </div>
    </div>
    <!-- Modal para el formulario -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <header class="modal-header">
          <h3>{{ isEditing ? 'Editar Doctor' : 'Registrar Nuevo Doctor' }}</h3>
          <button class="button-secondary" @click="closeModal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-x"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div class="modal-body">
          <GenericForm
            :key="isEditing ? `edit-${editingId}` : 'new'"
            :fields="doctorFields"
            :initial="nuevoDoctor"
            :submitLabel="isEditing ? 'Actualizar Doctor' : 'Guardar Doctor'"
            :showCancel="true"
            @submit="handleFormSubmit"
            @cancel="closeModal"
          />
        </div>
      </div>
    </div>
    <div class="report-section">
      <div v-if="loading" class="loading-state">Cargando doctores...</div>
      <div v-else-if="doctors.length === 0" class="empty-state">
        No hay doctores registrados. Agrega uno nuevo para comenzar.
      </div>
      <GenericTable
        v-else
        :columns="doctorColumns"
        :rows="doctors"
        key-field="id"
      >
        <template #cell="{ row, col }">
          <template v-if="col.field === 'status'">
            <span
              :class="[
                'badge',
                row.status === 'ACTIVO' ? 'bg-active' : 'bg-inactive'
              ]"
            >
              {{ row.status }}
            </span>
          </template>
          <template v-else-if="col.field === 'actions'">
            <div class="action-buttons">
              <button
                @click="editDoctor(row)"
                class="btn-action btn-edit"
                :class="{ 'btn-disabled': row.status !== 'ACTIVO' }"
                :disabled="row.status !== 'ACTIVO'"
                :title="
                  row.status !== 'ACTIVO'
                    ? 'No se puede editar un doctor inactivo'
                    : 'Editar'
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-edit"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"
                  />
                  <path
                    d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415"
                  />
                  <path d="M16 5l3 3" />
                </svg>
              </button>
              <button
                @click="deleteDoctor(row.id)"
                class="btn-action btn-delete"
                :class="{ 'btn-disabled': row.status !== 'ACTIVO' }"
                :disabled="row.status !== 'ACTIVO'"
                :title="
                  row.status !== 'ACTIVO'
                    ? 'No se puede eliminar un doctor inactivo'
                    : 'Eliminar'
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-id-off"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M8 4h10a3 3 0 0 1 3 3v10m-1.437 2.561c-.455 .279 -.99 .439 -1.563 .439h-12a3 3 0 0 1 -3 -3v-10c0 -1.083 .573 -2.031 1.433 -2.559"
                  />
                  <path d="M8.175 8.178a2 2 0 1 0 2.646 2.65" />
                  <path d="M15 8h2" />
                  <path d="M16 12h1" />
                  <path d="M7 16h9" />
                  <path d="M3 3l18 18" />
                </svg>
              </button>
            </div>
          </template>
          <template v-else>
            {{ row[col.field] }}
          </template>
        </template>
      </GenericTable>
    </div>
  </div>
</template>

<script>
import {
  createDoctorFacade,
  deleteDoctorFacade,
  getDoctorsFacade,
  updateDoctorFacade
} from '@/clients/MedicalClient'
import MessageComponent from '@/components/MessageComponent.vue'
import GenericForm from '@/components/GenericForm.vue'
import GenericTable from '@/components/GenericTable.vue'

export default {
  components: { MessageComponent, GenericForm, GenericTable },
  data() {
    return {
      doctors: [],
      nuevoDoctor: {
        nombre: '',
        apellido: '',
        especialidad: '',
        email: '',
        telefono: '',
        numOficina: ''
      },
      // definición de campos para GenericForm
      doctorFields: [
        { name: 'nombre', label: 'Nombre', type: 'text' },
        { name: 'apellido', label: 'Apellido', type: 'text' },
        { name: 'especialidad', label: 'Especialidad', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'telefono', label: 'Telefono', type: 'text' },
        { name: 'numOficina', label: 'Numero de oficina', type: 'text' }
      ],
      message: null,
      loading: false,
      showModal: false,
      isEditing: false,
      editingId: null
    }
  },
  created() {
    // columnas para GenericTable
    this.doctorColumns = [
      { field: 'id', label: 'ID' },
      { field: 'nombreCompleto', label: 'Nombre' },
      { field: 'especialidad', label: 'Especialidad' },
      { field: 'email', label: 'Email' },
      { field: 'telefono', label: 'Telefono' },
      { field: 'numOficina', label: 'Oficina' },
      { field: 'status', label: 'Estado' },
      { field: 'actions', label: 'Acciones' }
    ]
  },
  methods: {
    openModal() {
      this.isEditing = false
      this.editingId = null
      this.nuevoDoctor = {
        nombre: '',
        apellido: '',
        especialidad: '',
        email: '',
        telefono: '',
        numOficina: ''
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.isEditing = false
      this.editingId = null
      this.nuevoDoctor = {
        nombre: '',
        apellido: '',
        especialidad: '',
        email: '',
        telefono: '',
        numOficina: ''
      }
    },
    editDoctor(doctor) {
      // Validar que el doctor esté activo
      if (doctor.status !== 'ACTIVO') {
        this.showMessage('No se puede editar un doctor inactivo', 'error')
        return
      }

      this.isEditing = true
      this.editingId = doctor.id
      this.nuevoDoctor = {
        nombre: doctor.nombre,
        apellido: doctor.apellido,
        especialidad: doctor.especialidad,
        email: doctor.email,
        telefono: doctor.telefono,
        numOficina: doctor.numOficina
      }
      this.showModal = true
    },
    async deleteDoctor(id) {
      // Buscar el doctor para validar su estado
      const doctor = this.doctors.find((d) => d.id === id)
      if (doctor && doctor.status !== 'ACTIVO') {
        this.showMessage(
          'No se puede eliminar un doctor que está inactivo',
          'error'
        )
        return
      }

      if (!confirm('¿Estás seguro de que deseas eliminar este doctor?')) {
        return
      }

      this.loading = true
      try {
        await deleteDoctorFacade(id)
        this.showMessage('Doctor eliminado correctamente.', 'success')
        await this.getAll()
      } catch (error) {
        this.showMessage('Error al eliminar doctor', 'error')
        console.error('Error deleting doctor:', error)
      } finally {
        this.loading = false
      }
    },
    async getAll() {
      this.loading = true
      try {
        this.doctors = await getDoctorsFacade()
        // añadir campo derivado nombreCompleto para la tabla
        this.doctors = this.doctors.map((d) => ({
          ...d,
          nombreCompleto: `${d.nombre} ${d.apellido}`
        }))
        this.showMessage(`${this.doctors.length} doctor(es) cargado(s)`)
      } catch (error) {
        this.showMessage('Error al cargar doctores', 'error')
        console.error('Error loading doctors:', error)
      } finally {
        this.loading = false
      }
    },
    // manejador para submit del GenericForm
    async handleFormSubmit(payload) {
      this.loading = true
      try {
        if (this.isEditing) {
          await updateDoctorFacade(this.editingId, payload)
          this.showMessage('Doctor actualizado exitosamente', 'success')
          await this.getAll()
        } else {
          await createDoctorFacade(payload)
          this.showMessage('Doctor registrado exitosamente', 'success')
          await this.getAll()
        }

        // Limpiar datos iniciales para resetear el formulario
        this.nuevoDoctor = {
          nombre: '',
          apellido: '',
          especialidad: '',
          email: '',
          telefono: '',
          numOficina: ''
        }

        // cerrar modal
        this.closeModal()
      } catch (error) {
        this.showMessage(
          `Error al ${this.isEditing ? 'actualizar' : 'guardar'} doctor`,
          'error'
        )
        console.error('Error saving doctor:', error)
      } finally {
        this.loading = false
      }
    },
    showMessage(text, type = 'success') {
      this.message = { text, type }
      setTimeout(() => {
        this.message = null
      }, 4000)
    }
  },
  mounted() {
    this.getAll()
  }
}
</script>

<style scoped>
.container {
  max-width: 980px;
  margin: 0 auto;
  padding: 24px;
}
h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--color-text);
}

h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--color-text);
}

.header-subtitle {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin: 0;
}

.card {
  background: var(--color-surface);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-2);
  margin-bottom: 24px;
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.page-subtitle {
  color: var(--color-text-muted);
  margin-bottom: 20px;
  font-size: 1rem;
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
  cursor: pointer;
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

.button-secondary svg {
  width: 1.1rem;
  height: 1.1rem;
  stroke: currentColor;
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
  background-color: white;
}

.table th {
  background: rgba(11, 107, 203, 0.12);
  color: var(--color-text);
  padding: 12px;
  text-align: left;
  font-size: 14px;
  font-weight: bold;
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

/* Estilos del modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
}

.modal {
  width: 720px;
  max-width: 95%;
  background: var(--color-surface);
  border-radius: 12px;
  box-shadow: var(--shadow-2);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}

.modal-body {
  padding: 16px;
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
</style>
