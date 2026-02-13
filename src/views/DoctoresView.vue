<template>
  <div class="container">
    <h2>Doctores</h2>

    <MessageComponent :text="message?.text" :type="message?.type" />

    <div class="card">
      <div class="card-header">
        <h3>Registrar Nuevo Doctor</h3>
        <button class="btn-primary" @click="openModal">Nuevo Doctor</button>
      </div>
    </div>
    <!-- Modal para el formulario -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <header class="modal-header">
          <h3>Registrar Nuevo Doctor</h3>
          <button class="button-secondary" @click="closeModal">Cerrar</button>
        </header>
        <div class="modal-body">
          <GenericForm
            :fields="doctorFields"
            :initial="nuevoDoctor"
            submitLabel="Guardar Doctor"
            @submit="handleFormSubmit"
          />
        </div>
      </div>
    </div>
    <div class="report-section">
      <GenericTable :columns="doctorColumns" :rows="doctors" key-field="id" />
    </div>
  </div>
</template>

<script>
import { createDoctorFacade, getDoctorsFacade } from '@/clients/MedicalClient'
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
      showModal: false
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
      { field: 'numOficina', label: 'Oficina' }
    ]
  },
  methods: {
    openModal() {
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
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
        await createDoctorFacade(payload)

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

        this.showMessage('Doctor registrado exitosamente', 'success')
        await this.getAll()
      } catch (error) {
        this.showMessage('Error al guardar doctor', 'error')
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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
  cursor: pointer;
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
</style>
