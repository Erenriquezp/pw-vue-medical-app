<template>
  <div class="container">
    <h2>Pacientes</h2>
    <p class="page-subtitle">
      Gestiona pacientes y mantén su informacion actualizada.
    </p>

    <MessageComponent
      :text="message && message.text"
      :type="message && message.type"
    />

    <div class="card">
      <div class="card-header">
        <div>
          <h3>Pacientes Registrados</h3>
          <p class="header-subtitle">
            Administra la información de los pacientes
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
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                <path d="M16 19h6" />
                <path d="M19 16v6" />
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4" /></svg
            ></span>
            <span class="btn-text">Nuevo Paciente</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para el formulario -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <header class="modal-header">
          <h4>{{ isEditing ? 'Editar Paciente' : 'Registrar Paciente' }}</h4>
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
        <section class="modal-body">
          <GenericForm
            :key="isEditing ? `edit-${editingId}` : 'new'"
            :fields="pacienteFields"
            :initial="nuevoPaciente"
            :submitLabel="
              isEditing ? 'Actualizar Paciente' : 'Guardar Paciente'
            "
            :showCancel="true"
            @submit="handleFormSubmit"
            @cancel="closeModal"
          />
        </section>
      </div>
    </div>

    <div class="report-section">
      <div class="report-actions">
        <span class="hint">Actualiza la lista para ver cambios recientes.</span>
      </div>

      <div v-if="loading" class="loading-state">Cargando pacientes...</div>
      <div v-else-if="error" class="message error">{{ error }}</div>
      <div v-else-if="!pacientes || pacientes.length === 0" class="empty-state">
        No hay pacientes registrados. Agrega uno nuevo para comenzar.
      </div>

      <GenericTable
        v-else
        :columns="pacienteColumns"
        :rows="pacientes"
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
                @click="editPaciente(row)"
                class="btn-action btn-edit"
                :class="{ 'btn-disabled': row.status !== 'ACTIVO' }"
                :disabled="row.status !== 'ACTIVO'"
                :title="
                  row.status !== 'ACTIVO'
                    ? 'No se puede editar un paciente inactivo'
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
                @click="deletePaciente(row.id)"
                class="btn-action btn-delete"
                :class="{ 'btn-disabled': row.status !== 'ACTIVO' }"
                :disabled="row.status !== 'ACTIVO'"
                :title="
                  row.status !== 'ACTIVO'
                    ? 'No se puede eliminar un paciente inactivo'
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
  createPatientFacade,
  deletePatientFacade,
  getPatientsFacade,
  updatePatientFacade
} from '@/clients/MedicalClient'
import GenericForm from '@/components/GenericForm.vue'
import GenericTable from '@/components/GenericTable.vue'
import MessageComponent from '@/components/MessageComponent.vue'

export default {
  components: { MessageComponent, GenericForm, GenericTable },
  data() {
    return {
      pacientes: null,
      loading: false,
      nuevoPaciente: {
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        telefono: '',
        email: '',
        direccion: ''
      },
      message: null,
      error: null,
      showModal: false,
      isEditing: false,
      editingId: null,
      pacienteFields: [
        { name: 'nombre', label: 'Nombre', type: 'text' },
        { name: 'apellido', label: 'Apellido', type: 'text' },
        { name: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'date' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'telefono', label: 'Celular', type: 'text' },
        { name: 'direccion', label: 'Direccion', type: 'text', full: true }
      ],
      pacienteColumns: [
        { label: 'ID', field: 'id' },
        { label: 'Nombre', field: 'nombreCompleto' },
        { label: 'Fecha de nacimiento', field: 'fechaNacimiento' },
        { label: 'Email', field: 'email' },
        { label: 'Telefono', field: 'telefono' },
        { label: 'Direccion', field: 'direccion' },
        { label: 'Estado', field: 'status' },
        { label: 'Acciones', field: 'actions' }
      ]
    }
  },
  methods: {
    openModal() {
      this.isEditing = false
      this.editingId = null
      this.nuevoPaciente = {
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        telefono: '',
        email: '',
        direccion: ''
      }
      this.message = null
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.isEditing = false
      this.editingId = null
      // reset form state
      this.nuevoPaciente = {
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        telefono: '',
        email: '',
        direccion: ''
      }
    },
    editPaciente(paciente) {
      // Validar que el paciente esté activo
      if (paciente.status !== 'ACTIVO') {
        this.showMessage('No se puede editar un paciente inactivo', 'error')
        return
      }

      this.isEditing = true
      this.editingId = paciente.id
      this.nuevoPaciente = {
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        fechaNacimiento: paciente.fechaNacimiento,
        telefono: paciente.telefono,
        email: paciente.email,
        direccion: paciente.direccion
      }
      this.showModal = true
    },
    async deletePaciente(id) {
      // Buscar el paciente para validar su estado
      const paciente = this.pacientes.find((p) => p.id === id)
      if (paciente && paciente.status !== 'ACTIVO') {
        this.showMessage(
          'No se puede eliminar un paciente que está inactivo',
          'error'
        )
        return
      }

      if (!confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
        return
      }

      this.loading = true
      try {
        await deletePatientFacade(id)
        this.showMessage('Paciente eliminado correctamente.', 'success')
        await this.getAll()
      } catch (error) {
        this.showMessage(
          'No se pudo eliminar el paciente. ' + (error.message || ''),
          'error'
        )
        console.error('Error al eliminar paciente:', error)
      } finally {
        this.loading = false
      }
    },
    async getAll() {
      this.loading = true
      this.error = null
      try {
        const res = await getPatientsFacade()
        // agregar campo derivado nombreCompleto para la tabla
        this.pacientes =
          res?.map((p) => ({
            ...p,
            nombreCompleto: `${p.nombre} ${p.apellido}`
          })) || []
        this.showMessage(
          `${this.pacientes?.length || 0} paciente(s) cargado(s)`,
          'success'
        )
      } catch (error) {
        this.error = 'Error: ' + (error.message || error)
        this.pacientes = null
      } finally {
        this.loading = false
      }
    },
    async handleFormSubmit(payload) {
      try {
        if (this.isEditing) {
          await updatePatientFacade(this.editingId, payload)
          this.showMessage('Paciente actualizado correctamente.', 'success')
          await this.getAll()
        } else {
          await createPatientFacade(payload)
          this.showMessage('Paciente registrado correctamente.', 'success')
          await this.getAll()
        }
        this.closeModal()
      } catch (error) {
        this.showMessage(
          `No se pudo ${this.isEditing ? 'actualizar' : 'registrar'} el paciente. ` +
            (error.response?.data?.message || error.message),
          'error'
        )
        console.error('Error al guardar paciente:', error)
      }
    },
    showMessage(text, type = 'info') {
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
  margin-bottom: 4px;
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
  font-size: 0.95rem;
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

/* modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal {
  width: 95%;
  max-width: 480px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-2);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}

.modal-body {
  padding: 16px;
}

.button-secondary svg {
  width: 1.1rem;
  height: 1.1rem;
  stroke: currentColor;
}

@media (max-width: 900px) {
  .modal {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}

/* Mejora visual para el botón de agregar */
.card .button-secondary {
  margin-left: 0;
  margin-top: 8px;
  min-width: 170px;
  font-size: 1.05rem;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(11, 107, 203, 0.08);
}
.card .button-secondary:first-child {
  margin-top: 0;
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
