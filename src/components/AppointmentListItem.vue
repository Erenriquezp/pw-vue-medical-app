<template>
  <li class="appointment-item">
    <div class="app-date">
      <span class="day">{{ day }}</span>
      <span class="month">{{ month }}</span>
    </div>
    <div class="app-details">
      <strong>{{ doctorName }}</strong>
      <span>{{ patientLabel }}</span>
    </div>
    <div class="app-status">
      {{ time }}
    </div>
  </li>
</template>

<script>
export default {
  props: {
    day: {
      type: [Number, String],
      required: true
    },
    month: {
      type: String,
      required: true
    },
    doctorName: {
      type: String,
      required: true
    },
    patientLabel: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
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
</style>
