import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/groceries';

export const getGroceries = () => axios.get(BASE_URL);
export const addGrocery = (data) => axios.post(BASE_URL, data);
export const updateGrocery = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteGrocery = (id) => axios.delete(`${BASE_URL}/${id}`);
