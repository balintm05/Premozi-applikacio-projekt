import axios from 'axios';

const API_BASE_URL = 'https://localhost:7153/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
});

export const filmupload = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type':'multipart/form-data',
    }
})

