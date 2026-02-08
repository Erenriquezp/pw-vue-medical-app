import axios from "axios";

const AUTH_URL = 'http://localhost:8082/auth/token';

export const getToken = async (user, password) => {
   try {
      console.log("Intentando Autenticar...")
      const response = await axios.get(AUTH_URL, {
         params: {user, password}
      });

      const token = response.data.accessToken;

      localStorage.setItem('jwt_token', token);
      localStorage.setItem('isAuthenticated', 'true');

      console.log("Token guardado en local storage.")
      return token;
   } catch (error) {
      console.log("Error de autenticacion: ", error);
      throw error;
   }
}

export const logOut = () => {
   localStorage.removeItem('jwt_token');
   localStorage.removeItem('isAuthenticated');
}