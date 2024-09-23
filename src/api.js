import axios from 'axios';

const api = axios.create({
  baseURL: 'http://13.60.104.170:8080/myapp',
});

export default api;
