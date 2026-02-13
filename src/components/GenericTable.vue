<template>
  <table class="table generic-table">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.field">{{ col.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row[keyField]">
        <td v-for="col in columns" :key="col.field">
          <slot name="cell" :row="row" :col="col">
            {{ formatCell(row, col) }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'GenericTable',
  props: {
    columns: { type: Array, required: true },
    rows: { type: Array, default: () => [] },
    keyField: { type: String, default: 'id' }
  },
  methods: {
    formatCell(row, col) {
      if (col.field) return row[col.field]
      return ''
    }
  }
}
</script>

<style scoped>
.generic-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}
.generic-table th {
  background: rgba(11, 107, 203, 0.12);
  color: var(--color-text);
  padding: 12px;
  text-align: left;
}
.generic-table td {
  padding: 12px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-muted);
}
.generic-table tr:hover {
  background: var(--color-surface-muted);
}
</style>
