import axios from 'axios'

const API_URL = 'http://localhost:8080/medical/api/v1.0'

// No usamos interceptors ni apiClient: añadimos el token por petición

const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

// Funciones internas que realizan las llamadas a la API usando axios directamente
const getDoctorsInternal = async () => {
  const response = await axios.get(`${API_URL}/doctores`, getAuthHeaders)
  return response.data
}

const createDoctorInternal = async (doctor) => {
  const response = await axios.post(
    `${API_URL}/doctores`,
    doctor,
    getAuthHeaders()
  )
  return response.data
}

const getPatientsInternal = async () => {
  const response = await axios.get(`${API_URL}/pacientes`, getAuthHeaders())
  return response.data
}

const createPatientInternal = async (patient) => {
  const response = await axios.post(
    `${API_URL}/pacientes`,
    patient,
    getAuthHeaders()
  )
  return response.data
}

const getAppointmentsInternal = async () => {
  const response = await axios.get(`${API_URL}/citas`, getAuthHeaders())
  return response.data
}

const createAppointmentInternal = async (appointment) => {
  const response = await axios.post(
    `${API_URL}/citas`,
    appointment,
    getAuthHeaders()
  )
  return response.data
}

const cancelAppointmentInternal = async (id) => {
  const response = await axios.patch(
    `${API_URL}/citas/${id}/cancelar`,
    null,
    getAuthHeaders()
  )
  return response.data
}

// Fachadas exportadas (estilo AuthorizationClient)
export async function getDoctorsFacade() {
  return await getDoctorsInternal()
}

export async function createDoctorFacade(doctor) {
  return await createDoctorInternal(doctor)
}

export async function getPatientsFacade() {
  return await getPatientsInternal()
}

export async function createPatientFacade(patient) {
  return await createPatientInternal(patient)
}

export async function getAppointmentsFacade() {
  return await getAppointmentsInternal()
}

export async function createAppointmentFacade(appointment) {
  return await createAppointmentInternal(appointment)
}

export async function cancelAppointmentFacade(id) {
  return await cancelAppointmentInternal(id)
}
