import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/students`;

export const getStudentWallet = async (userId: number) => {
  return axios.get(`${API_BASE}/wallet/${userId}`);
};

export const payVendor = (data: {
  studentAddress: string;
  vendorAddress: string;
  amount: number;
}) => {
  return axios.post(`${API_BASE}/pay`, data);
};

export const getStudentBalance = (address: string) => {
  return axios.get(`${API_BASE}/balance/${address}`);
};

export const getStudentPrivateKey = async (userId: number) => {
  return axios.get(`${API_BASE}/private-key/${userId}`);
};

export const changeStudentPassword = (userId: number, oldPassword?: string, newPassword?: string) => {
  return axios.put(`/api/students/change-password/${userId}`, { oldPassword, newPassword });
};