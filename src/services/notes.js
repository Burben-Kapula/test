import axios from 'axios';

const baseUrl = '/api/persons'

// Отримати всі контакти (GET)
const getAll = () => {
    return axios.get(baseUrl).then(response => response.data);
};

// Додати новий контакт (POST)
const create = (newPerson) => {
    return axios.post(baseUrl, newPerson).then(response => response.data);
};

// Видалити контакт (DELETE) — знадобиться для 2.14
const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
};
const update = (id, changedPerson) => {
    return axios.put(`${baseUrl}/${id}`, changedPerson).then(res => res.data);
};
export default { getAll, create, remove, update };
