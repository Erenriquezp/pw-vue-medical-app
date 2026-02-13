<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div>
        <h1>Bienvenido Administrador 👋</h1>
        <p class="subtitle">
          Aquí está lo que está sucediendo en su clínica hoy.
        </p>
      </div>
      <div class="date-badge">
        {{ currentDate }}
      </div>
    </header>

    <div class="stats-grid">
      <StatCard
        icon="👨‍⚕️"
        :value="stats.doctors"
        label="Médicos Disponibles"
        variant="blue"
      />
      <StatCard
        icon="🤒"
        :value="stats.patients"
        label="Pacientes Registrados"
        variant="green"
      />
      <StatCard
        icon="📅"
        :value="stats.activeAppointments"
        label="Citas Activas"
        variant="orange"
      />
    </div>

    <div class="content-grid">
      <section class="card quick-actions">
        <h2>⚡ Acciones Rápidas</h2>
        <div class="buttons-wrapper">
          <ActionButton icon="➕" label="Nueva Cita" to="/appointments" />
          <ActionButton icon="👤" label="Nuevo Paciente" to="/patients" />
          <ActionButton icon="🥼" label="Añadir Médico" to="/doctors" />
        </div>
      </section>

      <section class="card upcoming-section">
        <h2>🔜 Próximas Citas</h2>

        <div v-if="loading" class="loading-text">Cargando datos...</div>

        <ul
          v-else-if="upcomingAppointments.length > 0"
          class="appointment-list"
        >
          <AppointmentListItem
            v-for="app in upcomingAppointments"
            :key="app.id"
            :day="getDay(app.fechaCita)"
            :month="getMonth(app.fechaCita)"
            :doctor-name="`Dr. ${app.doctor}`"
            :patient-label="`Paciente: ${app.paciente}`"
            :time="getTime(app.fechaCita)"
          />
        </ul>

        <div v-else class="empty-text">No hay citas activas programadas.</div>
      </section>
    </div>
  </div>
</template>

<script>
import {
  getDoctorsFacade,
  getPatientsFacade,
  getAppointmentsFacade
} from '@/clients/MedicalClient'
import StatCard from '@/components/StatCard.vue'
import ActionButton from '@/components/ActionButton.vue'
import AppointmentListItem from '@/components/AppointmentListItem.vue'

export default {
  components: {
    StatCard,
    ActionButton,
    AppointmentListItem
  },
  data() {
    return {
      stats: {
        doctors: 0,
        patients: 0,
        activeAppointments: 0
      },
      appointments: [],
      loading: true,
      currentDate: new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },
  mounted() {
    this.loadDashboardData()
  },
  computed: {
    upcomingAppointments() {
      return this.appointments
        .filter((app) => app.status === 'ACTIVA')
        .sort((a, b) => new Date(a.fechaCita) - new Date(b.fechaCita))
        .slice(0, 3)
    }
  },
  methods: {
    async loadDashboardData() {
      try {
        const [docs, pats, apps] = await Promise.all([
          getDoctorsFacade(),
          getPatientsFacade(),
          getAppointmentsFacade()
        ])

        this.stats.doctors = docs.length
        this.stats.patients = pats.length
        this.appointments = apps

        this.stats.activeAppointments = apps.filter(
          (a) => a.status === 'ACTIVA'
        ).length
      } catch (error) {
        console.error('Error loading dashboard', error)
      } finally {
        this.loading = false
      }
    },
    getDay(dateStr) {
      return new Date(dateStr).getDate()
    },
    getMonth(dateStr) {
      return new Date(dateStr).toLocaleString('es-ES', { month: 'short' })
    },
    getTime(dateStr) {
      return new Date(dateStr).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 0;
  color: var(--color-text);
}

/* HEADER */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-top: 0;
}

.dashboard-header h1 {
  font-size: 1.7rem;
  margin: 0;
  color: var(--color-text);
  font-weight: 700;
}

.subtitle {
  color: var(--color-text-muted);
  margin-top: 0.4rem;
  font-size: 0.98rem;
}

.date-badge {
  background: var(--color-surface-muted);
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-weight: 600;
  color: var(--color-text-muted);
  font-size: 0.88rem;
  border: 1px solid var(--color-border);
}

/* STATS GRID */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* CONTENT GRID */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.card {
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-2);
  border: 1px solid var(--color-border);
}

.card h2 {
  font-size: 1.15rem;
  margin-bottom: 1.25rem;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.65rem;
}

/* QUICK ACTIONS */
.buttons-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* UPCOMING LIST */
.appointment-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.loading-text,
.empty-text {
  text-align: center;
  color: var(--color-text-muted);
  padding: 20px;
  font-style: italic;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
