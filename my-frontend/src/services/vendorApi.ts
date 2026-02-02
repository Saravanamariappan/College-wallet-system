import axios from "axios";

const API = "http://localhost:5000/api/vendors";

export const getVendorSettings = (userId: number) => {
  return axios.get(`${API}/settings/${userId}`);
};
