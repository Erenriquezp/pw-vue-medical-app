<template lang="">
   <div class="container">
      <h2>Reporte de Citas</h2>
      <div class="card">
         <h3>Agendar Nueva Cita</h3>
         <form @submit.prevent="saveAppointment">
            <div class="form-group">
               <select v-model="newAppointment.doctorId">
                  <option value="">Escoger Doctor</option>
                  <option v-for="doc in doctors" :value="doc.id">
                     Dr. {{ doc.lastName }} - {{ doc.specialty }}
                  </option>
               </select>
            </div>
            <div class="form-group">
               <select v-model="newAppointment.patientId">
                  <option value="">Escoger Paciente</option>
                  <option v-for="pat in patients" :value="pat.id">
                     Dr. {{ pat.lastName }} - {{ pat.firstName }}
                  </option>
               </select>
            </div>
         <button type="submit" class="btn-primary full-width">Agendar Cita</button>
      </form>
      <button @click="getAll">Obtener Citas</button>
      </div>
      
      <h3>Lista de Citas</h3>
      <table class="table">
         <thead>
         <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Doctor</th>
            <th>Paciente</th>
            <th>Estado</th>
            <th>Acction</th>
         </tr>
         </thead>
         <tbody>
         <tr v-for="app in appointments" :key="app.id">
            <td>{{ app.id }}</td>
            <td>{{ app.appointmentDate }}</td>
            <td>{{ app.doctorName }}</td>
            <td>{{ app.patientName }}</td>
            <td>
               <span :class="['badge', app.status === 'ACTIVE' ? 'bg-active' : 'bg-inactive']">
               {{ app.status }}
               </span>
            </td>
            <td>
               <button 
               @click="cancel(app.id)" 
               class="btn-logout" 
               style="font-size: 0.8rem;">
               Cancel
               </button>
            </td>
         </tr>
         </tbody>
      </table>
   </div>
</template>
<script>
import { cancelAppointment, createAppointment, getAppointments, getDoctors, getPatients } from '@/clients/MedicalClient';

export default {
   data() {
      return {
         appointments: [],
         doctors: [],
         patients: [],
         newAppointment: {
            appointmentDate: '',
            doctorId: '',
            patientId: ''
         }
      };
   },
   methods: {
      async getAll() {
         this.appointments = await getAppointments();
      },
      async saveAppointment() {
         const body = {
            //appointmentDate: "",
            doctorId: this.newAppointment.doctorId,
            patientId: this.newAppointment.patientId
         }
         await createAppointment(body);
      },
      async cancel(id) {
         await cancelAppointment(id);
      },
      async loadAllData() {
         this.appointments = await getAppointments();
         this.doctors = await getDoctors();
         this.patients = await getPatients();
      }
   },
   mounted() {
      this.loadAllData();
   },
}
</script>
<style scoped>


</style>