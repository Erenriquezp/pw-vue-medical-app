import axios from "axios";

const API_URL = 'http://localhost:8080/medical/api/v1.0'

const apiClient = axios.create({
   baseURL: API_URL,
   headers: {
        'Content-Type': 'application/json'
    }
});

export const getDoctors = async () => {
   const response = await apiClient.get('/doctors');
   return response.data;
}

export const createDoctor = async (doctor) => {
   return (await apiClient.post('/doctors', doctor)).data;
}

export const getPatients = async () => {
   return (await apiClient.get('/patients')).data;
}

export const createPatient = async (patient) => {
   return (await apiClient.post('/patients', patient)).data;  
}

export const getAppointments = async () => {
   return (await apiClient.get('/appointments')).data;   
}

export const createAppointment = async (appointment) => {
   return (await apiClient.post('/appointments', appointment)).data;
}

export const cancelAppointment = async (id) => {
   return (await apiClient.patch(`/appointments/${id}/cancel`)).data;   
}