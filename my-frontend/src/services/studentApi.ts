import axios from "axios";

const API = "http://localhost:5000/api/students";

export const getStudentWallet = async (userId: number) => {
  return axios.get(`${API}/wallet/${userId}`);
};

export const payVendor = (data: {
  studentAddress: string;
  vendorAddress: string;
  amount: number;
}) => {
  return axios.post(`${API}/pay`, data);
};

export const getStudentBalance = (address: string) => {
  return axios.get(`${API}/balance/${address}`);
};
