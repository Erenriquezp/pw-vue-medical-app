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
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <h3>Pacientes</h3>
        <div>
          <button class="btn-primary" @click="openModal">Nuevo Paciente</button>
        </div>
      </div>
      <p class="helper-text">Completa los datos basicos antes de guardar.</p>
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <header class="modal-header">
            <h4>Registrar Paciente</h4>
            <button class="close" @click="closeModal">✕</button>
          </header>
          <section class="modal-body">
            <GenericForm
              :fields="pacienteFields"
              :initial="nuevoPaciente"
              submitLabel="Guardar Paciente"
              @submit="handleFormSubmit"
              @cancel="closeModal"
            />
          </section>
        </div>
      </div>
    </div>

    <div class="report-section">
      <div class="report-actions">
        <span class="hint">Actualiza la lista para ver cambios recientes.</span>
      </div>

      <div v-if="loading" class="loading-state">Cargando pacientes...</div>
      <div v-else-if="error" class="message error">{{ error }}</div>
      <div v-else-if="pacientes && pacientes.length === 0" class="empty-state">
        No hay pacientes registrados. Agrega uno nuevo para comenzar.
      </div>

      <GenericTable
        v-else
        :columns="pacienteColumns"
        :rows="pacientes"
        key-field="id"
      />
    </div>
  </div>
</template>

<script>
import { createPatientFacade, getPatientsFacade } from '@/clients/MedicalClient'
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
        { label: 'Direccion', field: 'direccion' }
      ]
    }
  },
  methods: {
    openModal() {
      this.showModal = true
      this.message = null
    },
    closeModal() {
      this.showModal = false
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
        await createPatientFacade(payload)
        this.showMessage('Paciente registrado correctamente.', 'success')
        this.closeModal()
        await this.getAll()
      } catch (error) {
        this.showMessage(
          'No se pudo registrar el paciente. ' +
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
  margin-bottom: 8px;
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
  margin-bottom: 24px;
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

.close {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
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
</style>
