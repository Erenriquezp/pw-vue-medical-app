import axios from "axios";

const API_URL = 'http://localhost:8080/medical/api/v1.0'

const apiClient = axios.create({
   baseURL: API_URL,
   headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getDoctors = async () => {
   const response = await apiClient.get('/doctores');
   return response.data;
}

export const createDoctor = async (doctor) => {
   return (await apiClient.post('/doctores', doctor)).data;
}

export const getPatients = async () => {
   return (await apiClient.get('/pacientes')).data;
}

export const createPatient = async (patient) => {
   return (await apiClient.post('/pacientes', patient)).data;  
}

export const getAppointments = async () => {
   return (await apiClient.get('/citas')).data;   
}

export const createAppointment = async (appointment) => {
   return (await apiClient.post('/citas', appointment)).data;
}

export const cancelAppointment = async (id) => {
   return (await apiClient.patch(`/citas/${id}/cancelar`)).data;   
}