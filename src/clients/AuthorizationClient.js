import axios from 'axios'

const AUTH_URL = 'http://localhost:8082/auth/token'

async function getToken(user, password) {
  try {
    const response = await axios.get(
      `${AUTH_URL}?user=${user}&password=${password}`
    )
    const token = response.data.accessToken
    const expiresAt = response.data.expiresAt

    localStorage.setItem('jwt_token', token)
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('expiresAt', expiresAt)
  } catch (error) {
    console.log('Error de autenticacion: ', error)
    throw error
  }
}

function logOut() {
  localStorage.removeItem('jwt_token')
  localStorage.removeItem('isAuthenticated')
}

export async function getTokenFacade(user, password) {
  return await getToken(user, password)
}
export function logOutFacade() {
  return logOut()
}
