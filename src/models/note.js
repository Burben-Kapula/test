import axios from 'axios';

const baseUrl = '/api/notes';

// Отримати всі нотатки (GET)
const getAll = () => {
    return axios.get(baseUrl).then(response => response.data);
};

// Додати нову нотатку (POST)
const create = (newNote) => {
    return axios.post(baseUrl, newNote).then(response => response.data);
};

// Видалити нотатку (DELETE)
const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
};

// Оновити нотатку (PUT)
const update = (id, changedNote) => {
    return axios.put(`${baseUrl}/${id}`, changedNote).then(res => res.data);
};

export default { getAll, create, remove, update };
