import axios from "axios";

const API = `${import.meta.env.VITE_API_BASE_URL}/api/vendors`;

export const getVendorSettings = (userId: number) => {
  return axios.get(`${API}/settings/${userId}`);
};
