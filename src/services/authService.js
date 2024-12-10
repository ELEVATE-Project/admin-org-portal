// src/services/authService.js
import axios from 'axios'

const API_URL = 'http://localhost:3001/user/v1/admin'

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password })
}

export default {
  login,
}
