import axios from 'axios';

const BASE = '/api/users';

export const getUsers = async (params) => {
  const { data } = await axios.get(BASE, { params });
  return data; // { users, total }
};

export const getUser = async (id) => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};

export const updateUser = async (id, payload) => {
  const { data } = await axios.put(`${BASE}/${id}`, payload);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await axios.delete(`${BASE}/${id}`);
  return data;
};
