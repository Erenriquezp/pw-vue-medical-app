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
        :value="stats.doctors"
        label="Médicos Disponibles"
        variant="blue"
      >
        <template #icon>
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
            class="icon icon-tabler icons-tabler-outline icon-tabler-medical-cross"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M13 3a1 1 0 0 1 1 1v4.535l3.928 -2.267a1 1 0 0 1 1.366 .366l1 1.732a1 1 0 0 1 -.366 1.366l-3.927 2.268l3.927 2.269a1 1 0 0 1 .366 1.366l-1 1.732a1 1 0 0 1 -1.366 .366l-3.928 -2.269v4.536a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-4.536l-3.928 2.268a1 1 0 0 1 -1.366 -.366l-1 -1.732a1 1 0 0 1 .366 -1.366l3.927 -2.268l-3.927 -2.268a1 1 0 0 1 -.366 -1.366l1 -1.732a1 1 0 0 1 1.366 -.366l3.928 2.267v-4.535a1 1 0 0 1 1 -1h2"
            />
          </svg>
        </template>
      </StatCard>

      <StatCard
        :value="stats.patients"
        label="Pacientes Registrados"
        variant="green"
      >
        <template #icon>
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
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
            <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
          </svg>
        </template>
      </StatCard>

      <StatCard
        :value="stats.activeAppointments"
        label="Citas Activas"
        variant="orange"
      >
        <template #icon>
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
            class="icon icon-tabler icons-tabler-outline icon-tabler-calendar-stats"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4"
            />
            <path d="M18 14v4h4" />
            <path d="M14 18a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
            <path d="M15 3v4" />
            <path d="M7 3v4" />
            <path d="M3 11h16" />
          </svg>
        </template>
      </StatCard>
    </div>

    <div class="content-grid">
      <section class="card quick-actions">
        <h2>⚡ Acciones Rápidas</h2>
        <div class="buttons-wrapper">
          <ActionButton label="Nueva Cita" to="/appointments">
            <template #icon>
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
                class="icon icon-tabler icons-tabler-outline icon-tabler-calendar-plus"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M12.5 21h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v5"
                />
                <path d="M16 3v4" />
                <path d="M8 3v4" />
                <path d="M4 11h16" />
                <path d="M16 19h6" />
                <path d="M19 16v6" />
              </svg>
            </template>
          </ActionButton>

          <ActionButton label="Nuevo Paciente" to="/patients">
            <template #icon>
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
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                <path d="M16 19h6" />
                <path d="M19 16v6" />
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
              </svg>
            </template>
          </ActionButton>

          <ActionButton label="Añadir Médico" to="/doctors">
            <template #icon>
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
                class="icon icon-tabler icons-tabler-outline icon-tabler-stethoscope"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M6 4h-1a2 2 0 0 0 -2 2v3.5a5.5 5.5 0 0 0 11 0v-3.5a2 2 0 0 0 -2 -2h-1"
                />
                <path d="M8 15a6 6 0 1 0 12 0v-3" />
                <path d="M11 3v2" />
                <path d="M6 3v2" />
                <path d="M18 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              </svg>
            </template>
          </ActionButton>
        </div>
      </section>

      <section class="card upcoming-section">
        <h2 class="dates">
          <span>
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
              class="icon icon-tabler icons-tabler-outline icon-tabler-calendar-week"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12"
              />
              <path d="M16 3v4" />
              <path d="M8 3v4" />
              <path d="M4 11h16" />
              <path d="M7 14h.013" />
              <path d="M10.01 14h.005" />
              <path d="M13.01 14h.005" />
              <path d="M16.015 14h.005" />
              <path d="M13.015 17h.005" />
              <path d="M7.01 17h.005" />
              <path d="M10.01 17h.005" />
            </svg>
          </span>
          <span> Próximas Citas </span>
        </h2>

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
.dates {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dates span {
  display: flex;
  align-items: center;
  justify-content: center;
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
