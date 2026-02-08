<template lang="">
   <div class="container">
      <h2>Reporte de Doctores</h2>
      <div class="card">
         <h3>Registrar Nuevo Doctor</h3>
         <form @submit.prevent="saveDoctor" class="form-grid">
            <div class="form-group">
                <label>Nombre:</label>
                <input v-model="newDoctor.firstName" type="text" required>
            </div>
            <div class="form-group">
                <label>Apellido:</label>
                <input v-model="newDoctor.lastName" type="text" required>
            </div>
            <div class="form-group">
                <label>Especialidad:</label>
                <input v-model="newDoctor.specialty" type="text" required>
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input v-model="newDoctor.email" type="email" required>
            </div>
            <div class="form-group">
                <label>Telefono:</label>
                <input v-model="newDoctor.phoneNumber" type="text">
            </div>
            <div class="form-group">
                <label>Numero de oficina:</label>
                <input v-model="newDoctor.officeNumber" type="text">
            </div>
            <button class="btn-primary full-with" type="submit">Guardar Doctor</button>
         </form>
      </div>
      <div class="report-section">
         <h3>Lista de Doctores</h3>
         <button @click="getAll">Consultar Todos</button>
         <table class="table">
            <thead>
               <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Specialty</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Office Phone</th>
               </tr>
            </thead>
            <tbody>
               <tr v-for="doc in doctors">
                  <td> {{ doc.id }}</td>
                  <td> {{ doc.firstName }} {{ doc.lastName }}</td>
                  <td> {{ doc.specialty }}</td>
                  <td> {{ doc.email }}</td>
                  <td> {{ doc.phoneNumber }}</td>
                  <td> {{ doc.officeNumber }}</td>
               </tr>
            </tbody>
         </table>
      </div>
      
   </div>
</template>

<script>
import { createDoctor, getDoctors } from '@/clients/MedicalClient';

export default {
   data() {
      return {
         doctors: [],
         newDoctor: {
            firstName: '',
            lastName: '',
            specialty: '',
            email: '',
            phoneNumber: '',
            officeNumber: ''
         },
         error: null,
      };
   },
   methods: {
      async getAll() {
         try {
            this.doctors = await getDoctors();
         } catch (error) {
            alert("Error loading doctors: " + error.message);
         }
      },
      async saveDoctor() {
         try {
            await createDoctor(this.newDoctor);

            await this.getAll();

            this.newDoctor = { firstName: '', lastName: '', specialty: '', email: '', phoneNumber: '', officeNumber: '' };

         } catch (error) {
            alert("Error saving doctor");
         }
      }
   }
}
</script>

<style scoped>
.container {
   max-width: 900px;
   margin: 0 auto;
   padding: 20px;
}

.card {
   background: #f9f9f9;
   padding: 20px;
   border-radius: 8px;
   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
   margin-bottom: 30px;
}

.form-grid {
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 15px;
}

.form-group {
   display: flex;
   flex-direction: column;
}

.form-group label {
   font-weight: bold;
   font-size: 0.9em;
   margin-bottom: 5px;
}

.form-group input {
   padding: 8px;
   border: 1px solid #ccc;
   border-radius: 4px;
}

.full-width {
   grid-column: span 2;
}

.btn-primary {
   background-color: #007bff;
   color: white;
   border: none;
   padding: 10px 20px;
   cursor: pointer;
   border-radius: 4px;
   font-size: 1em;
}

.btn-primary:hover {
   background-color: #0056b3;
}

.report-section {
   margin-top: 20px;
}

.search-input {
   width: 100%;
   padding: 10px;
   margin-bottom: 15px;
   border: 1px solid #ddd;
   border-radius: 4px;
}

.table {
   width: 100%;
   border-collapse: collapse;
   margin-top: 10px;
}

.table th {
   background-color: #007bff;
   color: white;
   padding: 10px;
   text-align: left;
}

.table td {
   border-bottom: 1px solid #ddd;
   padding: 10px;
}

.table tr:hover {
   background-color: #f1f1f1;
}
</style>