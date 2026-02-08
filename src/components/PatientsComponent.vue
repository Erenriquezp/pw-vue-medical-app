<template lang="">
   <div class="container">
      <h2>Doctors</h2>
      <div>
         <h3>Registrar Nuevo Paciente</h3>
         <form @submit.prevent="savePatient">
            <input v-model="newPatient.firstName" type="text" placeholder="Nombre">
            <input v-model="newPatient.lastName" type="text" placeholder="Apellido">
            <input v-model="newPatient.birthDate" type="text" placeholder="Fehca de nacimiento">
            <input v-model="newPatient.email" type="email" placeholder="Email">
            <input v-model="newPatient.phoneNumber" type="text" placeholder="Celular">
            <input v-model="newPatient.address" type="text" placeholder="Direccion">
            <button type="submit">Guardar Paciente</button>
         </form>
      </div>
      <button @click="getAll">Consultar Todos</button>
      <table class="table">
         <thead>
            <tr>
               <th>ID</th>
               <th>Nombre</th>
               <th>Fehca de nacimiento</th>
               <th>Email</th>
               <th>Telefono</th>
               <th>Direccion</th>
            </tr>
         </thead>
         <tbody>
            <tr v-for="pat in patients">
               <td> {{ pat.id }}</td>
               <td> {{ pat.firstName }} {{ pat.lastName }}</td>
               <td> {{ pat.birthDate }}</td>
               <td> {{ pat.email }}</td>
               <td> {{ pat.phoneNumber }}</td>
               <td> {{ pat.address }}</td>
            </tr>
         </tbody>
      </table>
   </div>
</template>

<script>
import { createPatient, getPatients } from '@/clients/MedicalClient';

export default {
   data() {
      return {
         patients: null,
         newPatient: {
            firstName: "",
            lastName: "",
            birthDate: "",
            phoneNumber: "",
            email: "",
            address: ""
         },
         error: null,
      };
   },
   methods: {
      async getAll() {
         try {
            const res = await getPatients();
            this.patients = res;
         } catch (error) {
            this.error = "Error: " + error.message;
            this.doctors = null;
         }
      },
      async savePatient() {
         const body = {
            firstName: this.newPatient.firstName,
            lastName: this.newPatient.lastName,
            //birthDate: this.newPatient.birthDate,
            email: this.newPatient.email,
            phoneNumber: this.newPatient.phoneNumber,
            address: this.newPatient.address
         }
         await createPatient(body);
      }
   }
}
</script>

<style scoped>
   
</style>