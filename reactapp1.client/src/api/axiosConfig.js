import axios from 'axios';

export const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:7153/api`;

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

