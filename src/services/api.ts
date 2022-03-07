import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://192.168.100.13:3000',
    timeout: 1000
  });