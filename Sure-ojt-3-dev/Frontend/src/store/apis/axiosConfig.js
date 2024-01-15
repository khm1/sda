import axios from 'axios';

export function apiInstance() {
  const instance = axios.create({
    baseURL: 'http://192.168.103.97:8000',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  return instance;
}
