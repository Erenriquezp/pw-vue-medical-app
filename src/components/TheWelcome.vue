<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div>
        <h1>Bienvenido Administrador 👋</h1>
        <p class="subtitle">Aquí está lo que está sucediendo en su clínica hoy.</p>
      </div>
      <div class="date-badge">
        {{ currentDate }}
      </div>
    </header>

    <div class="stats-grid">
      <div class="stat-card blue">
        <div class="icon">👨‍⚕️</div>
        <div class="info">
          <h3>{{ stats.doctors }}</h3>
          <p>Médicos Disponibles</p>
        </div>
      </div>

      <div class="stat-card green">
        <div class="icon">🤒</div>
        <div class="info">
          <h3>{{ stats.patients }}</h3>
          <p>Pacientes Registrados</p>
        </div>
      </div>

      <div class="stat-card orange">
        <div class="icon">📅</div>
        <div class="info">
          <h3>{{ stats.activeAppointments }}</h3>
          <p>Citas Activas</p>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <section class="card quick-actions">
        <h2>⚡ Acciones Rápidas</h2>
        <div class="buttons-wrapper">
          <button @click="$router.push('/appointments')" class="action-btn">
            <span>➕</span> Nueva Cita
          </button>
          <button @click="$router.push('/patients')" class="action-btn">
            <span>👤</span> Nuevo Paciente
          </button>
          <button @click="$router.push('/doctors')" class="action-btn">
            <span>🥼</span> Añadir Médico
          </button>
        </div>
      </section>

      <section class="card upcoming-section">
        <h2>🔜 Próximas Citas</h2>

        <div v-if="loading" class="loading-text">Cargando datos...</div>

        <ul
          v-else-if="upcomingAppointments.length > 0"
          class="appointment-list"
        >
          <li
            v-for="app in upcomingAppointments"
            :key="app.id"
            class="appointment-item"
          >
            <div class="app-date">
              <span class="day">{{ getDay(app.appointmentDate) }}</span>
              <span class="month">{{ getMonth(app.appointmentDate) }}</span>
            </div>
            <div class="app-details">
              <strong>Dr. {{ app.doctorName }}</strong>
              <span>Paciente: {{ app.patientName }}</span>
            </div>
            <div class="app-status">
              {{ getTime(app.appointmentDate) }}
            </div>
          </li>
        </ul>

        <div v-else class="empty-text">No hay citas activas programadas.</div>
      </section>
    </div>
  </div>
</template>

<script>
import {
  getDoctors,
  getPatients,
  getAppointments,
} from "@/clients/MedicalClient";

export default {
  data() {
    return {
      stats: {
        doctors: 0,
        patients: 0,
        activeAppointments: 0,
      },
      appointments: [],
      loading: true,
      currentDate: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  },
  mounted() {
    this.loadDashboardData();
  },
  computed: {
    // Lógica para mostrar solo las próximas 3 citas activas
    upcomingAppointments() {
      return this.appointments
        .filter((app) => app.status === "ACTIVE") // Solo activas
        .sort(
          (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate),
        ) // Ordenar por fecha
        .slice(0, 3); // Tomar solo las 3 primeras
    },
  },
  methods: {
    async loadDashboardData() {
      try {
        // Ejecutamos las 3 peticiones en paralelo para que sea más rápido
        const [docs, pats, apps] = await Promise.all([
          getDoctors(),
          getPatients(),
          getAppointments(),
        ]);

        this.stats.doctors = docs.length;
        this.stats.patients = pats.length;
        this.appointments = apps;

        // Calculamos citas activas
        this.stats.activeAppointments = apps.filter(
          (a) => a.status === "ACTIVE",
        ).length;
      } catch (error) {
        console.error("Error loading dashboard", error);
      } finally {
        this.loading = false;
      }
    },
    // Helpers para formatear fecha visualmente
    getDay(dateStr) {
      return new Date(dateStr).getDate();
    },
    getMonth(dateStr) {
      return new Date(dateStr).toLocaleString("en-US", { month: "short" });
    },
    getTime(dateStr) {
      return new Date(dateStr).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
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

.stat-card {
  background: var(--color-surface);
  padding: 1.35rem 1.5rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-2);
  border: 1px solid var(--color-border);
  border-left: 4px solid transparent;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-1);
}

.stat-card.blue {
  border-left-color: var(--color-primary);
}
.stat-card.green {
  border-left-color: var(--color-accent);
}
.stat-card.orange {
  border-left-color: var(--color-danger);
}

.stat-card .icon {
  font-size: 1.8rem;
  background: var(--color-surface-muted);
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
}

.stat-card h3 {
  font-size: 1.8rem;
  margin: 0;
  font-weight: 700;
  color: var(--color-text);
}

.stat-card p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
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

.action-btn {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 0.9rem 1rem;
  border-radius: var(--radius-sm);
  text-align: left;
  font-size: 0.98rem;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: var(--color-text);
}

.action-btn span {
  font-size: 1.2rem;
}
.action-btn:hover {
  background: var(--color-surface-muted);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* UPCOMING LIST */
.appointment-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.appointment-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-border);
}

.appointment-item:last-child {
  border-bottom: none;
}

.app-date {
  background: rgba(11, 107, 203, 0.12);
  color: var(--color-primary);
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  text-align: center;
  min-width: 50px;
}

.app-date .day {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1;
}
.app-date .month {
  font-size: 0.7rem;
  text-transform: uppercase;
}

.app-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.app-details strong {
  color: var(--color-text);
  font-size: 0.95rem;
}
.app-details span {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}
.app-status {
  font-weight: 700;
  color: var(--color-text);
  font-size: 0.9rem;
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
